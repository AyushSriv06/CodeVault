/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import NavBar from "../NavBar/NavBar";
import CodeEditor from "../CodeEditor/CodeEditor";

const LeftPart = () => {
	return (
		<div className='flex flex-col w-full h-full gap-2'>
			<div className='flex-none'>
				<NavBar />
			</div>
			<div className='flex-1 min-h-0 border rounded-md overflow-hidden'>
				<CodeEditor />
			</div>
		</div>
	);
};

export default LeftPart;
