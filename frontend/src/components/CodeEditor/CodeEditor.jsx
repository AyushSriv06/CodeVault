/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import AceEditor from "react-ace";

// Languages
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-ruby";

// Themes
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-terminal";

// Snippets (Required for enableSnippets: true)
import "ace-builds/src-noconflict/snippets/c_cpp";
import "ace-builds/src-noconflict/snippets/java";
import "ace-builds/src-noconflict/snippets/javascript";
import "ace-builds/src-noconflict/snippets/python";
import "ace-builds/src-noconflict/snippets/csharp";
import "ace-builds/src-noconflict/snippets/ruby";

import "ace-builds/src-noconflict/ext-language_tools";
import "./CodeEditor.css";
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
                if (users && users.length == 2 && users[0].username === username) {
                        socket && socket.emit("codeUpdate", { code: code, roomID: roomID });
                }
        }, [users]);

        useEffect(() => {
                // Ensure ace is defined (global) or handle gracefully
                if (window.ace) {
                        const editor = ace.edit("ace-editor");
                        editor.getSession().setTabSize(tabSize);

                        // Force resize to ensure it picks up the height
                        editor.resize(true);

                        // getBoilerplateCode might rely on location, language, question
                        const boilerplateCode = getBoilerplateCode(location, language, question);
                        if (boilerplateCode) {
                                dispatch(updateCode(boilerplateCode));
                                editor.setValue(boilerplateCode);
                        } else if (!code) {
                                // Default fallback if no boilerplate
                                editor.setValue("// Select a language to begin");
                        }
                }
        }, [tabSize, language, location.pathname]);

        const handleChange = (value) => {
                dispatch(updateCode(value));
                socket && socket.emit("codeUpdate", { code: value, roomID: roomID });
        };

        return (
                <div className="w-full h-full text-base">
                        <AceEditor
                                mode={language === "c" || language === "cpp" ? "c_cpp" : language}
                                theme={editorTheme}
                                fontSize={font}
                                name="ace-editor"
                                width="100%"
                                height="500px"
                                value={code}
                                onChange={handleChange}
                                showPrintMargin={false}
                                editorProps={{ $blockScrolling: true }}
                                setOptions={{
                                        enableBasicAutocompletion: true,
                                        enableLiveAutocompletion: true,
                                        enableSnippets: true,
                                        showLineNumbers: true,
                                        tabSize: 2,
                                        useWorker: false
                                }}
                                wrapEnabled={true}
                                className="code-editor"
                                style={{ width: "100%", height: "500px" }}
                        />
                </div>
        );
}

export default CodeEditor;
