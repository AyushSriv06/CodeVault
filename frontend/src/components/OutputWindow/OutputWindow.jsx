/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { useSelector } from "react-redux";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";

function OutputWindow({ outputValue }) {
        const output = useSelector((state) => state.output?.value);

        return (
                <div className="h-full w-full bg-zinc-950/50 border border-zinc-800 rounded-md p-1">
                        <Textarea
                                placeholder="Output will be displayed here..."
                                className="h-full w-full border-0 bg-transparent focus-visible:ring-0 resize-none font-mono text-zinc-300 placeholder:text-zinc-600 p-3 focus:outline-none"
                                readOnly
                                value={output || ""}
                        />
                </div>
        );
}

export default OutputWindow;
