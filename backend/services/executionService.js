const { validateCode } = require("./codeValidator");
const { executeInDocker } = require("./dockerExecutor");
const { executeInK8s } = require("./k8sExecutor");

const EXECUTOR_MODE = process.env.EXECUTOR_MODE || "docker";

/**
 * Execute the code using the configured executor
 */
async function executeCode(language, code, userInput = "") {
	try {
		validateCode(language, code, userInput);

		if (EXECUTOR_MODE === "kubernetes" || EXECUTOR_MODE === "k8s") {
			return await executeInK8s(language, code, userInput);
		} else {
			return await executeInDocker(language, code, userInput);
		}
	} catch (error) {
		console.error("Execution service error:", error.message);
		throw error;
	}
}

module.exports = { executeCode };
