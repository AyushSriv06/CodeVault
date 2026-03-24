const express = require("express");
const router = express.Router();
const { executionQueue } = require("../queue/executionQueue");

router.get("/:id", async (req, res) => {
	res.set('Cache-Control', 'no-store');
	try {
		const job = await executionQueue.getJob(req.params.id);
		
		if (!job) {
			return res.status(404).json({ error: "Job not found" });
		}

		const state = await job.getState();
		
		if (state === "completed") {
			// Spread the result to match the previous synchronous API signature for now
			return res.status(200).json({
				status: "completed",
				...job.returnvalue
			});
		} else if (state === "failed") {
			return res.status(500).json({
				status: "failed",
				error: job.failedReason
			});
		}

		return res.status(200).json({ status: state }); // queued, active, delayed
	} catch (error) {
		console.error("Job status fetch error:", error.message);
		return res.status(500).json({ error: "Could not fetch job status" });
	}
});

module.exports = router;
