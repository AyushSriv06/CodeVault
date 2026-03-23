const { executeCode } = require("../services/executionService");
const CompilerSubmission = require("../models/CompilerSubmission");

const onlineCompiler = async (req, res) => {
	try {
		const { code, userInput, language, userEmail, userName } = req.body;

		if (!code || !language) {
			return res.status(400).json({
				error: "Missing required fields: code and language",
			});
		}

		const result = await executeCode(language, code, userInput || "");
		if (userEmail && userName) {
			try {
				const submission = new CompilerSubmission({
					user_email: userEmail,
					user_name: userName,
					language,
					code,
					input: userInput || "",
					output: result.stdout || result.stderr,
				});
				await submission.save();
			} catch (dbErr) {
				console.error("Failed to save submission:", dbErr.message);
				// Don't fail the request if DB save fails
			}
		}

		return res.status(200).json({
			stdout: result.stdout,
			stderr: result.stderr,
			exitCode: result.exitCode,
			executionTime: result.executionTime,
		});
	} catch (error) {
		console.error("Execution error:", error.message);

		// Validation errors return 400
		if (error.message.includes("Forbidden pattern") || error.message.includes("Unsupported language")) {
			return res.status(400).json({ error: error.message });
		}

		return res.status(500).json({ error: "Internal execution error" });
	}
};

module.exports = onlineCompiler;
