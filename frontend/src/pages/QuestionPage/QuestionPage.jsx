/* eslint-disable no-inner-declarations */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchQuestionById } from "../../services/practiceProblemsApi";
import Header from "../../components/Header/Header.jsx";
import Question from "../../components/Question/Question.jsx";
import ProblemList from "../../components/ProblemList/ProblemList.jsx";
import NavBar from "../../components/NavBar/NavBar.jsx";
import CodeEditor from "../../components/CodeEditor/CodeEditor.jsx";
import OutputWindow from "../../components/OutputWindow/OutputWindow.jsx";
import ProblemSolutions from "../../components/ProblemSolutions/ProblemSolutions.jsx";
import QuestionSubmission from "../../components/SubmissionList/QuestionSubmission.jsx";
import { isLoggedIn } from "../../components/Login/isLoggedIn.js";
import { getUserStatus } from "../../services/getUserStats.js";
import FullScreenConfetti from "../../components/Confetti/FullScreenConfetti.jsx";
import Loading from "../../components/Loading/Loading.jsx";
import { useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

const QuestionPage = () => {
        const [loading, setLoading] = useState(false);
        const { id } = useParams();
        const [question, setQuestion] = useState(null);
        const toggleOutput = useSelector((state) => state.toggleOutput?.value);
        const practiceStatus = useSelector((state) => state.practiceStatus?.value);
        const [response, setResponse] = useState();

        useEffect(() => {
                const fetchData = async () => {
                        try {
                                setLoading(true);
                                const question = await fetchQuestionById(id);
                                setQuestion(question);
                                setLoading(false);
                        } catch (error) {
                                console.error("Error fetching questions:", error);
                        }
                };
                fetchData();
                if (isLoggedIn()) {
                        const email = localStorage.getItem("email");
                        async function handleStats() {
                                const response = await getUserStatus(email);
                                setResponse(response);
                        }
                        handleStats();
                }
        }, [id]);

        if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center"><Loading /></div>;

        return (
                <div className="min-h-screen bg-zinc-950 flex flex-col relative overflow-hidden text-zinc-100 selection:bg-purple-500/30">
                        {/* Background Gradients */}
                        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
                                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[50%] bg-blue-500/5 rounded-full blur-[100px]" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full flex-grow">
                                {/* Header */}
                                <div className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-sm z-50">
                                        <Header />
                                </div>

                                <div className="flex-grow p-4 lg:p-6 overflow-hidden flex flex-col lg:flex-row gap-4 h-[calc(100vh-4rem)]">
                                        {practiceStatus && <FullScreenConfetti />}

                                        {/* Left Panel: Tabs & Content */}
                                        <div className="w-full lg:w-1/2 h-full flex flex-col bg-zinc-900/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                                                <Tabs defaultValue="question" className="w-full h-full flex flex-col">
                                                        <div className="border-b border-white/10 bg-zinc-900/60 px-2 pt-2">
                                                                <TabsList className="w-full bg-transparent justify-start h-auto p-0 gap-1">
                                                                        <TabsTrigger value="question" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none px-4 py-2 hover:bg-white/5 transition-colors">
                                                                                Question
                                                                        </TabsTrigger>
                                                                        <TabsTrigger value="solution" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none px-4 py-2 hover:bg-white/5 transition-colors">
                                                                                Solution
                                                                        </TabsTrigger>
                                                                        <TabsTrigger value="submissions" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none px-4 py-2 hover:bg-white/5 transition-colors">
                                                                                Submissions
                                                                        </TabsTrigger>
                                                                        <TabsTrigger value="problemlist" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none px-4 py-2 hover:bg-white/5 transition-colors">
                                                                                Problem List
                                                                        </TabsTrigger>
                                                                </TabsList>
                                                        </div>

                                                        <div className="flex-grow overflow-hidden relative bg-zinc-950/30">
                                                                <TabsContent value="question" className="h-full overflow-y-auto custom-scrollbar p-0 m-0 data-[state=active]:flex flex-col">
                                                                        {question && <Question question={question} />}
                                                                </TabsContent>
                                                                <TabsContent value="solution" className="h-full overflow-y-auto custom-scrollbar p-4 m-0">
                                                                        {question && <ProblemSolutions question={question} />}
                                                                </TabsContent>
                                                                <TabsContent value="submissions" className="h-full overflow-y-auto custom-scrollbar p-4 m-0">
                                                                        {question && <QuestionSubmission />}
                                                                </TabsContent>
                                                                <TabsContent value="problemlist" className="h-full overflow-y-auto custom-scrollbar p-4 m-0">
                                                                        <ProblemList response={response} />
                                                                </TabsContent>
                                                        </div>
                                                </Tabs>
                                        </div>

                                        {/* Right Panel: Code Editor */}
                                        <div className="w-full lg:w-1/2 h-full flex flex-col bg-zinc-900/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
                                                <div className="flex-none z-20 bg-zinc-900/80 border-b border-white/5">
                                                        <NavBar />
                                                </div>

                                                <div className="flex-1 min-h-0 p-3">
                                                        <CodeEditor question={question} />
                                                </div>

                                                {toggleOutput && (
                                                        <div className="h-[35%] min-h-[180px] p-3 pt-0">
                                                                <OutputWindow />
                                                        </div>
                                                )}
                                        </div>
                                </div>
                        </div>
                </div>
        );
};

export default QuestionPage;
