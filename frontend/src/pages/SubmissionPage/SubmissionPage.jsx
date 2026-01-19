/* eslint-disable no-unused-vars */
import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { isLoggedIn } from "../../components/Login/isLoggedIn";
import SubmissionList from "../../components/SubmissionList/SubmissionList";
import Register from "../../components/Login/Register";

const SubmissionPage = () => {
	return (
		<div className="min-h-screen bg-zinc-950 relative overflow-hidden text-zinc-100 selection:bg-blue-500/30 flex flex-col">
			{/* Background Gradients */}
			<div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
				<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
				<div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-blue-500/5 rounded-full blur-[100px]" />
				<div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[120px]" />
			</div>

			<div className="relative z-10 flex flex-col h-full flex-grow">
				{/* Header */}
				<div className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
					<Header />
				</div>

				{/* Main Content */}
				<div className="flex-grow w-full flex justify-center py-8 px-4">
					{isLoggedIn() ? (
						<div className="w-full max-w-7xl">
							<SubmissionList />
						</div>
					) : (
						<div className="flex justify-center items-center h-full w-full">
							<div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
								<h2 className="text-2xl font-bold mb-6 text-zinc-100">
									Please Login to View Submissions
								</h2>
								<Register />
							</div>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="border-t border-white/5 bg-black/40 backdrop-blur-sm py-4">
					<Footer />
				</div>
			</div>
		</div>
	);
};

export default SubmissionPage;
