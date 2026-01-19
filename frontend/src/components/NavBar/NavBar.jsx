/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import LanguageSelector from "./LanguageSelector";
import RunButton from "./RunButton";
import ResetCode from "./ResetCode";
import Settings from "./Settings";
import { useDispatch, useSelector } from "react-redux";
import { updateCode } from "../../redux/slices/codeSlice";
import { updateLanguage } from "../../redux/slices/languageSlice";
import { updateOutput } from "../../redux/slices/outputSlice";
import { updateUserInput } from "../../redux/slices/userInputSlice";
import { useLocation } from "react-router-dom";
// import "./NavBar.css"; // Removed old CSS

const NavBar = ({ socket, roomID }) => {
        const location = useLocation();
        const dispatch = useDispatch();
        useEffect(() => {
                dispatch(updateLanguage("java"));
                dispatch(updateOutput(""));
                dispatch(updateUserInput(""));
                dispatch(updateCode(""));
        }, [location.pathname]); // Fixed dependency array

        const language = useSelector((state) => state.language?.value);

        // Helper to get file extension based on language
        const getFileExtension = (lang) => {
                const map = {
                        c: "c",
                        cpp: "cpp",
                        java: "java",
                        python: "py",
                        javascript: "js"
                };
                return map[lang] || "txt";
        };

        const fileName = `Main.${getFileExtension(language)}`;

        return (
                <div className="w-full h-10 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between pl-0 pr-2">
                        {/* File Tab Design - merged into main bar */}
                        <div className="flex items-center h-full">
                                <div className="flex items-center bg-[#1e1e1e] border-t-2 border-t-blue-500 border-r border-zinc-800 text-zinc-100 px-4 py-2 text-sm select-none cursor-pointer h-full">
                                        <span className="mr-2 text-blue-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                                        </span>
                                        {fileName}
                                        <span className="ml-3 text-zinc-500 hover:text-zinc-300">×</span>
                                </div>
                        </div>

                        <div className="flex items-center space-x-2">
                                <LanguageSelector socket={socket} roomID={roomID} />
                                <div className="h-4 w-[1px] bg-zinc-700 mx-2"></div>
                                <ResetCode />
                                <Settings />
                                <RunButton />
                        </div>
                </div>
        );
};

export default NavBar;
