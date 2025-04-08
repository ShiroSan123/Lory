import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginUser = () => {
  const navigate = useNavigate();

  // Функция, которая вызывается виджетом Telegram после авторизации пользователя
  const onTelegramAuth = async (user) => {
    console.log("Telegram user data:", user);
    
    // Формирование данных для отправки на сервер:
    // Формируем имя, объединяя first_name и last_name (если он есть)
    const formData = {
      telegramId: user.id,
      name: user.first_name + (user.last_name ? ` ${user.last_name}` : ""),
    };

    try {
      // Отправка данных на сервер через Telegram OAuth endpoint
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

      // Сохраняем данные в localStorage
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", authUser);
      localStorage.setItem("id", id);

      // Переадресация пользователя на Dashboard
      setTimeout(() => navigate("/Dashboard"), 2000);
    } catch (err) {
      console.error("Ошибка авторизации:", err);
    }
  };

  // Регистрируем функцию в глобальной области для вызова из виджета Telegram
  useEffect(() => {
    window.onTelegramAuth = onTelegramAuth;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Вход через Telegram
        </h2>
        {/* Подключаем скрипт Telegram виджета */}
        <script
          async
          src="https://telegram.org/js/telegram-widget.js?7"
          data-telegram-login="your_bot_username"
          data-size="large"
          data-userpic="false"
          data-corner-radius="5"
          data-request-access="write"
          data-onauth="onTelegramAuth"
          data-lang="en"
        ></script>
      </div>
    </div>
  );
};

export default LoginUser;
