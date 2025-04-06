import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

function App() {
	const [isTelegram, setIsTelegram] = useState(false);
	const [userData, setUserData] = useState(null);
	const [authError, setAuthError] = useState(null);

	useEffect(() => {
		if (window.Telegram?.WebApp) {
			setIsTelegram(true);
			const telegram = window.Telegram.WebApp;
			telegram.expand();
			const initDataUnsafe = telegram.initDataUnsafe;
			setUserData(initDataUnsafe);
			console.log("initDataUnsafe:", initDataUnsafe);
		} else {
			console.log("Это не Telegram Web App");
		}
	}, []);

	const signIn = async () => {
		try {
			const response = await axios.post('https://example.com/auth/signin', {
				username: 'test',
				password: 'password',
			});
			console.log('Успех:', response.data);
		} catch (error) {
			console.error('Ошибка аутентификации:', error);
			setAuthError(error.message);
		}
	};

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
							<button
								onClick={signIn}
								className="mt-4 bg-blue-500 text-white p-2 rounded"
							>
								Войти
							</button>
							{authError && <p className="text-red-500 mt-2">{authError}</p>}
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