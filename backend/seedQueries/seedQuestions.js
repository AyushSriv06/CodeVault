const mongoose = require("mongoose");
const Question = require("../models/Question");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const questionsFilePath = path.join(__dirname, "../../frontend/src/data/questionsdata.json");

const seedQuestions = async () => {
    try {
        console.log("Connecting to DB at:", process.env.DB_URL);
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to MongoDB");

        const data = fs.readFileSync(questionsFilePath, "utf-8");
        const questions = JSON.parse(data);

        console.log(`Found ${questions.length} questions to seed.`);

        for (const q of questions) {
            // Ensure diff is lowercase if schema requires (schema says ["easy", ...])
            if (q.diff) q.diff = q.diff.toLowerCase();

            await Question.findOneAndUpdate({ id: q.id }, q, { upsert: true, new: true, setDefaultsOnInsert: true });
            console.log(`Processed question: ${q.title}`);
        }

        console.log("Seeding completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding questions:", error);
        process.exit(1);
    }
};

seedQuestions();
