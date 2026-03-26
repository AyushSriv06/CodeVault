const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const runCodeRoute = require("./routes/runCodeRoute");
const practiceProblemsRoute = require("./routes/practiceProblemsRoute");
const authRoute = require("./routes/authRoute");
const submissionsRoute = require("./routes/submissionsRoute");
const mongoose = require("mongoose");
const getSubmissionsRoute = require("./routes/getSubmissionsRoute");
const getStatsRoute = require("./routes/getStatsRoute");
const getUserDataRoute = require("./routes/getUserDataRoute");
const googleAuthRoute = require("./routes/googleAuthRoute");
const jobStatusRoute = require("./routes/jobStatusRoute");
const socketController = require("./controller/socketController");

// Initialize queue worker
require("./worker/executionWorker");
const leaderboard = require("./routes/leaderBoardRoute");
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
        res.send("The server is running , this is just a test route");
});

app.use("/run", runCodeRoute);
app.use("/job", jobStatusRoute);
app.use("/practiceproblems", practiceProblemsRoute);
app.use("/register", authRoute);
app.use("/submissions", submissionsRoute);
app.use("/getsubmissions", getSubmissionsRoute);
app.use("/getstats", getStatsRoute);
app.use("/getuser", getUserDataRoute);
app.use("/leaderboard", leaderboard);
app.use("/googleauth", googleAuthRoute);

mongoose.connect(process.env.DB_URL, {})
        .then(() => {
                console.log("MongoDB connected");
                const server = app.listen(port, "0.0.0.0", () => {
                        console.log(`Server is running on http://localhost:${port}`);
                });
                socketController(server);
        })
        .catch((err) => console.error("MongoDB connection error:", err));
