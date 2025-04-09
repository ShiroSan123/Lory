import { useState } from "react";
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { useTheme } from '../../ThemeContext'; // Импортируем useTheme

const Reviews = () => {
	const { theme } = useTheme(); // Получаем текущую тему

	const reviews = [
		{
			name: "Айаал Григорьев",
			title: "Основатель арендодателя доставок GetLet",
			text: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum",
		},
		{
			name: "Иван Петров",
			title: "Владелец салона красоты",
			text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		},
		{
			name: "Мария Сидорова",
			title: "Менеджер ресторана",
			text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		},
	];

	const [currentReview, setCurrentReview] = useState(0);

	const handlePrev = () => {
		setCurrentReview((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
	};

	const handleNext = () => {
		setCurrentReview((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
	};

	return (
		<div
			className={`py-16 px-4 sm:px-6 lg:px-8 bg-cover bg-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'
				}`}
			style={{
				backgroundImage: `url('https://via.placeholder.com/1200x600')`, // Замените на реальное изображение
			}}
		>
			{/* Заголовок */}
			<h2
				className={`text-3xl md:text-4xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
					}`}
			>
				ОТЗЫВЫ
			</h2>

			{/* Контейнер отзыва */}
			<div
				className={`max-w-2xl mx-auto rounded-lg shadow-lg p-8 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'
					}`}
			>
				<h3
					className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
						}`}
				>
					{reviews[currentReview].name}
				</h3>
				<p
					className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
						}`}
				>
					{reviews[currentReview].title}
				</p>
				<p
					className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
						}`}
				>
					{reviews[currentReview].text}
				</p>
			</div>

			{/* Навигация */}
			<div className="flex justify-center mt-6 space-x-4">
				<button
					onClick={handlePrev}
					className={`p-2 rounded-full shadow-md transition ${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'
						}`}
				>
					<HiChevronLeft className="text-2xl" />
				</button>
				<button
					onClick={handleNext}
					className={`p-2 rounded-full shadow-md transition ${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'
						}`}
				>
					<HiChevronRight className="text-2xl" />
				</button>
			</div>
		</div>
	);
};

export default Reviews;