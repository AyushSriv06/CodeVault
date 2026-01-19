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
		<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
			<div className="flex items-center px-2 border-b border-white/10 bg-transparent">
				<TabsList className="bg-transparent border-b-0 h-9 p-0 rounded-none">
					<TabsTrigger
						value="input"
						className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 px-4 h-9 text-zinc-400"
					>
						Input
					</TabsTrigger>
					<TabsTrigger
						value="output"
						className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 px-4 h-9 text-zinc-400"
					>
						Output
					</TabsTrigger>
				</TabsList>
			</div>

			<TabsContent value="input" className="flex-1 p-0 m-0 relative h-full">
				<div className="absolute inset-0">
					<InputWindow />
				</div>
			</TabsContent>
			<TabsContent value="output" className="flex-1 p-0 m-0 relative h-full">
				<div className="absolute inset-0">
					<OutputWindow />
				</div>
			</TabsContent>
		</Tabs>
	);
};

export default RightPart;
