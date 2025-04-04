import React from 'react';
import { HiMenuAlt3 } from 'react-icons/hi';
import LogoIcon from '/Logo-ico.svg';

const Header = () => {
	return (
		<header className="flex items-center px-4 py-3 bg-white shadow-md md:px-6 lg:px-8 relative">
			{/* Левая часть: иконка меню */}
			<div className="flex items-center">
				<button className="text-gray-600 focus:outline-none md:hidden">
					<HiMenuAlt3 className="w-6 h-6" />
				</button>
			</div>

			{/* Центральная часть: логотип */}
			<a className="flex items-center space-x-2 mx-auto" href='/'>
				<img src={LogoIcon} alt="Lory Logo" className="w-10 h-10" />
				<span className="text-lg font-semibold text-gray-800 sm:text-xl lg:text-2xl">
					LoryCRM
				</span>
			</a>

			{/* Правая часть: кнопка "Регистрация" */}
			<a href='/BusinessRegPage' className='absolute right-5'>
				<button className="text-sm font-medium text-gray-700 hover:text-blue-500 transition-colors sm:text-base lg:text-lg">
					Регистрация
				</button>
			</a>
		</header>
	);
};

export default Header;