import { useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginUser = () => {
	const navigate = useNavigate();
	const telegramButtonRef = useRef(null);

  // Функция для обработки авторизации (используется и для виджета, и для ручного ввода)
  const onTelegramAuth = (user) => {
    console.log("Telegram user data:", user);

    const formData = {
      telegramId: String(user.id || user.telegramId),  // user.telegramId для ручного ввода
      name: user.first_name || user.name,              // user.name для ручного ввода
    };

    console.log("Отправляем данные на сервер:", formData);
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/auth/oauth`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = response.data;
        if (!data.accessToken) {
          console.error("Не получен access token от сервера.");
          throw new Error("Access token not provided");
        }
        // Сохраняем полученные токены и информацию о пользователе
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user)); // Преобразуем объект в строку, если это объект
        localStorage.setItem("id", data.id);
        console.log("Saved token:", localStorage.getItem("token"));

        // Выводим всю информацию userData в формате JSON
        alert(JSON.stringify(data.userData, null, 2));

        // Далее отправляем запрос к эндпоинту /auth/me для получения дополнительных данных пользователя
        return fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.accessToken}`,
          },
        });
      })
      .then((meResponse) => meResponse.json())
      .then((userData) => {
        console.log("Дополнительные данные пользователя:", userData);
        // Переходим к Dashboard через 2 секунды
        setTimeout(() => navigate("/Dashboard"), 2000);
      })
      .catch((err) => {
        console.error("Ошибка авторизации:", err);
      });
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
