/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { React, useState, useEffect } from "react";
import { fetchAllQuestions } from "../../services/practiceProblemsApi";
import { Link } from "react-router-dom";
import capitalizeString from "../../services/capitaliseWord";

import Loading from "../Loading/Loading";
import { useSelector, useDispatch } from "react-redux";
import { updateOutput } from "../../redux/slices/outputSlice";
import { updateToggleOutput } from "../../redux/slices/toggleOutput";
import { updatePracticeStatus } from "../../redux/slices/practiceStatusSlice";
import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { CheckCircle2 } from "lucide-react";

const ProblemList = ({ response }) => {
        const output = useSelector((state) => state.output?.value);
        const dispatch = useDispatch();
        const [questions, setQuestions] = useState([]);
        const attemptedQuestions = response?.data?.attemptedQuestions || [];
        const [loading, setLoading] = useState(true);

        useEffect(() => {
                const fetchData = async () => {
                        try {
                                setLoading(true);
                                const questionsData = await fetchAllQuestions();
                                setQuestions(questionsData);
                        } catch (error) {
                                console.error("Error fetching questions:", error);
                        } finally {
                                setLoading(false);
                        }
                };

                fetchData();
        }, [output]);

        const resetConfetti = () => {
                dispatch(updateOutput(""));
                dispatch(updatePracticeStatus(false));
                dispatch(updateToggleOutput(false));
        };

        const getDifficultyBadge = (diff) => {
                switch (diff) {
                        case "easy":
                                return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">{capitalizeString(diff)}</Badge>;
                        case "medium":
                                return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">{capitalizeString(diff)}</Badge>;
                        case "hard":
                                return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">{capitalizeString(diff)}</Badge>;
                        default:
                                return <Badge variant="outline">{capitalizeString(diff)}</Badge>;
                }
        };

        if (loading) {
                return <Loading />;
        }

        return (
                <div className="w-full h-full rounded-md border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden shadow-xl">
                        <div className="overflow-auto h-full"> {/* Allow scrolling inside container */}
                                <Table>
                                        <TableHeader>
                                                <TableRow>
                                                        <TableHead className="w-[100px]">Status</TableHead>
                                                        <TableHead>Problem</TableHead>
                                                        <TableHead className="w-[100px] text-right">Difficulty</TableHead>
                                                </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                                {questions.map((question) => (
                                                        <TableRow key={question.id}>
                                                                <TableCell>
                                                                        {attemptedQuestions.includes(question.id) && (
                                                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                                        )}
                                                                </TableCell>
                                                                <TableCell className="font-medium">
                                                                        <Link
                                                                                onClick={resetConfetti}
                                                                                to={`/practiceproblems/questions/${question.id}`}
                                                                                className="hover:text-primary transition-colors hover:underline"
                                                                        >
                                                                                {question.title}
                                                                        </Link>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                        {getDifficultyBadge(question.diff)}
                                                                </TableCell>
                                                        </TableRow>
                                                ))}
                                        </TableBody>
                                </Table>
                        </div>
                </div>
        );
};

export default ProblemList;
