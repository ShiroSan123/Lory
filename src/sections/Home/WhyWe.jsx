import { useEffect, useState } from "react";
import { HiCheckCircle, HiChatAlt, HiMail, HiDocument, HiPhone, HiCog, HiChartPie, HiCalendar, HiBell, HiCheck, HiPhotograph, HiOfficeBuilding, HiClipboard } from 'react-icons/hi';

const WhyWee = () => {
	const [scrollY, setScrollY] = useState(0);

	// Отслеживаем прокрутку для первой секции
	useEffect(() => {
		const handleScroll = () => {
			setScrollY(window.scrollY);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Функция для расчета трансформации иконок с дугой (для первой секции)
	const getIconTransform = (isLeft) => {
		const offsetX = scrollY * 0.5;
		const offsetY = Math.sin(offsetX / 100) * 50;
		const translateX = isLeft ? -offsetX : offsetX;
		const translateY = isLeft ? -offsetY : offsetY;
		return `translate(${translateX}px, ${translateY}px)`;
	};

	return (
		<div className="bg-gray-50" id="WhyWe">
			{/* Вторая секция (статическая, без эффекта ухода) */}
			<div className="py-16 px-4 sm:px-6 lg:px-8">
				{/* Заголовок */}
				<h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
					Тысячи процессов единая платформа
				</h2>

				{/* Сетка иконок */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 pr-4 max-w-5xl mx-auto mb-16 *:text-center *:items-center *:grid *:grid-cols-2">
					<div className="">
						<HiCalendar className="text-4xl text-gray-600 mb-4 m-auto" />
						<p className="text-gray-600 text-sm md:text-base">Календарь бронирования</p>
					</div>
					<div className="">
						<HiChartPie className="text-4xl text-gray-600 mb-4 m-auto" /> {/* Исправлено на HiChartPie */}
						<p className="text-gray-600 text-sm md:text-base">Точная аналитика</p>
					</div>
					<div className="">
						<HiBell className="text-4xl text-gray-600 mb-4 m-auto" />
						<p className="text-gray-600 text-sm md:text-base">Уведомление в боте</p>
					</div>
					<div className="">
						<HiCheck className="text-4xl text-gray-600 mb-4 m-auto" />
						<p className="text-gray-600 text-sm md:text-base">Подтвержение в боте</p>
					</div>
					<div className="">
						<HiPhotograph className="text-4xl text-gray-600 mb-4 m-auto" />
						<p className="text-gray-600 text-sm md:text-base">Галерея изображений</p>
					</div>
					<div className="">
						<HiOfficeBuilding className="text-4xl text-gray-600 mb-4 m-auto" />
						<p className="text-gray-600 text-sm md:text-base">Конструктор функций</p>
					</div>
					<div className="">
						<HiDocument className="text-4xl text-gray-600 mb-4 m-auto" /> {/* Исправлено на HiDocument */}
						<p className="text-gray-600 text-sm md:text-base">Управление задачами</p>
					</div>
					<div className="">
						<HiClipboard className="text-4xl text-gray-600 mb-4 m-auto" />
						<p className="text-gray-600 text-sm md:text-base">Управление процессами</p>
					</div>
				</div>

				{/* Второй заголовок */}
				<h2 className="text-4xl md:text-4xl font-bold text-gray-900 text-center mb-12">
					Подходит для любого бизнеса{" "}
					<span className="text-[#0754B1]">в любой сфере</span>
				</h2>

				{/* Изображение */}
				<div className="flex justify-center mb-12">
					<img
						src="https://via.placeholder.com/600x400" // Замените на реальное изображение
						alt="Человек в офисе"
						className="rounded-lg shadow-lg max-w-full h-auto"
					/>
				</div>

				{/* Сетка текстовых блоков */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-12 *:text-left px-4">
					<div className="">
						<h3 className="text-sm font-semibold text-gray-900">Салоны красоты</h3>
					</div>
					<div className="">
						<h3 className="text-sm font-semibold text-gray-900">Рестораны</h3>
					</div>
					<div className="">
						<h3 className="text-sm font-semibold text-gray-900">Барбершоп</h3>
					</div>
					<div className="">
						<h3 className="text-sm font-semibold text-gray-900">Аренда квартир</h3>
					</div>
				</div>

				{/* Ссылка */}
				<div className="text-center">
					<a
						href="#"
						className="underline text-xs md:text-base"
					>
						Посмотреть все типы бизнеса
					</a>
				</div>
			</div>
		</div>
	);
};

export default WhyWee;