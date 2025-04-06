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

// Интерфейс для пользователя Telegram
interface TelegramUser {
	id: number;
	first_name: string;
	last_name: string;
	username: string;
	language_code?: string;
	is_premium?: boolean;
	allows_write_to_pm?: boolean;
	photo_url?: string;
}

// Интерфейс для initDataUnsafe
interface InitDataUnsafe {
	user: TelegramUser;
	chat_instance?: string;
	chat_type?: string;
	auth_date?: string;
	signature?: string;
	hash?: string;
}

function App() {
	const [isTelegram, setIsTelegram] = useState(false);
	const [userData, setUserData] = useState<InitDataUnsafe | null>(null);
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
			setUserData({ ...initDataUnsafe });
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
					{userData && userData.user ? (
						<div className="mt-4">
							<p className="text-lg">ID пользователя: {userData.user.id || 'не указан'}</p>
							<p className="text-lg">Имя: {userData.user.first_name || 'не указано'}</p>
							<p className="text-lg">Фамилия: {userData.user.last_name || 'не указана'}</p>
							<p className="text-lg">
								Никнейм: @{userData.user.username || 'не указан'}
							</p>
							{/* Дополнительные поля */}
							<p className="text-lg">Язык: {userData.user.language_code || 'не указан'}</p>
							<p className="text-lg">Премиум: {userData.user.is_premium ? 'Да' : 'Нет'}</p>
							{userData.user.photo_url && (
								<img
									src={userData.user.photo_url}
									alt="Аватар"
									className="mt-2 w-20 h-20 rounded-full"
								/>
							)}
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