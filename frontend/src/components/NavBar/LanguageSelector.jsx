/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// src/components/LanguageSelector.js

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateLanguage } from "../../redux/slices/languageSlice";
import { updateOutput } from "../../redux/slices/outputSlice";
import { updateUserInput } from "../../redux/slices/userInputSlice";
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
} from "../ui/select";

const LanguageSelector = ({ socket, roomID }) => {
        const language = useSelector((state) => state.language?.value);
        const dispatch = useDispatch();
        const languageOptions = [
                { name: "C", value: "c" },
                { name: "C++", value: "cpp" },
                { name: "Java", value: "java" },
                { name: "Python", value: "python" },
        ];

        const handleLanguageChange = (value) => {
                dispatch(updateLanguage(value));
                dispatch(updateOutput(""));
                dispatch(updateUserInput(""));
                socket && socket.emit("languageChange", { language: value, roomID: roomID });
        };

        return (
                <div className="w-[120px]">
                        <Select value={language} onValueChange={handleLanguageChange}>
                                <SelectTrigger className="h-8 bg-zinc-800 border-zinc-700 text-zinc-100">
                                        <SelectValue placeholder="Language" />
                                </SelectTrigger>
                                <SelectContent>
                                        {languageOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                        {option.name}
                                                </SelectItem>
                                        ))}
                                </SelectContent>
                        </Select>
                </div>
        );
};

export default LanguageSelector;
