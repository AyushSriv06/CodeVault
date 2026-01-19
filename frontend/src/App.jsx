import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./main.css";
import HomePage from "./pages/HomePage/HomePage";
import Success from "./pages/Success/Success";
import QuestionPage from "./pages/QuestionPage/QuestionPage";
import SubmissionPage from "./pages/SubmissionPage/SubmissionPage";
import Settings from "./pages/Settings/Settings";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Room from "./pages/Room/Room";
import CodeRoom from "./pages/Room/CodeRoom";
import LeaderBoard from "./pages/LeaderBoard/LeaderBoard";
import ErrorPage from "./pages/404/Error";
import GoogleRedirect from "./pages/GoogleRedirect/GoogleRedirect";
import OnlineCompiler from "./pages/OnlineCompiler/OnlineCompiler";
import PracticeProblems from "./pages/PracticeProblems/PracticeProblems";

function App() {
        console.log("App.jsx: Component rendering (BATCH B)");
        return (
                <div className="h-full w-full">
                        <Router>
                                <Routes>
                                        <Route path="/success" element={<Success />} />
                                        <Route path="/" element={<HomePage />} />
                                        <Route path="/onlinecompiler" element={<OnlineCompiler />} />
                                        <Route path="/practiceproblems" element={<PracticeProblems />} />
                                        <Route path="/practiceproblems/questions/:id" element={<QuestionPage />} />
                                        <Route path="/submissions" element={<SubmissionPage />} />
                                        <Route path="/settings" element={<Settings />} />
                                        {/* <Route path="/success" element={<Success />} /> */}
                                        <Route path="/room" element={<Room />} />
                                        <Route path="/room/:roomID" element={<CodeRoom />} />
                                        <Route path="/leaderboard" element={<LeaderBoard />} />
                                        <Route path="/google/redirect" element={<GoogleRedirect />} />
                                        <Route path="*" element={<ErrorPage />} />
                                </Routes>
                                <ToastContainer position="bottom-right" pauseOnFocusLoss={false} pauseOnHover={false} />
                        </Router>
                </div>
        );
}

export default App;
