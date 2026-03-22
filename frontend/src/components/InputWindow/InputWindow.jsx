/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserInput } from "../../redux/slices/userInputSlice";
import { Textarea } from "../ui/textarea";
import { Keyboard } from "lucide-react";

const InputWindow = ({ socket, roomID }) => {
	const userInput = useSelector((state) => state.userInput?.value);
	const dispatch = useDispatch();

	const handleInputChange = (event) => {
		dispatch(updateUserInput(event.target.value));
		socket &&
			socket.emit("inputUpdate", {
				userInput: event.target.value,
				roomID: roomID,
			});
	};

	return (
		<div className="flex-1 h-full w-full bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl group hover:border-white/20 transition-all duration-300 flex flex-col">
			<div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5 shrink-0">
				<Keyboard className="w-4 h-4 text-zinc-400" />
				<div className="text-xs text-zinc-400 font-mono">standard input</div>
			</div>
			<div className="flex-1 h-full p-2 relative">
				<Textarea
					className="absolute inset-0 h-full w-full border-0 bg-transparent focus-visible:ring-0 resize-none font-mono text-zinc-300 placeholder:text-zinc-600 p-4 focus:outline-none"
					name="userInput"
					id="userInput"
					value={userInput || ""}
					placeholder="Enter input here..."
					onChange={handleInputChange}
				/>
			</div>
		</div>
	);
};

export default InputWindow;
