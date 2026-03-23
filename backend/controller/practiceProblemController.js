const { executionQueue } = require("../queue/executionQueue");

const practiceProblemController = async (req, res) => {
	try {
		const { code, language, questionID, userEmail, userName } = req.body;

		if (!code || !language || !questionID) {
			return res.status(400).json({
				error: "Missing required fields: code, language, and questionID",
			});
		}

		// Enqueue the job instead of executing synchronously
		const job = await executionQueue.add("practice", {
			code,
			language,
			questionID,
			userEmail,
			userName,
		});

		return res.status(200).json({
			jobId: job.id,
			status: "queued",
		});
	} catch (error) {
		console.error("Practice enqueue error:", error.message);
		return res.status(500).json({ error: "Internal enqueue error" });
	}
};

module.exports = practiceProblemController;
