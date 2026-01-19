/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import OutputWindow from "../OutputWindow/OutputWindow";
import InputWindow from "../InputWindow/InputWindow";

const RightPart = () => {
	return (
		<div className='flex flex-col w-full h-full gap-4'>
			<div className='flex-1 min-h-0'>
				<InputWindow />
			</div>
			<div className='flex-1 min-h-0'>
				<OutputWindow />
			</div>
		</div>
	);
};

export default RightPart;
