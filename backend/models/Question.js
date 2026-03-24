const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
        id: {
                type: String,
                required: true,
        },
        title: {
                type: String,
                required: true,
        },
        description: {
                type: String,
                required: true,
        },
        constraints: {
                type: [String],
                default: [],
        },
        topics: {
                type: [String],
                default: [],
        },
        diff: {
                type: String,
                enum: ["easy", "medium", "hard"],
                required: true,
        },
        example_cases: {
                type: [
                        {
                                input: mongoose.Schema.Types.Mixed,
                                output: mongoose.Schema.Types.Mixed,
                                explanation: String,
                        },
                ],
                required: true,
        },
        test_cases: {
                type: [
                        {
                                input: String,
                                output: String,
                                isHidden: {
                                        type: Boolean,
                                        default: false,
                                },
                        },
                ],
                default: [],
        },
        solution: {
                type: {
                        c: String,
                        cpp: String,
                        java: String,
                        python: String,
                },
                required: true,
        },
        boilerplate: {
                type: {
                        c: String,
                        cpp: String,
                        java: String,
                        python: String,
                },
                required: true,
        },
        templatecode: {
                type: {
                        c: String,
                        cpp: String,
                        java: String,
                        python: String,
                },
                required: true,
        },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
