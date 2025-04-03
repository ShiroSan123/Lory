import { useEffect } from 'react';
import { HiMenu } from 'react-icons/hi'; // Импортируем иконку

export const Navbar = ({ menuOpen, setMenuOpen }) => {
	useEffect(() => {
		document.body.style.overflow = menuOpen ? "hidden" : "";
	}, [menuOpen]);

	return (
		<nav className="fixed top-0 w-full z-40 bg-[#f3f3f3] border-b border-white/10">
			<div className="max-w-5xl md:max-w-full mx-auto px-5 md:px-[130px]">
				<div className="grid grid-cols-3 justify-between items-center h-[50px] md:h-auto md:pb-4 md:pt-6">
					<div className="w-7 h-5 relative cursor-pointer z-40 md:hidden"
						onClick={() => setMenuOpen((prev) => !prev)}>
						<HiMenu className="w-5 h-5" />
					</div>

					<div className='text-center'>
						<h1>Lory</h1>
					</div>

					<a href="/" className="font-mono text-sm sm:text-3xl md:text-5xl font-bold text-white">
						{/* <img src="/logo.svg" alt="Tours of Yakutia Logo" className="h-8 w-auto" /> */}
						<h1 className='text-black font-light'>Регистрация</h1>
					</a>

					<div className="hidden md:flex items-center space-x-8 *:text-black-800 *:hover:text-[#187A00] *:transition-colors">
						<a href="/Dashboard"> CRM </a>
					</div>
				</div>
			</div>
		</nav>

	)
}