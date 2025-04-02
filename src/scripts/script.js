// Инициализация Telegram Web App
const WebApp = window.Telegram.WebApp;

// Проверка готовности Web App
WebApp.ready();

// Получение данных пользователя
const user = WebApp.initDataUnsafe.user;
if (user) {
	document.getElementById('user-info').innerText =
		`Привет, ${user.first_name} (@${user.username || 'нет username'})! Ваш ID: ${user.id}`;
} else {
	document.getElementById('user-info').innerText = 'Пользователь не авторизован';
}

// Кнопка регистрации
document.getElementById('register-btn').addEventListener('click', () => {
	// Отправка данных на бэкенд
	const data = {
		user_id: user.id,
		first_name: user.first_name,
		username: user.username || null
	};

	fetch('https://yourdomain.com/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	})
		.then(response => response.json())
		.then(result => {
			if (result.success) {
				WebApp.showAlert('Регистрация успешна!');
			} else {
				WebApp.showAlert('Ошибка регистрации');
			}
		})
		.catch(error => {
			WebApp.showAlert('Произошла ошибка: ' + error.message);
		});
});