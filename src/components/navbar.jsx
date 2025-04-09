import React from 'react';
import { HiMenuAlt3, HiSun, HiMoon } from 'react-icons/hi'; // Добавлены иконки для темы
import LogoIcon from '/Logo-ico.svg';
import { useTelegram } from '../context/TelegramContext';
import { useTheme } from '../ThemeContext'; // Предполагается, что ThemeContext существует

const Header = () => {
	const { userData } = useTelegram();
	const token = localStorage.getItem("token");
	const { theme, toggleTheme } = useTheme(); // Используем theme и toggleTheme из контекста

	return (
		<header
			className={`flex items-center px-4 py-3 shadow-md md:px-6 lg:px-8 relative ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'
				}`}
		>
			{/* Центральная часть: логотип */}
			<a className="flex items-center space-x-2 mx-auto" href="/">
				<img src={LogoIcon} alt="Lory Logo" className="w-10 h-10" />
				<span
					className={`text-lg font-semibold sm:text-xl lg:text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-800'
						}`}
				>
					LoryCRM
				</span>
			</a>

			{/* Правая часть: кнопка "Вход/CRM" и переключатель темы */}
			<div className="absolute right-5 flex items-center space-x-4">
				{/* Кнопка Вход/CRM */}
				{token === null ? (
					<a href="/LoginUser">
						<button
							className={`text-sm font-medium hover:text-blue-500 transition-colors sm:text-base lg:text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
								}`}
						>
							Вход
						</button>
					</a>
				) : (
					<a href="/Dashboard">
						<button
							className={`text-sm font-medium hover:text-blue-500 transition-colors sm:text-base lg:text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
								}`}
						>
							CRM
						</button>
					</a>
				)}

				{/* Кнопка переключения темы */}
				<button
					onClick={toggleTheme}
					className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
					aria-label="Toggle theme"
				>
					{theme === 'dark' ? (
						<HiSun className="w-5 h-5 text-yellow-400" />
					) : (
						<HiMoon className="w-5 h-5 text-gray-600" />
					)}
				</button>
			</div>
		</header>
	);
};

export default Header;