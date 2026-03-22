/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { useSelector } from "react-redux";
import { Textarea } from "../ui/textarea";
import { Terminal } from "lucide-react";

function OutputWindow({ outputValue }) {
	const output = useSelector((state) => state.output?.value);

	return (
		<div className="flex-1 h-full w-full bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl group hover:border-white/20 transition-all duration-300 flex flex-col">
			<div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5 shrink-0">
				<Terminal className="w-4 h-4 text-zinc-400" />
				<div className="text-xs text-zinc-400 font-mono">console output</div>
			</div>
			<div className="flex-1 h-full p-2 relative">
				<Textarea
					placeholder="Output will be displayed here..."
					className="absolute inset-0 h-full w-full border-0 bg-transparent focus-visible:ring-0 resize-none font-mono text-zinc-300 placeholder:text-zinc-600 p-4 focus:outline-none"
					readOnly
					value={output || ""}
				/>
			</div>
		</div>
	);
}

export default OutputWindow;
