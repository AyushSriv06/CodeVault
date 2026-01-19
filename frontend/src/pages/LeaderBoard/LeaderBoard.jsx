/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { getUserData } from "../../services/getUserData";
import { getLeaderBoard } from "../../services/getLeaderBoard";
import Loading from "../../components/Loading/Loading";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "../../components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Avatar } from "../../components/ui/avatar"; // Assuming you might create this, or basic img for now
import { Crown } from "lucide-react";

function LeaderBoard() {
	const [data, setData] = useState();
	const [selectedUser, setSelectedUser] = useState(null);
	const [userData, setUserData] = useState();
	const [loadingUser, setLoadingUser] = useState(false);

	useEffect(() => {
		async function fetchData() {
			try {
				const leaderboardData = await getLeaderBoard();
				leaderboardData.sort(
					(a, b) => b.attemptedQuestions.length - a.attemptedQuestions.length
				);
				setData(leaderboardData);
			} catch (error) {
				console.error("Failed to fetch leaderboard", error);
			}
		}
		fetchData();
	}, []);

	useEffect(() => {
		async function fetchUser() {
			if (selectedUser) {
				setLoadingUser(true);
				try {
					const res = await getUserData(selectedUser);
					setUserData(res.data);
				} catch (error) {
					console.error("Failed to fetch user data", error);
				} finally {
					setLoadingUser(false);
				}
			} else {
				setUserData(null);
			}
		}
		fetchUser();
	}, [selectedUser]);

	function getDaysSince(dateString) {
		const currentDate = new Date();
		const createDate = new Date(dateString);
		const differenceMs = currentDate - createDate;
		const daysSince = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
		return daysSince;
	}

	return (
		<div className="min-h-screen bg-background flex flex-col">
			<Header />
			<main className="flex-1 container mx-auto px-4 py-8 mt-16 flex flex-col items-center">
				<div className="w-full max-w-4xl">
					<div className="mb-6">
						<h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
						<p className="text-muted-foreground">Top performers in CodeVault.</p>
					</div>

					{data ? (
						<div className="rounded-md border border-border bg-card">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-[100px]">Rank</TableHead>
										<TableHead>User</TableHead>
										<TableHead className="text-right">Solved</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.map((entry, index) => (
										<TableRow
											key={index}
											className="cursor-pointer hover:bg-muted/50 transition-colors"
											onClick={() => setSelectedUser(entry.email)}
										>
											<TableCell className="font-medium">
												<div className="flex items-center gap-2">
													{index + 1}
													{index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
													{index === 1 && <Crown className="h-4 w-4 text-gray-400" />}
													{index === 2 && <Crown className="h-4 w-4 text-amber-700" />}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-3">
													<Avatar className="h-8 w-8">
														<AvatarImage src={`https://ui-avatars.com/api/?name=${entry.email.charAt(0)}&background=random`} alt={entry.username} />
														<AvatarFallback>{entry.email.charAt(0).toUpperCase()}</AvatarFallback>
													</Avatar>
													<span className="font-medium">{entry.username}</span>
												</div>
											</TableCell>
											<TableCell className="text-right">
												{entry.attemptedQuestions?.length || 0}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					) : (
						<div className="w-full h-64 flex items-center justify-center">
							<Loading />
						</div>
					)}
				</div>
			</main>

			<Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>User Profile</DialogTitle>
					</DialogHeader>
					{loadingUser ? (
						<div className="py-8 flex justify-center"><Loading /></div>
					) : userData ? (
						<div className="flex flex-col items-center gap-6 py-4">
							<img
								src={`https://ui-avatars.com/api/?name=${userData.email.charAt(0)}&background=random`}
								alt={userData.username}
								className="h-24 w-24 rounded-full border-4 border-muted"
							/>
							<div className="w-full space-y-4">
								<div className="flex justify-between border-b pb-2">
									<span className="text-muted-foreground">Username</span>
									<span className="font-medium">{userData.username}</span>
								</div>
								<div className="flex justify-between border-b pb-2">
									<span className="text-muted-foreground">Email</span>
									<span className="font-medium">{userData.email}</span>
								</div>
								<div className="flex justify-between border-b pb-2">
									<span className="text-muted-foreground">Member Since</span>
									<span className="font-medium">{getDaysSince(userData.createdAt)} days ago</span>
								</div>
							</div>
						</div>
					) : (
						<div className="py-4 text-center text-muted-foreground">User not found</div>
					)}
				</DialogContent>
			</Dialog>

			<Footer />
		</div>
	);
}

export default LeaderBoard;
