const { executeInDocker } = require("./dockerExecutor");
const { validateCode } = require("./codeValidator");

/**
 * Central execution service. This is the single entry point for all code execution.
 * In Stage 3 we'll swap dockerExecutor for k8sExecutor based on EXECUTOR_MODE env var.
 *
 * @param {string} language 
 * @param {string} code 
 * @param {string} userInput 
 * @returns {Promise<{stdout: string, stderr: string, exitCode: number, executionTime: number}>}
 */
async function executeCode(language, code, userInput = "") {
	// Step 1: Validate code
	validateCode(language, code, userInput);

	// Step 2: Execute in the appropriate runtime
	const executorMode = process.env.EXECUTOR_MODE || "docker";

	switch (executorMode) {
		case "docker":
			return executeInDocker(language, code, userInput);
		// case "k8s":
		//   return executeInK8s(language, code, userInput);  // Stage 3
		default:
			throw new Error(`Unknown executor mode: ${executorMode}`);
	}
}

module.exports = { executeCode };
