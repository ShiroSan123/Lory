import React, { useState, useEffect } from 'react'; // Добавлен импорт React
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Убраны дубликаты импортов
import './index.css';

// Pages
import HomePage from './Home';
import { Dashboard } from './Dashboard';
import BusinessRegPage from './BusinessReg';

// function App() {
// 	const [count, setCount] = useState<number>(0); // Тип для count

// 	return (
// 		<BrowserRouter>
// 			<Routes>
// 				<Route path="/" element={<HomePage />} />
// 				<Route path="/Dashboard" element={<Dashboard />} />
// 				<Route path="/BusinessRegPage" element={<BusinessRegPage />} />
// 			</Routes>
// 		</BrowserRouter>
// 	);
// }

function App() {
	const [isTelegram, setIsTelegram] = useState(false);
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		// Проверка наличия Telegram Web App
		if (window.Telegram?.WebApp) {
			setIsTelegram(true);
			const telegram = window.Telegram.WebApp;

			// Разворачиваем приложение на весь экран
			telegram.expand();

			// Получаем данные инициализации
			const initData = telegram.initData; // строка с данными
			const initDataUnsafe = telegram.initDataUnsafe; // объект с данными

			setUserData(initDataUnsafe);

			// Пример вывода данных в консоль
			console.log("initData:", initData);
			console.log("initDataUnsafe:", initDataUnsafe);
		} else {
			console.log("Это не Telegram Web App");
		}
	}, []);

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center">
			{isTelegram ? (
				<div className="p-4 bg-white rounded-lg shadow-lg">
					<h1 className="text-2xl font-bold text-center text-blue-600">
						Telegram Web App
					</h1>
					{userData ? (
						<div className="mt-4">
							<p className="text-lg">ID пользователя: {userData.id}</p>
							<p className="text-lg">Имя: {userData.first_name}</p>
							<p className="text-lg">
								Никнейм: @{userData.username || "не указан"}
							</p>
						</div>
					) : (
						<p className="mt-4 text-gray-600">Загрузка данных...</p>
					)}
				</div>
			) : (
				<p className="text-red-500 text-lg">
					Это приложение не запущено в Telegram
				</p>
			)}
		</div>
	);
}

export default App;