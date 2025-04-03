import React from 'react';
// import LogoIcon from './path-to-your-logo.svg';

// Импортируем иконки (можно использовать react-icons или свои SVG)
import { FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
	return (
		<footer className="bg-[#1A1A1A] text-white py-10 px-5">
			<div className="max-w-6xl mx-auto">
				{/* Логотип */}
				<div className="flex justify-center items-center mb-8">
					<div className="flex items-center space-x-2">
						{/* Иконка логотипа (замените на свою) */}
						<div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center text-white font-bold">
							lo
						</div>
						{/* <img src={LogoIcon} alt="Lory Logo" className="w-10 h-10" /> */}
						<span className="text-2xl font-bold">Lory</span>
					</div>
				</div>

				{/* Контент футера */}
				<div className="flex flex-col md:flex-row justify-center gap-10 md:gap-20 mb-8">
					{/* Левая колонка */}
					<div className="text-center md:text-left">
						<h3 className="text-gray-400 uppercase mb-4">Страницы</h3>
						<ul className="space-y-2">
							<li>Главная страница</li>
							<li>Задачи</li>
							<li>Для любого бизнеса</li>
							<li>Отзывы</li>
						</ul>
					</div>

					{/* Правая колонка */}
					<div className="text-center md:text-left">
						<h3 className="text-gray-400 uppercase mb-4">Контакты</h3>
						<ul className="space-y-2">
							<li className="flex items-center justify-center md:justify-start space-x-2">
								<FaPhone className="w-4 h-4" />
								<span>+7(924) 664-33-35</span>
							</li>
							<li className="flex items-center justify-center md:justify-start space-x-2">
								<FaEnvelope className="w-4 h-4" />
								<span>good_layaal2@mail.ru</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Копирайт */}
				<div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4 text-sm">
					<span>© lory 2025</span>
					<span>POWERED BY BIMS</span>
				</div>
			</div>
		</footer>
	);
};

export default Footer;