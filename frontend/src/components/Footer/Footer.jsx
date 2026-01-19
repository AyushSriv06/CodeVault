const Footer = () => {
	return (
		<footer className='w-full border-t border-border bg-background py-6'>
			<div className='container flex flex-col items-center justify-between gap-4 md:flex-row px-6'>
				<p className='text-sm text-muted-foreground text-center md:text-left'>
					&copy; {new Date().getFullYear()} CodeVault. All rights reserved.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
