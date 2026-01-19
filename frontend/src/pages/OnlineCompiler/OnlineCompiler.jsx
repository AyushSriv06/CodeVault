/* eslint-disable no-unused-vars */
import { useState } from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import LeftPart from "../../components/LeftPart/LeftPart";
import RightPart from "../../components/RightPart/RightPart";
// import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

function OnlineCompiler() {
	return (
		<div className="min-h-screen bg-black text-white relative flex flex-col overflow-hidden selection:bg-purple-500/30">
			<Header />

			{/* Background Gradients */}
			<div className="fixed inset-0 z-0 pointer-events-none">
				<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
			</div>

			<main className="flex-1 pt-14 h-[calc(100vh-theme(spacing.16))] overflow-hidden relative z-10">
				{/* Flexbox fallback for broken react-resizable-panels */}
				<div className="flex h-full flex-row">
					<div className="w-1/2 h-full p-4 overflow-y-auto border-r border-white/10 bg-black/40 backdrop-blur-sm">
						<LeftPart />
					</div>

					{/* Resizer Visual (Static for now) */}
					<div className="w-1 bg-white/10 hover:bg-primary transition-colors cursor-col-resize hidden md:block" />

					<div className="w-1/2 h-full p-4 bg-black/40 backdrop-blur-sm">
						<RightPart />
					</div>
				</div>
			</main>
		</div>
	);
}

export default OnlineCompiler;
