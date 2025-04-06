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

interface TelegramUser {
	id?: number;
	first_name?: string;
	last_name?: string;
	username?: string;
	[key: string]: any;
}

function App() {
	const [isTelegram, setIsTelegram] = useState(false);
	const [userData, setUserData] = useState<TelegramUser | null>(null);
	const [debugMessage, setDebugMessage] = useState<string>('');

	useEffect(() => {
		if (!window.Telegram) {
			setDebugMessage('Скрипт Telegram не загружен или это не Web App');
			console.log('window.Telegram отсутствует');
			return;
		}

		if (!window.Telegram.WebApp) {
			setDebugMessage('Telegram.WebApp не инициализирован');
			console.log('Telegram.WebApp отсутствует');
			return;
		}

		setIsTelegram(true);
		const telegram = window.Telegram.WebApp;
		telegram.expand();

		const initDataUnsafe = telegram.initDataUnsafe;

		console.log('initDataUnsafe:', initDataUnsafe);
		console.log('Ключи initDataUnsafe:', Object.keys(initDataUnsafe));

		if (initDataUnsafe && Object.keys(initDataUnsafe).length > 0) {
			setUserData({ ...initDataUnsafe }); // Копируем объект для явного обновления
			setDebugMessage('Данные успешно загружены');
		} else {
			setDebugMessage('Данные initDataUnsafe пусты');
		}
	}, []);

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center">
			{isTelegram ? (
				<div className="p-4 bg-white rounded-lg shadow-lg">
					<h1 className="text-2xl font-bold text-center text-blue-600">
						Telegram Web App
					</h1>
					<p className="mt-2 text-gray-600">Отладка: {debugMessage}</p>
					{userData ? (
						<div className="mt-4">
							<p className="text-lg">ID пользователя: {userData.id || 'не указан'}</p>
							<p className="text-lg">Имя: {userData.first_name || 'не указано'}</p>
							<p className="text-lg">Фамилия: {userData.last_name || 'не указана'}</p>
							<p className="text-lg">
								Никнейм: @{userData.username || 'не указан'}
							</p>
							{/* Дополнительно выведем все данные для отладки */}
							<pre className="mt-4 text-sm text-gray-700">
								Все данные: {JSON.stringify(userData, null, 2)}
							</pre>
						</div>
					) : (
						<p className="mt-4 text-gray-600">Данные пользователя не загружены</p>
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