/* eslint-disable no-unused-vars */
import { useState } from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import LeftPart from "../../components/LeftPart/LeftPart";
import RightPart from "../../components/RightPart/RightPart";
// import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

function OnlineCompiler() {
	return (
		<div className="min-h-screen bg-background flex flex-col">
			<Header />

			<main className="flex-1 pt-14 h-[calc(100vh-theme(spacing.16))] overflow-hidden">
				{/* Flexbox fallback for broken react-resizable-panels */}
				<div className="flex h-full flex-row">
					<div className="w-1/2 h-full p-4 overflow-y-auto border-r border-border bg-card">
						<LeftPart />
					</div>

					{/* Resizer Visual (Static for now) */}
					<div className="w-1 bg-border hover:bg-primary transition-colors cursor-col-resize hidden md:block" />

					<div className="w-1/2 h-full p-4 bg-background">
						<RightPart />
					</div>
				</div>
			</main>
		</div>
	);
}

export default OnlineCompiler;
