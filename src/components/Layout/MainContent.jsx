import { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Добавляем импорт axios

export function MainContent({ selectedMenu, isLoading = false, isSidebarOpen, selectedEmployee }) {
	const mainRef = useRef(null);

	const [messages, setMessages] = useState([
		{
			sender: 'bot',
			text: 'Привет, я твой помощник LoryAI! Я могу генерировать текст и фото для вашей компании',
		},
	]);

	const products = [
		{
			id: 1,
			image: '/images/cherry.jpeg', // Замените на реальный путь к изображению
			title: 'Зимняя вишня',
			description: 'Стрижка женская, Яркий акцент на челке, стильный рисунок сзади.',
			price: 650,
		},
		{
			id: 2,
			image: '/images/crop.jpeg',
			title: 'Кроп',
			description: 'Стрижка мужская. стильная. подойдет для многих мужчин',
			price: 650,
		},
		{
			id: 3,
			image: '/images/mallet.jpeg',
			title: 'Маллет',
			description: 'Стрижка мужская. самая крутая. подойдет для всех',
			price: 650,
		},
	];

	const [inputText, setInputText] = useState('');

	// Функция для отправки сообщения
	const handleSendMessage = async () => {
		if (!inputText.trim()) return; // Проверяем, что текст не пустой

		// Добавляем сообщение пользователя в историю
		const userMessage = { sender: 'user', text: inputText };
		setMessages((prevMessages) => [...prevMessages, userMessage]);

		// Очищаем поле ввода
		setInputText('');

		try {
			// Отправляем запрос на сервер
			const response = await axios.post(
				'https://my-vercel-server-eduards-projects-e1b5b4e2.vercel.app/api/chat',
				{ message: inputText }, // Предполагаем, что сервер ожидает поле message
				{
					headers: {
						'Authorization': 'Bearer a8f3cd34d3ad67e1f4b3f1a8d3cc432f9b2f9c9ac4d84c79e0d40a8c9ef0c8dd',
						'Content-Type': 'application/json',
					},
				}
			);

			// Добавляем ответ бота в историю
			const botMessage = { sender: 'bot', text: response.data.response || 'Ответ от сервера' };
			console.log(response.data.response)
			setMessages((prevMessages) => [...prevMessages, botMessage]);
		} catch (err) {
			console.error('Ошибка при отправке сообщения:', err);
			const errorMessage = {
				sender: 'bot',
				text: 'Произошла ошибка. Попробуйте снова.',
			};
			setMessages((prevMessages) => [...prevMessages, errorMessage]);
		}
	};

	// Обработчик нажатия Enter
	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleSendMessage();
		}
	};

	// Прокрутка вниз
	const scrollToBottom = () => {
		if (mainRef.current) {
			mainRef.current.scrollTop = mainRef.current.scrollHeight;
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, selectedMenu]); // Добавляем messages в зависимости, чтобы прокручивать при новых сообщениях
	const renderMainContent = () => {
		switch (selectedMenu) {
			case 'LoryAI':
				return (
					<div className="p-4 flex flex-col h-full">
						{/* Заголовок чата */}
						<div className="mb-4 bg-gray-100 p-4 rounded-lg shadow">
							<div className="flex items-center gap-2">
								<img src="/Logo-ico.svg" alt="Logo" className="h-8" />
								<h2 className="text-lg font-bold text-gray-800">Привет, я твой помощник LoryAI!</h2>
							</div>
							<p className="text-sm text-gray-600 mt-1">
								Я могу генерировать текст и фото для вашей компании
							</p>
						</div>

						{/* История сообщений */}
						<div className="flex-1 overflow-y-auto mb-4">
							{messages.map((message, index) => (
								<div
									key={index}
									className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
								>
									<div
										className={`p-4 rounded-lg shadow ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
											} max-w-[70%]`}
									>
										<p className="text-sm">{message.text}</p>
									</div>
								</div>
							))}
						</div>

						{/* Поле ввода и кнопка */}
						<div className="flex items-center space-x-2">
							<input
								type="text"
								value={inputText}
								onChange={(e) => setInputText(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder="Чем могу помочь вам сегодня?"
								className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<button
								onClick={handleSendMessage}
								className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
							>
								Отправить
							</button>
						</div>
					</div>
				);
			case 'Сотрудники':
				return (
					<div className="p-4">
						{/* Таблица сотрудников, но с данными клиентов */}
						<div className="overflow-x-auto">
							<table className="min-w-full bg-white border border-gray-200 rounded-lg">
								<thead>
									<tr className="bg-gray-50">
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b"></th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Клиент</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Телефон</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Посещений</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Отмененные</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Выручка</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className="px-4 py-2 border-b">
											<input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
										</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">Владимир Трубиков</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">+7 914 218-30-18</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">2</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">0</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">1 000</td>
									</tr>
									<tr>
										<td className="px-4 py-2 border-b">
											<input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
										</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">Григорий Акаев</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">+7 924 664-33-35</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">33</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">10</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">36 478</td>
									</tr>
									<tr>
										<td className="px-4 py-2 border-b">
											<input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked />
										</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">Павел Буздарь</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">+7 964 432-85-36</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">15</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">5</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">69 000</td>
									</tr>
									<tr>
										<td className="px-4 py-2 border-b">
											<input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked />
										</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">Ханалыев Ленат</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">+7 962 724-88-34</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">4</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">0</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">10 000</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				);
			case 'Аналитика':
				return <h1 className="p-4">Аналитика</h1>;
			case 'Календарь':
				return <h1 className="p-4">Календарь</h1>;
			case 'Клиенты':
				return (
					<div className="p-4">
						{/* Общая статистика */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
							<div className="bg-gray-100 p-4 rounded-lg shadow">
								<h2 className="text-2xl font-bold text-gray-800">11 410</h2>
								<p className="text-sm text-gray-600">Клиенты за 6 мес.</p>
							</div>
							<div className="bg-gray-100 p-4 rounded-lg shadow">
								<h2 className="text-2xl font-bold text-gray-800">2 129</h2>
								<p className="text-sm text-gray-600">Постоянные</p>
							</div>
							<div className="bg-gray-100 p-4 rounded-lg shadow">
								<h2 className="text-2xl font-bold text-gray-800">4 738</h2>
								<p className="text-sm text-gray-600">Потенциальные (менее 3 посещений)</p>
							</div>
							<div className="bg-gray-100 p-4 rounded-lg shadow">
								<h2 className="text-2xl font-bold text-gray-800">4 543</h2>
								<p className="text-sm text-gray-600">Общо по посещению за 6 мес.</p>
							</div>
						</div>

						{/* Таблица сотрудников */}
						<div className="overflow-x-auto">
							<table className="min-w-full bg-white border border-gray-200 rounded-lg">
								<thead>
									<tr className="bg-gray-50">
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b"></th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Клиент</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Телефон</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Посещений</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Отмененные</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Выручка</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className="px-4 py-2 border-b">
											<input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
										</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">Владимир Трубиков</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">+7 914 218-30-18</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">2</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">0</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">1 000</td>
									</tr>
									<tr>
										<td className="px-4 py-2 border-b">
											<input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
										</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">Григорий Акаев</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">+7 924 664-33-35</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">33</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">10</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">36 478</td>
									</tr>
									<tr>
										<td className="px-4 py-2 border-b">
											<input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked />
										</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">Павел Буздарь</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">+7 964 432-85-36</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">15</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">5</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">69 000</td>
									</tr>
									<tr>
										<td className="px-4 py-2 border-b">
											<input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked />
										</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">Ханалыев Ленат</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">+7 962 724-88-34</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">4</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">0</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">10 000</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				);
			case 'Товары':
				return (
					< div className="p-4" >
						<h1 className="text-xl font-bold mb-4">Товары</h1>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							{products.map((product) => (
								<div
									key={product.id}
									className="bg-white rounded-2xl shadow-md overflow-hidden"
								>
									<img
										src={product.image}
										alt={product.title}
										className="w-full h-60 object-cover rounded-t-lg"
									/>
									<div className="p-4 bg-[#F6F7F8] rounded-2xl">
										<h3 className="text-lg font-semibold text-gray-800">
											{product.title}
										</h3>
										<p className="text-sm text-gray-600 mt-1">
											{product.description}
										</p>
										<p className="text-lg font-bold text-gray-800 mt-2">
											{product.price} ₽
										</p>
									</div>
								</div>
							))}
						</div>
					</div >
				)
			default:
				return <div className="p-4">Выберите пункт меню</div>;
		}
	};

	return (
		<main
			ref={mainRef} // Привязываем ref к элементу <main>
			className={`md:fixed rounded-2xl bg-white pr-4 md:pt-2 md:px-6 md:left-0 w-screen md:w-[calc(100vw-17rem)] h-[calc(100vh-136px)] overflow-y-auto overflow-x-hidden ${isSidebarOpen ? 'translate-x-full' : '-translate-x-0'
				} md:translate-x-0 z-10`}
		>
			{isLoading ? <div className="p-4">Loading...</div> : renderMainContent()}
		</main>
	);
}

export default MainContent;