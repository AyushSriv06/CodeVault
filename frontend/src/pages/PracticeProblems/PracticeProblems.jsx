/* eslint-disable no-inner-declarations */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import ProblemList from "../../components/ProblemList/ProblemList";
import Header from "../../components/Header/Header";
import Stats from "../../components/Stats/Stats";
import Footer from "../../components/Footer/Footer";
import { getUserStatus } from "../../services/getUserStats";
import { isLoggedIn } from "../../components/Login/isLoggedIn";
import Loading from "../../components/Loading/Loading";
const PracticeProblems = () => {
        const [response, setResponse] = useState();
        useEffect(() => {
                if (isLoggedIn()) {
                        const email = localStorage.getItem("email");
                        async function handleStats() {
                                const response = await getUserStatus(email);
                                setResponse(response);
                        }
                        handleStats();
                }
        }, []);
        return (
                <div className="min-h-screen bg-black text-white relative flex flex-col overflow-hidden selection:bg-purple-500/30">
                        <Header />

                        {/* Background Gradients */}
                        <div className="fixed inset-0 z-0 pointer-events-none">
                                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
                                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
                        </div>

                        <main className="flex-1 container mx-auto px-4 py-8 mt-16 flex flex-col lg:flex-row gap-6 relative z-10">
                                {/* Stats Sidebar */}
                                <div className="w-full lg:w-1/4">
                                        <div className="sticky top-24">
                                                <Stats response={response} />
                                        </div>
                                </div>

                                {/* Problem List */}
                                <div className="w-full lg:w-3/4">
                                        <h2 className="text-3xl font-bold tracking-tight mb-6">Problems</h2>
                                        <ProblemList response={response} />
                                </div>
                        </main>

                        <Footer />
                </div>
        );
};

export default PracticeProblems;
