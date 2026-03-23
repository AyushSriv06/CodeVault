const { executionQueue } = require("../queue/executionQueue");

const onlineCompiler = async (req, res) => {
	try {
		const { code, userInput, language, userEmail, userName } = req.body;

		if (!code || !language) {
			return res.status(400).json({
				error: "Missing required fields: code and language",
			});
		}

		// Enqueue the job instead of executing synchronously
		const job = await executionQueue.add("compiler", {
			code,
			userInput,
			language,
			userEmail,
			userName,
		});

		return res.status(200).json({
			jobId: job.id,
			status: "queued",
		});
	} catch (error) {
		console.error("Queue enqueue error:", error.message);
		return res.status(500).json({ error: "Internal enqueue error" });
	}
};

module.exports = onlineCompiler;
