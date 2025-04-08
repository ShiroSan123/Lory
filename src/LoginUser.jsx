import { useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginUser = () => {
	const navigate = useNavigate();
	const telegramButtonRef = useRef(null);

	// Функция, которая вызывается виджетом Telegram после авторизации пользователя
	const onTelegramAuth = async (user) => {
		console.log("Telegram user data:", user);

		const formData = {
			telegramId: String(user.id),
			name: user.first_name + (user.last_name ? ` ${user.last_name}` : ""),
		};

		try {
			console.log("Отправляем данные на сервер:", formData);
			const authResponse = await axios.post(
				`${import.meta.env.VITE_API_BASE_URL}/auth/oauth`,
				formData,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			console.log("Ответ сервера:", authResponse.data);
			const { accessToken, user: authUser, id } = authResponse.data;
			if (!accessToken) {
				console.error("Не получен access token от сервера.");
				return;
			}

			localStorage.setItem("token", accessToken);
			localStorage.setItem("user", authUser);
			localStorage.setItem("id", id);

			setTimeout(() => navigate("/Dashboard"), 2000);
		} catch (err) {
			console.error("Ошибка авторизации:", err);
		}
	};

	// Регистрируем функцию в глобальной области для вызова из виджета Telegram
	useEffect(() => {
		window.onTelegramAuth = onTelegramAuth;

		// Создаем и вставляем скрипт Telegram виджета
		const script = document.createElement("script");
		script.src = "https://telegram.org/js/telegram-widget.js?22";
		script.async = true;
		script.setAttribute("data-telegram-login", "lorythebimsbot");
		script.setAttribute("data-size", "large");
		script.setAttribute("data-onauth", "onTelegramAuth(user)");
		// Опционально, можно добавить еще атрибуты, например, data-userpic или data-request-access

		if (telegramButtonRef.current) {
			telegramButtonRef.current.appendChild(script);
		}
	}, []);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center">
				<h2 className="text-2xl font-bold mb-6 text-center">
					Вход через Telegram
				</h2>
				{/* Контейнер для виджета Telegram */}
				<div id="telegram-button-container" ref={telegramButtonRef}></div>
			</div>
		</div>
	);
};

export default LoginUser;
