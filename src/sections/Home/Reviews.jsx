import { useState } from "react";
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'; // Стрелки для навигации

const Reviews = () => {
	// Массив отзывов (для примера)
	const reviews = [
		{
			name: "Алина Григорьев",
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

	// Состояние для текущего отзыва
	const [currentReview, setCurrentReview] = useState(0);

	// Функции для переключения отзывов
	const handlePrev = () => {
		setCurrentReview((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
	};

	const handleNext = () => {
		setCurrentReview((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
	};

	return (
		<div
			className="py-16 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
			style={{
				backgroundImage: `url('https://via.placeholder.com/1200x600')`, // Замените на реальное изображение
			}}
		>
			{/* Заголовок */}
			<h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
				ОТЗЫВЫ
			</h2>

			{/* Контейнер отзыва */}
			<div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
				<h3 className="text-xl font-semibold text-gray-900 mb-2">
					{reviews[currentReview].name}
				</h3>
				<p className="text-sm text-gray-500 mb-4">{reviews[currentReview].title}</p>
				<p className="text-gray-600">{reviews[currentReview].text}</p>
			</div>

			{/* Навигация */}
			<div className="flex justify-center mt-6 space-x-4">
				<button
					onClick={handlePrev}
					className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
				>
					<HiChevronLeft className="text-2xl text-gray-600" />
				</button>
				<button
					onClick={handleNext}
					className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
				>
					<HiChevronRight className="text-2xl text-gray-600" />
				</button>
			</div>
		</div>
	);
};

export default Reviews;