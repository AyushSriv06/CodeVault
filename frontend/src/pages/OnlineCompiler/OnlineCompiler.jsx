/* eslint-disable no-unused-vars */
import { useState } from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import LeftPart from "../../components/LeftPart/LeftPart";
import RightPart from "../../components/RightPart/RightPart";
// import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

function OnlineCompiler() {
	return (
		<div className="h-screen w-full bg-black text-white relative flex flex-col overflow-hidden selection:bg-purple-500/30">
			<Header />

			{/* Background Gradients */}
			<div className="fixed inset-0 z-0 pointer-events-none">
				<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
			</div>

			<main className="flex-1 mt-14 flex flex-row overflow-hidden relative z-10 w-full">
				<div className="w-1/2 p-4 flex flex-col overflow-hidden border-r border-white/10 bg-black/40 backdrop-blur-sm">
					<LeftPart />
				</div>

				{/* Resizer Visual (Static for now) */}
				<div className="w-1 shrink-0 bg-white/10 hover:bg-primary transition-colors cursor-col-resize hidden md:block" />

				<div className="flex-1 p-4 flex flex-col overflow-hidden bg-black/40 backdrop-blur-sm">
					<RightPart />
				</div>
			</main>
		</div>
	);
}

export default OnlineCompiler;
