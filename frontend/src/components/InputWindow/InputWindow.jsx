/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserInput } from "../../redux/slices/userInputSlice";
import { Textarea } from "../ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"; // Removed

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
                <div className="h-full w-full bg-[#1e1e1e] p-2">
                        <Textarea
                                className="h-full w-full border-0 bg-transparent focus-visible:ring-0 resize-none font-mono text-zinc-300 placeholder:text-zinc-600 p-2 focus:outline-none"
                                name="userInput"
                                id="userInput"
                                value={userInput || ""}
                                placeholder="Enter input here..."
                                onChange={handleInputChange}
                        />
                </div>
        );
};

export default InputWindow;
