const { Worker } = require("bullmq");
const connection = require("../queue/connection");
const { EXECUTION_QUEUE_NAME } = require("../queue/executionQueue");
const { executeCode } = require("../services/executionService");
const PracticeSubmission = require("../models/PracticeSubmission");
const CompilerSubmission = require("../models/CompilerSubmission");
const Question = require("../models/Question");
const UserStats = require("../models/UserStats");

/**
 * Handle practice problem submission processing
 */
async function handlePracticeSubmission(jobData) {
	const { code, language, questionID, userEmail, userName } = jobData;

	const question = await Question.findOne({ id: questionID });
	if (!question) throw new Error("Question not found");

	const templateCode = question.templatecode?.[language] || "";
	const fullCode = `${code}\n${templateCode}`;

	const result = await executeCode(language, fullCode, "");
	
	const failedStatus = (result.stdout || "").includes("Failed");
	const passed = !failedStatus;
	const practiceStatus = passed ? "Passed" : "Failed";

	if (userEmail && userName) {
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
				userStats = new UserStats({ emailID: userEmail, userName: userName });
			}
			if (!userStats.attemptedQuestions.includes(question.id)) {
				if (question.diff === "easy") userStats.attempts.easy++;
				if (question.diff === "medium") userStats.attempts.medium++;
				if (question.diff === "hard") userStats.attempts.hard++;
				userStats.attemptedQuestions.push(questionID);
			}
			await userStats.save();
		}
	}

	return { ...result, status: passed };
}

/**
 * Handle online compiler submission processing
 */
async function handleCompilerSubmission(jobData) {
	const { code, language, userInput, userEmail, userName } = jobData;
	
	const result = await executeCode(language, code, userInput || "");

	if (userEmail && userName) {
		const submission = new CompilerSubmission({
			user_email: userEmail,
			user_name: userName,
			language,
			code,
			input: userInput || "",
			output: result.stdout || result.stderr,
		});
		await submission.save();
	}

	return result;
}

const worker = new Worker(
	EXECUTION_QUEUE_NAME,
	async (job) => {
		console.log(`[Worker] Started job ${job.id} of type ${job.name}`);
		try {
			if (job.name === "practice") {
				return await handlePracticeSubmission(job.data);
			} else if (job.name === "compiler") {
				return await handleCompilerSubmission(job.data);
			}
			throw new Error(`Unknown job type: ${job.name}`);
		} catch (error) {
			console.error(`[Worker] Job ${job.id} failed:`, error.message);
			throw error;
		}
	},
	{ 
		connection,
		concurrency: parseInt(process.env.WORKER_CONCURRENCY) || 5 
	}
);

worker.on("completed", (job, returnvalue) => {
	console.log(`[Worker] Job ${job.id} completed in ${returnvalue.executionTime}ms`);
});

worker.on("failed", (job, err) => {
	console.error(`[Worker] Job ${job.id} failed with error: ${err.message}`);
});

module.exports = worker;
