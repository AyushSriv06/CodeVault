/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import NavBar from "../NavBar/NavBar";
import CodeEditor from "../CodeEditor/CodeEditor";

const LeftPart = () => {
	return (
		<div className='flex flex-col flex-1 w-full gap-2 min-h-0'>
			<div className='flex-none'>
				<NavBar />
			</div>
			<div className='flex-1 h-full min-h-0 overflow-hidden flex flex-col'>
				<CodeEditor />
			</div>
		</div>
	);
};

export default LeftPart;
