import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { isLoggedIn } from "../Login/isLoggedIn";

export default function Stats({ response }) {
        const problemsSolved = {
                easy: response?.data?.attempts?.easy || 0,
                medium: response?.data?.attempts?.medium || 0,
                hard: response?.data?.attempts?.hard || 0,
        };
	const TotalProblems = {
		easy: response?.totalCounts?.easy || 0,
		medium: response?.totalCounts?.medium || 0,
		hard: response?.totalCounts?.hard || 0,
	};

        const calculatePercentage = (solved, total) => {
                if (!total) return 0;
                return Math.min(100, Math.max(0, (solved / total) * 100));
        };

        return (
                <Card className="bg-black/40 border-white/10 backdrop-blur-md w-full">
                        <CardHeader className="pb-2">
                                <CardTitle className="text-xl font-bold text-white">Your Progress</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                                {!isLoggedIn() && (
                                        <div className="text-red-400 text-sm bg-red-500/10 p-2 rounded-md border border-red-500/20 text-center mb-4">
                                                Please login to track stats
                                        </div>
                                )}

                                <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                                <span className="text-green-500 font-medium">Easy</span>
                                                <span className="text-zinc-400">
                                                        {problemsSolved.easy} <span className="text-zinc-600">/ {TotalProblems.easy}</span>
                                                </span>
                                        </div>
                                        <Progress
                                                value={calculatePercentage(problemsSolved.easy, TotalProblems.easy)}
                                                className="bg-green-500/10"
                                                indicatorColor="bg-green-500"
                                        />
                                </div>

                                <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                                <span className="text-yellow-500 font-medium">Medium</span>
                                                <span className="text-zinc-400">
                                                        {problemsSolved.medium} <span className="text-zinc-600">/ {TotalProblems.medium}</span>
                                                </span>
                                        </div>
                                        <Progress
                                                value={calculatePercentage(problemsSolved.medium, TotalProblems.medium)}
                                                className="bg-yellow-500/10"
                                                indicatorColor="bg-yellow-500"
                                        />
                                </div>

                                <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                                <span className="text-red-500 font-medium">Hard</span>
                                                <span className="text-zinc-400">
                                                        {problemsSolved.hard} <span className="text-zinc-600">/ {TotalProblems.hard}</span>
                                                </span>
                                        </div>
                                        <Progress
                                                value={calculatePercentage(problemsSolved.hard, TotalProblems.hard)}
                                                className="bg-red-500/10"
                                                indicatorColor="bg-red-500"
                                        />
                                </div>
                        </CardContent>
                </Card>
        );
}
