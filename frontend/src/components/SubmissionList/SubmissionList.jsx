/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
	onlineCompilerSubmissions,
	practiceProblemsSubmissions,
} from "../../services/submissionsApi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "../ui/badge";

const SubmissionList = () => {
	const email = localStorage.getItem("email");
	const [compilerSubmissions, setCompilerSubmissions] = useState(null);
	const [practiceSubmissions, setPracticeSubmissions] = useState(null);

	const getPracticeSubmissions = () => {
		practiceProblemsSubmissions(email).then((res) => {
			setPracticeSubmissions([...res].reverse());
		});
	};

	const getCompilerSubmissions = () => {
		onlineCompilerSubmissions(email).then((res) => {
			setCompilerSubmissions([...res].reverse());
		});
	};

	useEffect(() => {
		getPracticeSubmissions();
		getCompilerSubmissions();
	}, []);

	const formatDateTime = (dateTime) => {
		const date = new Date(dateTime);
		const options = { month: "long", day: "numeric", year: "numeric" };
		const dateString = date.toLocaleDateString(undefined, options);
		const timeString = date.toLocaleTimeString(undefined, {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
		return `${dateString} at ${timeString}`;
	};

	return (
		<div className="w-full space-y-6">
			<Tabs defaultValue="practice" className="w-full flex flex-col items-center">
				<TabsList className="grid w-full max-w-md grid-cols-2 bg-zinc-900 border border-zinc-800">
					<TabsTrigger value="practice" className="data-[state=active]:bg-zinc-800 text-zinc-400 data-[state=active]:text-zinc-100">
						Practice Problems
					</TabsTrigger>
					<TabsTrigger value="compiler" className="data-[state=active]:bg-zinc-800 text-zinc-400 data-[state=active]:text-zinc-100">
						Online Compiler
					</TabsTrigger>
				</TabsList>

				<TabsContent value="practice" className="w-full mt-6 space-y-4">
					{practiceSubmissions && practiceSubmissions.length > 0 ? (
						practiceSubmissions.map((submission, index) => {
							const i = submission.output?.indexOf("Test case 1");
							const trimmed_result = i !== -1 ? submission.output?.substring(i) : submission.output;
							return (
								<Card key={submission._id} className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm overflow-hidden">
									<CardHeader className="bg-zinc-900/80 border-b border-zinc-800 py-3 px-4">
										<div className="flex justify-between items-center">
											<div className="flex items-center text-zinc-400 text-sm">
												<span className="font-mono text-zinc-500 mr-2">#{practiceSubmissions.length - index}</span>
												<Calendar className="w-4 h-4 mr-2 opacity-70" />
												{formatDateTime(submission.createdAt)}
											</div>
											<Badge variant={submission.status === "Success" ? "default" : "destructive"} className={submission.status === "Success" ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : "bg-red-500/10 text-red-500 hover:bg-red-500/20"}>
												{submission.status}
											</Badge>
										</div>
									</CardHeader>
									<CardContent className="p-0">
										<div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x divide-zinc-800">
											<div className="p-0 max-h-[300px] overflow-auto custom-scrollbar">
												<SyntaxHighlighter
													language={submission.language}
													style={vscDarkPlus}
													customStyle={{
														margin: 0,
														padding: "1rem",
														background: "transparent",
														fontSize: "0.9rem",
														lineHeight: "1.5",
													}}
													wrapLines={true}
												>
													{submission.code}
												</SyntaxHighlighter>
											</div>
											<div className="p-4 bg-zinc-950/30 flex flex-col space-y-2">
												<div>
													<span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Output</span>
													<div className="font-mono text-sm text-zinc-300 bg-zinc-950/50 p-3 rounded border border-zinc-800 whitespace-pre-wrap">
														{trimmed_result}
													</div>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							);
						})
					) : (
						<EmptyState message="No practice submissions yet." />
					)}
				</TabsContent>

				<TabsContent value="compiler" className="w-full mt-6 space-y-4">
					{compilerSubmissions && compilerSubmissions.length > 0 ? (
						compilerSubmissions.map((submission, index) => (
							<Card key={submission._id} className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm overflow-hidden">
								<CardHeader className="bg-zinc-900/80 border-b border-zinc-800 py-3 px-4">
									<div className="flex justify-between items-center">
										<div className="flex items-center text-zinc-400 text-sm">
											<span className="font-mono text-zinc-500 mr-2">#{compilerSubmissions.length - index}</span>
											<Calendar className="w-4 h-4 mr-2 opacity-70" />
											{formatDateTime(submission.createdAt)}
										</div>
									</div>
								</CardHeader>
								<CardContent className="p-0">
									<div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x divide-zinc-800">
										<div className="p-0 max-h-[300px] overflow-auto custom-scrollbar">
											<SyntaxHighlighter
												language={submission.language}
												style={vscDarkPlus}
												customStyle={{
													margin: 0,
													padding: "1rem",
													background: "transparent",
													fontSize: "0.9rem",
													lineHeight: "1.5",
												}}
												wrapLines={true}
											>
												{submission.code}
											</SyntaxHighlighter>
										</div>
										<div className="p-4 bg-zinc-950/30 flex flex-col space-y-4">
											<div>
												<span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Input</span>
												<div className="font-mono text-sm text-zinc-400 bg-zinc-950/50 p-2 rounded border border-zinc-800 whitespace-pre-wrap min-h-[40px]">
													{submission.input || <span className="text-zinc-700 italic">No input</span>}
												</div>
											</div>
											<div>
												<span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Output</span>
												<div className="font-mono text-sm text-zinc-300 bg-zinc-950/50 p-3 rounded border border-zinc-800 whitespace-pre-wrap">
													{submission.output}
												</div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					) : (
						<EmptyState message="No compiler submissions yet." />
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
};

const EmptyState = ({ message }) => (
	<div className="flex flex-col items-center justify-center py-16 text-zinc-500">
		<XCircle className="w-12 h-12 mb-4 opacity-20" />
		<p className="text-lg">{message}</p>
	</div>
);

export default SubmissionList;
