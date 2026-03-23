const express = require("express");
const router = express.Router();
const onlineCompiler = require("../controller/onlineCompiler");
const practiceProblemController = require("../controller/practiceProblemController");

router.post("/onlinecompiler", onlineCompiler);
router.post("/practiceproblems", practiceProblemController);

module.exports = router;
