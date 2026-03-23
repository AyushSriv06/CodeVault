const { executeCode } = require("../services/executionService");
const PracticeSubmission = require("../models/PracticeSubmission");
const Question = require("../models/Question");
const UserStats = require("../models/UserStats");

const practiceProblemController = async (req, res) => {
	try {
		const { code, language, questionID, userEmail, userName } = req.body;

		if (!code || !language || !questionID) {
			return res.status(400).json({
				error: "Missing required fields: code, language, and questionID",
			});
		}

		// Fetch the question to get template code
		const question = await Question.findOne({ id: questionID });
		if (!question) {
			return res.status(404).json({ error: "Question not found" });
		}

		// Concatenate user code with template/test code
		const templateCode = question.templatecode?.[language] || "";
		const fullCode = `${code}\n${templateCode}`;

		// Execute using the centralized service (no temp files, no legacy Docker)
		const result = await executeCode(language, fullCode, "");

		// Determine pass/fail from output
		const failedStatus = (result.stdout || "").includes("Failed");
		const passed = !failedStatus;
		const practiceStatus = passed ? "Passed" : "Failed";

		// Save submission and update stats
		if (userEmail && userName) {
			try {
				const submission = new PracticeSubmission({
					user_email: userEmail,
					user_name: userName,
					language,
					code,
					output: result.stdout || result.stderr,
					question_id: questionID,
					status: practiceStatus,
				});
				await submission.save();

				if (passed) {
					let userStats = await UserStats.findOne({ emailID: userEmail });
					if (!userStats) {
						userStats = new UserStats({
							emailID: userEmail,
							userName: userName,
						});
					}
					if (!userStats.attemptedQuestions.includes(question.id)) {
						if (question.diff === "easy") userStats.attempts.easy++;
						if (question.diff === "medium") userStats.attempts.medium++;
						if (question.diff === "hard") userStats.attempts.hard++;
						userStats.attemptedQuestions.push(questionID);
					}
					await userStats.save();
				}
			} catch (dbErr) {
				console.error("Failed to save practice submission:", dbErr.message);
			}
		}

		return res.status(200).json({
			stdout: result.stdout,
			stderr: result.stderr,
			exitCode: result.exitCode,
			executionTime: result.executionTime,
			status: passed,
		});
	} catch (error) {
		console.error("Practice execution error:", error.message);

		if (error.message.includes("Forbidden pattern") || error.message.includes("Unsupported language")) {
			return res.status(400).json({ error: error.message });
		}

		return res.status(500).json({ error: "Internal execution error" });
	}
};

module.exports = practiceProblemController;
