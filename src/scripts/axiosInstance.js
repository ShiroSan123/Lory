// axiosInstance.js
import axios from 'axios';

// Функция для декодирования JWT-токена (если токен в формате JWT)
const decodeToken = (token) => {
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join('')
		);
		return JSON.parse(jsonPayload);
	} catch (error) {
		console.error('Error decoding token:', error);
		return null;
	}
};

// Создаем экземпляр Axios
const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Интерцептор для запросов
axiosInstance.interceptors.request.use(
	async (config) => {
		let token = localStorage.getItem('token');
		const refreshToken = localStorage.getItem('refreshToken');

		if (!token) {
			return config; // Если токена нет, просто отправляем запрос
		}

		// Декодируем токен, чтобы проверить время истечения
		const decodedToken = decodeToken(token);
		if (!decodedToken || !decodedToken.exp) {
			return config; // Если не удалось декодировать токен, отправляем запрос как есть
		}

		const currentTime = Math.floor(Date.now() / 1000); // Текущее время в секундах
		const timeUntilExpiration = decodedToken.exp - currentTime;

		// Если токен истекает менее чем через 5 минут (300 секунд), обновляем его
		if (timeUntilExpiration < 300 && refreshToken) {
			try {
				const response = await axios.post(
					`${import.meta.env.VITE_API_BASE_URL}/auth/login`,
					{ refreshToken },
					{ headers: { 'Content-Type': 'application/json' } }
				);

				const { accessToken, refreshToken: newRefreshToken } = response.data;
				localStorage.setItem('token', accessToken); // Сохраняем новый accessToken
				if (newRefreshToken) {
					localStorage.setItem('refreshToken', newRefreshToken); // Сохраняем новый refreshToken, если он есть
				}
				token = accessToken; // Обновляем токен для текущего запроса
			} catch (error) {
				console.error('Error refreshing token:', error);
				// Если обновление токена не удалось, удаляем токены и перенаправляем на логин
				localStorage.removeItem('token');
				localStorage.removeItem('refreshToken');
				localStorage.removeItem('user');
				localStorage.removeItem('id');
				window.location.href = '/LoginUser'; // Перенаправляем на страницу логина
				return Promise.reject(error);
			}
		}

		// Добавляем токен в заголовки запроса
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Интерцептор для обработки ошибок ответа
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Если получили 401 (Unauthorized), удаляем токены и перенаправляем на логин
			localStorage.removeItem('token');
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('user');
			localStorage.removeItem('id');
			window.location.href = '/LoginUser';
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;