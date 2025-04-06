import React, { useState, useEffect } from 'react'; // Добавлен импорт React
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Убраны дубликаты импортов
import './index.css';

// Pages
import HomePage from './Home';
import { Dashboard } from './Dashboard';
import BusinessRegPage from './BusinessReg';

// Тип для возвращаемого значения хука useAuth
type AuthState = {
	isAuth: boolean;
	signIn: (initData: string) => Promise<void>;
};

const useAuth = (): AuthState => {
	// Состояние с явным указанием типа
	const [isAuth, setIsAuth] = useState<boolean>(false);

	// Функция signIn с типизацией
	const signIn = async (initData: string): Promise<void> => {
		try {
			const { data } = await axios.post<boolean>(
				'https://example.com/auth/signin', // URL эндпоинта аутентификации
				{ initData }, // Передаем данные для входа
			);
			setIsAuth(data); // Устанавливаем статус аутентификации
		} catch (error) {
			console.error('Ошибка аутентификации:', error);
		}
	};

	return { isAuth, signIn };
};

function App() {
	// const [count, setCount] = useState<number>(0); // Тип для count

	// return (
	// 	<BrowserRouter>
	// 		<Routes>
	// 			<Route path="/" element={<HomePage />} />
	// 			<Route path="/Dashboard" element={<Dashboard />} />
	// 			<Route path="/BusinessRegPage" element={<BusinessRegPage />} />
	// 		</Routes>
	// 	</BrowserRouter>
	// );
	const { isAuth, signIn } = useAuth();

	useEffect(() => {
		// Вызываем signIn при монтировании компонента,
		// передавая initData из Telegram WebApp API
		signIn(window.Telegram.WebApp.initData);
	}, []);

	// Если пользователь аутентифицирован, показываем соответствующее сообщение
	if (isAuth) {
		return <h1>Authenticated</h1>;
	}

	// Если не аутентифицирован, показываем другое сообщение
	return <h1>Not Authenticated</h1>;
}

export default App;