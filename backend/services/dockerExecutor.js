const { spawn } = require("child_process");
const { v4: uuidv4 } = require("uuid");

const LANGUAGE_CONFIG = {
	c: { image: "codevault-cpp-runner", ext: "c", compile: true },
	cpp: { image: "codevault-cpp-runner", ext: "cpp", compile: true },
	java: { image: "codevault-java-runner", ext: "java", compile: true },
	python: { image: "codevault-python-runner", ext: "py", compile: false },
};

const EXECUTION_TIMEOUT = parseInt(process.env.EXECUTION_TIMEOUT) || 10000; // 10s
const MEMORY_LIMIT = process.env.MEMORY_LIMIT || "128m";

/**
 * Execute code inside a Docker container using spawn.
 * Code and input are passed via environment variables — no temp files on host.
 *
 * @param {string} language
 * @param {string} code 
 * @param {string} userInput 
 * @returns {Promise<{stdout: string, stderr: string, exitCode: number, executionTime: number}>}
 */
async function executeInDocker(language, code, userInput = "") {
	const config = LANGUAGE_CONFIG[language];
	if (!config) {
		throw new Error(`Unsupported language: ${language}`);
	}

	const containerName = `cv-exec-${uuidv4().slice(0, 8)}`;
	const startTime = Date.now();

	return new Promise((resolve, reject) => {
		const args = [
			"run",
			"--rm",
			"--name", containerName,
			"--memory", MEMORY_LIMIT,
			"--cpus", "0.5",
			"--network", "none",
			"--pids-limit", "64",
			"--read-only",
			"--tmpfs", "/tmp:rw,exec,nosuid,size=64m",
			"-e", `CODE=${Buffer.from(code).toString("base64")}`,
			"-e", `LANGUAGE=${config.ext}`,
			"-i",
			config.image,
		];

		const proc = spawn("docker", args, {
			stdio: ["pipe", "pipe", "pipe"],
		});

		let stdout = "";
		let stderr = "";
		let killed = false;

		proc.stdout.on("data", (data) => {
			stdout += data.toString();
			// Cap output at 64KB to prevent memory abuse
			if (stdout.length > 65536) {
				proc.kill("SIGKILL");
				killed = true;
			}
		});

		proc.stderr.on("data", (data) => {
			stderr += data.toString();
			if (stderr.length > 65536) {
				proc.kill("SIGKILL");
				killed = true;
			}
		});

		// Timeout enforcement
		const timer = setTimeout(() => {
			killed = true;
			proc.kill("SIGKILL");
			// Force-remove container in case it's still dangling
			spawn("docker", ["rm", "-f", containerName], { stdio: "ignore" });
		}, EXECUTION_TIMEOUT);

		proc.on("close", (exitCode) => {
			clearTimeout(timer);
			const executionTime = Date.now() - startTime;

			if (killed && stdout.length > 65536) {
				resolve({
					stdout: stdout.substring(0, 65536),
					stderr: "Output truncated: exceeded 64KB limit.",
					exitCode: 137,
					executionTime,
				});
			} else if (killed) {
				resolve({
					stdout,
					stderr: `Execution timed out after ${EXECUTION_TIMEOUT / 1000}s`,
					exitCode: 137,
					executionTime,
				});
			} else {
				resolve({ stdout, stderr, exitCode, executionTime });
			}
		});

		proc.on("error", (err) => {
			clearTimeout(timer);
			reject(new Error(`Docker spawn error: ${err.message}`));
		});
	});
}

module.exports = { executeInDocker, LANGUAGE_CONFIG };
