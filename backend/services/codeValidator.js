const FORBIDDEN_PATTERNS = {
	c: [
		"system(", "exec(", "popen(", "fork(", "unistd.h",
		"#include <sys/", "dlopen", "mmap(",
	],
	cpp: [
		"system(", "exec(", "popen(", "fork(", "unistd.h",
		"#include <sys/", "dlopen", "mmap(",
	],
	java: [
		"Runtime.exec", "ProcessBuilder", "getRuntime()",
		"java.lang.reflect", "java.net.", "java.io.File",
	],
	python: [
		"subprocess", "os.system", "os.spawn", "os.exec",
		"import os", "from os", "__import__", "eval(",
		"exec(", "compile(", "importlib",
	],
};

/**
 * Validate code against forbidden patterns for the given language.
 * @param {string} language
 * @param {string} code
 * @param {string} userInput
 * @throws {Error} if forbidden pattern is found
 */
function validateCode(language, code, userInput = "") {
	const patterns = FORBIDDEN_PATTERNS[language];
	if (!patterns) {
		throw new Error(`No validation rules for language: ${language}`);
	}

	const combined = `${code}\n${userInput}`;

	for (const pattern of patterns) {
		if (combined.includes(pattern)) {
			throw new Error(`Forbidden pattern detected: "${pattern}"`);
		}
	}
}

module.exports = { validateCode, FORBIDDEN_PATTERNS };
