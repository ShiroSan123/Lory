import { useEffect, useState } from "react";
import { HiCheckCircle, HiChatAlt, HiMail, HiDocument, HiPhone, HiCog, HiChartPie } from "react-icons/hi";
import { useTheme } from '../../ThemeContext';

const HeroSection = () => {
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
		const rotate = offsetX * 0.5;
		const translateX = isLeft ? -offsetX : offsetX;
		const translateY = isLeft ? -offsetY : offsetY;
		return `translate(${translateX}px, ${translateY}px) rotate(${isLeft ? -rotate : rotate}deg)`;
	};

	return (
		<div
			className={`relative min-h-screen max-h-screen flex flex-col items-center justify-center overflow-hidden ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'
				}`}
		>
			{/* Иконки на фоне */}
			<div
				className="absolute top-[10%] left-[10%] transition-transform duration-300"
				style={{ transform: getIconTransform(true) }}
			>
				<HiCheckCircle
					className={`text-5xl rounded-lg p-2 shadow-md ${theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-600 bg-white'
						}`}
				/>
			</div>
			<div
				className="absolute top-[15%] right-[15%] transition-transform duration-300"
				style={{ transform: getIconTransform(false) }}
			>
				<HiChatAlt
					className={`text-5xl rounded-lg p-2 shadow-md ${theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-600 bg-white'
						}`}
				/>
			</div>
			<div
				className="absolute top-[25%] right-[25%] transition-transform duration-300"
				style={{ transform: getIconTransform(false) }}
			>
				<HiMail
					className={`text-5xl rounded-lg p-2 shadow-md ${theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-600 bg-white'
						}`}
				/>
			</div>
			<div
				className="absolute top-[40%] right-[5%] transition-transform duration-300"
				style={{ transform: getIconTransform(false) }}
			>
				<HiDocument
					className={`text-5xl rounded-lg p-2 shadow-md ${theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-600 bg-white'
						}`}
				/>
			</div>
			<div
				className="absolute top-[40%] left-[15%] transition-transform duration-300"
				style={{ transform: getIconTransform(true) }}
			>
				<HiPhone
					className={`text-5xl rounded-lg p-2 shadow-md ${theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-600 bg-white'
						}`}
				/>
			</div>
			<div
				className="absolute top-[60%] right-[30%] transition-transform duration-300"
				style={{ transform: getIconTransform(false) }}
			>
				<HiCog
					className={`text-5xl rounded-lg p-2 shadow-md ${theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-600 bg-white'
						}`}
				/>
			</div>
			<div
				className="absolute top-[60%] left-[25%] transition-transform duration-300"
				style={{ transform: getIconTransform(true) }}
			>
				<HiChartPie
					className={`text-5xl rounded-lg p-2 shadow-md ${theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-600 bg-white'
						}`}
				/>
			</div>

			{/* Основной контент */}
			<div className="text-center z-10">
				<h1
					className={`text-4xl md:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
						}`}
				>
					Быстрая запись и автоматизация решений
				</h1>
				<p
					className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
						}`}
				>
					Сервис для увеличения прибыли и количества заявок
				</p>
				<a href="/RegUser">
					<button
						className={`px-6 py-3 rounded-full transition ${theme === 'dark' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'
							}`}
					>
						Попробовать бесплатно
					</button>
				</a>
			</div>
		</div>
	);
};

export default HeroSection;