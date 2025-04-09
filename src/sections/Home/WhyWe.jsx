import { useEffect, useState } from "react";
import { HiCheckCircle, HiChatAlt, HiMail, HiDocument, HiPhone, HiCog, HiChartPie, HiCalendar, HiBell, HiCheck, HiPhotograph, HiOfficeBuilding, HiClipboard } from 'react-icons/hi';
import { useTheme } from '../../ThemeContext';

const WhyWee = () => {
	const { theme } = useTheme();
	const [scrollY, setScrollY] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			setScrollY(window.scrollY);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const getIconTransform = (isLeft) => {
		const offsetX = scrollY * 0.5;
		const offsetY = Math.sin(offsetX / 100) * 50;
		const translateX = isLeft ? -offsetX : offsetX;
		const translateY = isLeft ? -offsetY : offsetY;
		return `translate(${translateX}px, ${translateY}px)`;
	};

	return (
		<div className={`bg-gray-50 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`} id="WhyWe">
			<div className="py-16 px-4 sm:px-6 lg:px-8">
				<h2
					className={`text-3xl md:text-4xl font-bold text-center mb-16 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
						}`}
				>
					Тысячи процессов единая платформа
				</h2>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 pr-4 max-w-5xl mx-auto mb-16 *:text-center *:items-center *:grid *:grid-cols-2">
					<div>
						<HiCalendar
							className={`text-4xl mb-4 m-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
								}`}
						/>
						<p
							className={`text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
								}`}
						>
							Календарь бронирования
						</p>
					</div>
					<div>
						<HiChartPie
							className={`text-4xl mb-4 m-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
								}`}
						/>
						<p
							className={`text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
								}`}
						>
							Точная аналитика
						</p>
					</div>
					<div>
						<HiBell
							className={`text-4xl mb-4 m-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
								}`}
						/>
						<p
							className={`text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
								}`}
						>
							Уведомление в боте
						</p>
					</div>
					<div>
						<HiCheck
							className={`text-4xl mb-4 m-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
								}`}
						/>
						<p
							className={`text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
								}`}
						>
							Подтвержение в боте
						</p>
					</div>
					<div>
						<HiPhotograph
							className={`text-4xl mb-4 m-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
								}`}
						/>
						<p
							className={`text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
								}`}
						>
							Галерея изображений
						</p>
					</div>
					<div>
						<HiOfficeBuilding
							className={`text-4xl mb-4 m-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
								}`}
						/>
						<p
							className={`text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
								}`}
						>
							Конструктор функций
						</p>
					</div>
					<div>
						<HiDocument
							className={`text-4xl mb-4 m-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
								}`}
						/>
						<p
							className={`text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
								}`}
						>
							Управление задачами
						</p>
					</div>
					<div>
						<HiClipboard
							className={`text-4xl mb-4 m-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
								}`}
						/>
						<p
							className={`text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
								}`}
						>
							Управление процессами
						</p>
					</div>
				</div>

				<h2
					className={`text-4xl md:text-4xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
						}`}
				>
					Подходит для любого бизнеса{" "}
					<span className="text-[#0754B1]">в любой сфере</span>
				</h2>

				<div className="flex justify-center mb-12">
					<img
						src="https://via.placeholder.com/600x400"
						alt="Человек в офисе"
						className={`rounded-lg shadow-lg max-w-full h-auto ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
							}`}
					/>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-12 *:text-left px-4">
					<div>
						<h3
							className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
								}`}
						>
							Салоны красоты
						</h3>
					</div>
					<div>
						<h3
							className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
								}`}
						>
							Рестораны
						</h3>
					</div>
					<div>
						<h3
							className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
								}`}
						>
							Барбершоп
						</h3>
					</div>
					<div>
						<h3
							className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
								}`}
						>
							Аренда квартир
						</h3>
					</div>
				</div>

				<div className="text-center">
					<a
						href="#"
						className={`underline text-xs md:text-base ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
							}`}
					>
						Посмотреть все типы бизнеса
					</a>
				</div>
			</div>
		</div>
	);
};

export default WhyWee;