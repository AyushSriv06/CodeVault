import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import InputWindow from "../InputWindow/InputWindow";
import OutputWindow from "../OutputWindow/OutputWindow";
import { useSelector } from "react-redux";

const RightPart = () => {
	const toggleOutput = useSelector((state) => state.toggleOutput?.value);
	const [activeTab, setActiveTab] = useState("input");

	useEffect(() => {
		if (toggleOutput) {
			setActiveTab("output");
		}
	}, [toggleOutput]);

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 min-h-0 flex flex-col gap-3">
			<div className="flex items-center">
				<TabsList className="bg-zinc-900/40 border border-white/10 backdrop-blur-md rounded-lg p-1 h-10">
					<TabsTrigger
						value="input"
						className="rounded-md data-[state=active]:bg-white/10 data-[state=active]:text-white px-6 h-8 text-zinc-400 hover:text-zinc-200 transition-colors"
					>
						Input
					</TabsTrigger>
					<TabsTrigger
						value="output"
						className="rounded-md data-[state=active]:bg-white/10 data-[state=active]:text-white px-6 h-8 text-zinc-400 hover:text-zinc-200 transition-colors"
					>
						Output
					</TabsTrigger>
				</TabsList>
			</div>

			<TabsContent value="input" className="data-[state=active]:flex flex-col flex-1 h-full p-0 m-0 min-h-0 overflow-hidden outline-none">
				<InputWindow socket={null} roomID={null} />  {/* Need to pass socket if needed, but previously wasn't in component properly unless passed through? I see InputWindow component didn't receive props in the original RightPart.jsx */}
			</TabsContent>
			<TabsContent value="output" className="data-[state=active]:flex flex-col flex-1 h-full p-0 m-0 min-h-0 overflow-hidden outline-none">
				<OutputWindow />
			</TabsContent>
		</Tabs>
	);
};

export default RightPart;
