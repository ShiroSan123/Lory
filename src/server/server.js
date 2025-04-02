const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// База данных (временная, замените на реальную, например, MongoDB)
const users = new Map();

// Регистрация пользователя
app.post('/register', (req, res) => {
	const { user_id, first_name, username } = req.body;
	if (users.has(user_id)) {
		return res.json({ success: false, message: 'Пользователь уже зарегистрирован' });
	}
	users.set(user_id, { first_name, username });
	res.json({ success: true, message: 'Регистрация успешна' });
});

// Проверка авторизации
app.get('/check-auth', (req, res) => {
	const userId = req.query.user_id;
	if (users.has(userId)) {
		res.json({ success: true, user: users.get(userId) });
	} else {
		res.json({ success: false, message: 'Пользователь не авторизован' });
	}
});

app.listen(port, () => {
	console.log(`Сервер запущен на порту ${port}`);
});