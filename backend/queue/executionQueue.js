const { Queue } = require("bullmq");
const connection = require("./connection");

const EXECUTION_QUEUE_NAME = "execution-queue";

const executionQueue = new Queue(EXECUTION_QUEUE_NAME, { connection });

module.exports = { executionQueue, EXECUTION_QUEUE_NAME };
