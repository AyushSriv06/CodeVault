/* eslint-disable react/prop-types */
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeDisplay = ({ code, language }) => {
        return (
                <div className="rounded-md overflow-hidden bg-[#1e1e1e] border border-white/10">
                        <SyntaxHighlighter
                                language={language}
                                style={vscDarkPlus}
                                customStyle={{
                                        margin: 0,
                                        padding: "1.5rem",
                                        background: "transparent",
                                        fontSize: "0.9rem",
                                        lineHeight: "1.6",
                                }}
                                wrapLongLines={true}
                        >
                                {code}
                        </SyntaxHighlighter>
                </div>
        );
};

const Solution = ({ solution, language }) => {
        return (
                <div className="h-full">
                        <CodeDisplay code={solution} language={language} />
                </div>
        );
};

export default Solution;
