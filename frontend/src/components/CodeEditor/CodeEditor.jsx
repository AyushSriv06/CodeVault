/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useLocation } from "react-router-dom";
import { getBoilerplateCode } from "../../services/getBoilerPlateCode";
import { useDispatch, useSelector } from "react-redux";
import { updateCode } from "../../redux/slices/codeSlice";

function CodeEditor({ question, socket, roomID, users }) {
	const code = useSelector((state) => state.code?.value);
	const tabSize = useSelector((state) => state.tabSize?.value);
	const language = useSelector((state) => state.language?.value);
	const editorTheme = useSelector((state) => state.editorTheme?.value);
	const font = useSelector((state) => state.font?.value);
	const dispatch = useDispatch();
	let location = useLocation();

	useEffect(() => {
		const username = localStorage.getItem("username");
		if (users && users.length === 2 && users[0].username === username) {
			socket && socket.emit("codeUpdate", { code: code, roomID: roomID });
		}
	}, [users]);

	useEffect(() => {
		const boilerplateCode = getBoilerplateCode(location, language, question);
		dispatch(updateCode(boilerplateCode));
	}, [tabSize, language, location.pathname, dispatch, question]);

	const handleChange = (value) => {
		dispatch(updateCode(value));
		socket && socket.emit("codeUpdate", { code: value, roomID: roomID });
	};

	const mapLanguageToMonaco = (lang) => {
		if (lang === "c" || lang === "cpp") return "cpp";
		if (lang === "java") return "java";
		if (lang === "python") return "python";
		if (lang === "javascript") return "javascript";
		if (lang === "csharp") return "csharp";
		if (lang === "ruby") return "ruby";
		return "javascript";
	};

	// We default to VS Dark for the sleek glassmorphism look, 
	// unless the user specified a light theme (optional handling).
	const getMonacoTheme = (theme) => {
		if (theme && theme.includes("light")) return "light";
		return "vs-dark";
	};

	return (
		<div className="w-full flex-1 h-full flex flex-col text-base bg-zinc-900/40 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl overflow-hidden group hover:border-white/20 transition-colors">
			<div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5 shrink-0">
				<div className="flex gap-2">
					<div className="w-3 h-3 rounded-full bg-red-500/80" />
					<div className="w-3 h-3 rounded-full bg-yellow-500/80" />
					<div className="w-3 h-3 rounded-full bg-green-500/80" />
				</div>
				<div className="text-xs text-zinc-500 font-mono ml-2">editor.{mapLanguageToMonaco(language)}</div>
			</div>
			<div className="w-full flex-1 h-full relative min-h-0">
				<Editor
					height="100%"
					width="100%"
					language={mapLanguageToMonaco(language)}
					theme={getMonacoTheme(editorTheme)}
					value={code}
					onChange={handleChange}
					options={{
						fontSize: font || 14,
						tabSize: tabSize || 2,
						minimap: { enabled: false },
						scrollbar: {
							verticalScrollbarSize: 8,
							horizontalScrollbarSize: 8,
						},
						padding: { top: 16 },
						smoothScrolling: true,
						cursorBlinking: "smooth",
						fontFamily: "var(--font-mono)",
					}}
				/>
			</div>
		</div>
	);
}

export default CodeEditor;
