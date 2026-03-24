const { Worker } = require("bullmq");
const connection = require("../queue/connection");
const { EXECUTION_QUEUE_NAME } = require("../queue/executionQueue");
const { executeCode } = require("../services/executionService");
const PracticeSubmission = require("../models/PracticeSubmission");
const CompilerSubmission = require("../models/CompilerSubmission");
const Question = require("../models/Question");
const UserStats = require("../models/UserStats");

function parseJudgeOutput(stdout = "") {
	const startMarker = "__JUDGE_START__";
	const endMarker = "__JUDGE_END__";
	const start = stdout.indexOf(startMarker);
	const end = stdout.indexOf(endMarker);

	if (start === -1 || end === -1 || end <= start) {
		return null;
	}

	const body = stdout
		.slice(start + startMarker.length, end)
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean);

	let total = 0;
	let passed = 0;
	const cases = [];

	for (const line of body) {
		if (line.startsWith("TOTAL|")) {
			total = parseInt(line.split("|")[1], 10) || 0;
			continue;
		}

		if (line.startsWith("PASSED|")) {
			passed = parseInt(line.split("|")[1], 10) || 0;
			continue;
		}

		if (line.startsWith("CASE|")) {
			const parts = line.split("|");
			cases.push({
				index: parseInt(parts[1], 10) || 0,
				passed: parts[2] === "PASS",
				input: parts[3] || "",
				expected: parts[4] || "",
				got: parts.slice(5).join("|") || "",
			});
		}
	}

	if (total === 0 && cases.length > 0) {
		total = cases.length;
	}

	return { total, passed, cases };
}

function buildPracticeSummary(judge, fallbackStdout = "", fallbackStderr = "") {
	if (!judge) {
		return fallbackStdout || fallbackStderr || "No output returned.";
	}

	const failedCases = judge.cases.filter((c) => !c.passed);
	const lines = [];
	const accepted = judge.total > 0 && judge.passed === judge.total;

	lines.push(`Verdict: ${accepted ? "Accepted" : "Wrong Answer"}`);
	lines.push(`Passed ${judge.passed}/${judge.total} test cases.`);

	if (failedCases.length > 0) {
		lines.push("");
		lines.push("Failed Cases:");
		for (const failed of failedCases.slice(0, 3)) {
			lines.push(
				`#${failed.index} Input: ${failed.input} | Expected: ${failed.expected} | Got: ${failed.got}`
			);
		}
		if (failedCases.length > 3) {
			lines.push(`...and ${failedCases.length - 3} more failed case(s).`);
		}
	}

	return lines.join("\n");
}

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
	const judge = parseJudgeOutput(result.stdout || "");
	const fallbackPassed =
		(result.stdout || "").includes("Passed") && !(result.stdout || "").includes("Failed");
	const passed =
		judge && judge.total > 0 ? judge.passed === judge.total : fallbackPassed && !result.stderr;
	const practiceStatus = passed ? "Passed" : "Failed";
	const summary = buildPracticeSummary(judge, result.stdout, result.stderr);

	if (userEmail && userName) {
		const submission = new PracticeSubmission({
			user_email: userEmail,
			user_name: userName,
			language,
			code,
			output: summary,
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

	return {
		...result,
		stdout: summary,
		status: passed,
		judge,
	};
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
