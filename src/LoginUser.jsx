import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginUser = () => {
  const navigate = useNavigate();
  const telegramButtonRef = useRef(null);
  const [manualAuth, setManualAuth] = useState({ telegramId: "", name: "" });
  const isLocalhost = window.location.hostname === "localhost";

  // Функция для обработки авторизации (используется и для виджета, и для ручного ввода)
  const onTelegramAuth = async (user) => {
    console.log("Telegram user data:", user);

    const formData = {
      telegramId: String(user.id || user.telegramId),  // user.telegramId для ручного ввода
      name: user.first_name || user.name,               // user.name для ручного ввода
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

  // Обработка отправки формы при ручном вводе
  const handleManualSubmit = (e) => {
    e.preventDefault();
    // Создаем объект, имитирующий данные пользователя из Telegram
    const fakeUser = {
      telegramId: manualAuth.telegramId,
      name: manualAuth.name,
    };
    onTelegramAuth(fakeUser);
  };

  // Эффект для подключения виджета Telegram, если не localhost
  useEffect(() => {
    if (!isLocalhost) {
      // Регистрируем функцию в глобальной области для вызова из виджета Telegram
      window.onTelegramAuth = onTelegramAuth;

      // Создаем и вставляем скрипт Telegram виджета
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.async = true;
      script.setAttribute("data-telegram-login", "lorythebimsbot");
      script.setAttribute("data-size", "large");
      script.setAttribute("data-onauth", "onTelegramAuth(user)");
      // Добавляем дополнительные атрибуты при необходимости

      if (telegramButtonRef.current) {
        telegramButtonRef.current.appendChild(script);
      }
    }
  }, [isLocalhost]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Вход через Telegram
        </h2>
        {isLocalhost ? (
          // Форма для ручного ввода, если мы на localhost
          <form onSubmit={handleManualSubmit} className="w-full flex flex-col gap-4">
            <input
              type="text"
              placeholder="Telegram ID"
              value={manualAuth.telegramId}
              onChange={(e) =>
                setManualAuth({ ...manualAuth, telegramId: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Имя пользователя"
              value={manualAuth.name}
              onChange={(e) =>
                setManualAuth({ ...manualAuth, name: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Войти
            </button>
          </form>
        ) : (
          // Контейнер для виджета Telegram, если не localhost
          <div id="telegram-button-container" ref={telegramButtonRef}></div>
        )}
      </div>
    </div>
  );
};

export default LoginUser;
