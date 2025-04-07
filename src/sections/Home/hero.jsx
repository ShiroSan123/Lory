// components/HeroSection.jsx
import { useEffect, useState } from "react";
import { HiCheckCircle, HiChatAlt, HiMail, HiDocument, HiPhone, HiCog, HiChartPie } from "react-icons/hi";

const HeroSection = () => {
	const [scrollY, setScrollY] = useState(0);

	// Отслеживаем прокрутку
	useEffect(() => {
		const handleScroll = () => {
			setScrollY(window.scrollY);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Функция для расчета трансформации иконок с дугой
	const getIconTransform = (isLeft) => {
		const offsetX = scrollY * 0.5;
		const offsetY = Math.sin(offsetX / 100) * 50;
		const rotate = offsetX * 0.5; // Поворот в градусах

		const translateX = isLeft ? -offsetX : offsetX;
		const translateY = isLeft ? -offsetY : offsetY;

		return `translate(${translateX}px, ${translateY}px) rotate(${isLeft ? -rotate : rotate}deg)`;
	};

	return (
		<div className="relative min-h-screen max-h-screen flex flex-col items-center justify-center bg-gray-50 overflow-hidden">
			{/* Иконки на фоне */}
			{/* Левый верхний угол */}
			<div
				className="absolute top-[10%] left-[10%] transition-transform duration-300"
				style={{ transform: getIconTransform(true) }}
			>
				<HiCheckCircle className="text-5xl text-gray-600 bg-white rounded-lg p-2 shadow-md" />
			</div>
			{/* Правый верхний угол */}
			<div
				className="absolute top-[15%] right-[15%] transition-transform duration-300"
				style={{ transform: getIconTransform(false) }}
			>
				<HiChatAlt className="text-5xl text-gray-600 bg-white rounded-lg p-2 shadow-md" />
			</div>
			{/* Правый верхний угол (чуть ниже) */}
			<div
				className="absolute top-[25%] right-[25%] transition-transform duration-300"
				style={{ transform: getIconTransform(false) }}
			>
				<HiMail className="text-5xl text-gray-600 bg-white rounded-lg p-2 shadow-md" />
			</div>
			{/* Правый средний угол */}
			<div
				className="absolute top-[40%] right-[5%] transition-transform duration-300"
				style={{ transform: getIconTransform(false) }}
			>
				<HiDocument className="text-5xl text-gray-600 bg-white rounded-lg p-2 shadow-md" />
			</div>
			{/* Левый средний угол */}
			<div
				className="absolute top-[40%] left-[15%] transition-transform duration-300"
				style={{ transform: getIconTransform(true) }}
			>
				<HiPhone className="text-5xl text-gray-600 bg-white rounded-lg p-2 shadow-md" />
			</div>
			{/* Правый нижний угол */}
			<div
				className="absolute top-[60%] right-[30%] transition-transform duration-300"
				style={{ transform: getIconTransform(false) }}
			>
				<HiCog className="text-5xl text-gray-600 bg-white rounded-lg p-2 shadow-md" />
			</div>
			{/* Левый нижний угол */}
			<div
				className="absolute top-[60%] left-[25%] transition-transform duration-300"
				style={{ transform: getIconTransform(true) }}
			>
				<HiChartPie className="text-5xl text-gray-600 bg-white rounded-lg p-2 shadow-md" />
			</div>

			{/* Основной контент */}
			<div className="text-center z-10">
				<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
					Быстрая запись и автоматизация решений
				</h1>
				<p className="text-lg text-gray-600 mb-6">
					Сервис для увеличения прибыли и количества заявок
				</p>
				<a href="/Dashboard"><button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">
					Попробовать бесплатно
				</button></a>
			</div>
		</div>
	);
};

export default HeroSection;