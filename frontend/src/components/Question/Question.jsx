/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import capitalizeString from "../../services/capitaliseWord";
const Question = ({ question }) => {
        const { title, diff, description, example_cases = [], constraints = [], topics = [], test_cases = [] } = question;
        const visibleTestCases = test_cases.filter((item) => !item.isHidden);

        return (
                <div className="p-5">
                        <div className="text-[white] text-2xl font-bold pl-5 pt-2.5">{title}</div>
                        <div
                                className={`${
                                        diff == "easy"
                                                ? `text-green-500`
                                                : diff == "medium"
                                                ? `text-amber-400`
                                                : `text-red-500`
                                } text-xl pl-5 pt-2.5`}
                        >
                                {capitalizeString(diff)}
                        </div>
                        <div className="text-[white] text-base leading-7 pl-5 pt-4 whitespace-pre-line">{description}</div>

                        {topics.length > 0 && (
                                <div className="pl-5 pt-6">
                                        <div className="text-lg font-semibold mb-2">Topics</div>
                                        <div className="flex flex-wrap gap-2">
                                                {topics.map((topic) => (
                                                        <span key={topic} className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300 border border-blue-400/20">
                                                                {topic}
                                                        </span>
                                                ))}
                                        </div>
                                </div>
                        )}

                        {constraints.length > 0 && (
                                <div className="pl-5 pt-6">
                                        <div className="text-lg font-semibold mb-2">Constraints</div>
                                        <ul className="list-disc ml-6 space-y-1 text-zinc-200">
                                                {constraints.map((constraint, index) => (
                                                        <li key={index}>{constraint}</li>
                                                ))}
                                        </ul>
                                </div>
                        )}

                        <div className="text-[white]">
                                {example_cases.map((example, index) => {
                                        return (
                                                <div className="pt-[24px] pl-[20px]" key={index}>
                                                        <div className="text-lg font-bold mb-3">Example {index + 1} : </div>
                                                        <div className="bg-[#222222] w-[90%] rounded-lg py-3">
                                                                <div className="ml-3">
                                                                        <span className="text-[#4ec9b0]">Input</span> :{" "}
                                                                        <span className="text-[#ce9178]">
                                                                                {example.input}
                                                                        </span>
                                                                </div>
                                                                <div className="ml-3">
                                                                        <span className="text-[#4ec9b0]">Output</span> :{" "}
                                                                        <span className="text-[#ce9178]">
                                                                                {example.output}
                                                                        </span>
                                                                </div>
                                                                <div className="ml-3">
                                                                        Explanation : {example.explanation}
                                                                </div>
                                                        </div>
                                                </div>
                                        );
                                })}
                        </div>

                        {visibleTestCases.length > 0 && (
                                <div className="pl-5 pt-6 pb-6">
                                        <div className="text-lg font-semibold mb-3">Sample Test Cases</div>
                                        <div className="space-y-3">
                                                {visibleTestCases.map((testCase, index) => (
                                                        <div key={index} className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 w-[90%]">
                                                                <div className="text-sm text-zinc-400 mb-1">Case {index + 1}</div>
                                                                <div className="text-sm">
                                                                        <span className="text-[#4ec9b0]">Input</span> :{" "}
                                                                        <span className="text-[#ce9178]">{testCase.input}</span>
                                                                </div>
                                                                <div className="text-sm">
                                                                        <span className="text-[#4ec9b0]">Expected</span> :{" "}
                                                                        <span className="text-[#ce9178]">{testCase.output}</span>
                                                                </div>
                                                        </div>
                                                ))}
                                        </div>
                                </div>
                        )}
                </div>
        );
};

export default Question;
