const express = require("express");
const router = express.Router();
const UserStats = require("../models/UserStats");
const Question = require("../models/Question");

router.post("/", async (req, res) => {
	const { email } = req.body;
	const data = await UserStats.findOne({ emailID: email });

	// Get total counts by difficulty
	const totalQuestions = await Question.aggregate([
		{ $group: { _id: "$diff", count: { $sum: 1 } } },
	]);

	const totalCounts = {
		easy: 0,
		medium: 0,
		hard: 0,
	};

	totalQuestions.forEach((item) => {
		if (totalCounts.hasOwnProperty(item._id)) {
			totalCounts[item._id] = item.count;
		}
	});

	res.status(200).json({ data, totalCounts });
});

module.exports = router;
