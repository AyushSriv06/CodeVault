const Redis = require("ioredis");

const redisConfig = {
	host: process.env.REDIS_HOST || "localhost",
	port: process.env.REDIS_PORT || 6379,
	// Add password/tls configs if needed for production
	maxRetriesPerRequest: null,
};

const connection = new Redis(redisConfig);

module.exports = connection;
