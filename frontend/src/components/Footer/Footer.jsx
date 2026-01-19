/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-unused-vars */
import React from "react";

const Footer = () => {
	return (
		<div className=' w-full h-full flex items-center justify-center gap-2 px-4 border-t-2 border-[#fff]/[.2] py-2 flex-col lg:flex-row'>
			<div className='text-white flex gap-2 justify-center items-center text-[0.8em] text-center w-full lg:mx-auto lg:text-nowrap lg:text-xl'>
				&copy; {new Date().getFullYear()} CodeVault. All rights reserved.
			</div>
		</div>
	);
};

export default Footer;
