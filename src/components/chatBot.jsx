import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatBot = ({ onSubmitData, customBotMessage, showButtons, onButtonClick, startRegistration }) => {
	const [messages, setMessages] = useState([
		{
			sender: 'bot',
			text: 'Привет! Я твой помощник LoryAI. Я могу помочь с регистрацией бизнеса или ответить на твои вопросы.\n\nДоступные команды:\n/reg - Начать регистрацию бизнеса\n/ai - Задать вопрос ИИ\n\nЧем могу помочь?',
		},
	]);
	const [inputText, setInputText] = useState('');
	const [mode, setMode] = useState('welcome');
	const chatRef = useRef(null);

	const addMessage = (message) => setMessages((prev) => [...prev, message]);

	const handleSendMessage = async () => {
		if (!inputText.trim()) return;

		addMessage({ sender: 'user', text: inputText });
		const trimmedInput = inputText.trim().toLowerCase();

		if (mode === 'welcome') {
			if (trimmedInput === '/reg') {
				setMode('registration');
				startRegistration(); // Сбрасываем состояние регистрации
				addMessage({ sender: 'bot', text: 'Отлично! Давай начнем регистрацию бизнеса. Как называется твой бизнес?' });
			} else if (trimmedInput === '/ai') {
				setMode('ai');
				addMessage({ sender: 'bot', text: 'Задай свой вопрос, и я постараюсь ответить!' });
			} else {
				addMessage({ sender: 'bot', text: 'Пожалуйста, выбери команду: /reg для регистрации бизнеса или /ai для вопросов ИИ.' });
			}
			setInputText('');
			return;
		}

		if (mode === 'registration') {
			await onSubmitData(inputText, addMessage);
			setInputText('');
			return;
		}

		if (mode === 'ai') {
			try {
				const response = await axios.post(
					'https://my-vercel-server-eduards-projects-e1b5b4e2.vercel.app/api/chat',
					{ message: inputText },
					{
						headers: {
							'Authorization': 'Bearer a8f3cd34d3ad67e1f4b3f1a8d3cc432f9b2f9c9ac4d84c79e0d40a8c9ef0c8dd',
							'Content-Type': 'application/json',
						},
					}
				);
				const botMessage = { sender: 'bot', text: response.data.response || 'Ответ от сервера' };
				addMessage(botMessage);
			} catch (err) {
				console.error('Ошибка при отправке сообщения:', err);
				addMessage({ sender: 'bot', text: 'Произошла ошибка. Попробуйте снова.' });
			}
			setInputText('');
			return;
		}
	};

	const handleKeyPress = (e) => e.key === 'Enter' && handleSendMessage();

	const handleButtonClick = (choice) => {
		addMessage({ sender: 'user', text: choice });
		onButtonClick(choice);
	};

	useEffect(() => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<div className="flex flex-col h-full p-4">
			<header className="mb-4 bg-gray-100 p-4 rounded-lg shadow">
				<div className="flex items-center gap-2">
					<img src="/Logo-ico.svg" alt="Logo" className="h-8" />
					<h2 className="text-lg font-bold text-gray-800">Привет, я LoryAI!</h2>
				</div>
				<p className="mt-1 text-sm text-gray-600">Генерирую текст и фото для вашей компании</p>
			</header>
			<main ref={chatRef} className="flex-1 mb-4 overflow-y-auto max-h-[calc(100vh-300px)]">
				{messages.map((msg, idx) => (
					<div
						key={idx}
						className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
					>
						<div
							className={`p-4 rounded-lg shadow max-w-[70%] ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
								}`}
						>
							<p className="text-sm">{msg.text}</p>
						</div>
					</div>
				))}
			</main>
			<footer className="flex items-center gap-2">
				{showButtons ? (
					<div className="flex gap-2 w-full">
						<button
							onClick={() => handleButtonClick('оставить')}
							className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
						>
							Оставить
						</button>
						<button
							onClick={() => handleButtonClick('поменять')}
							className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
						>
							Поменять
						</button>
					</div>
				) : (
					<>
						<input
							type="text"
							value={inputText}
							onChange={(e) => setInputText(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Чем могу помочь?"
							className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button
							onClick={handleSendMessage}
							className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
						>
							Отправить
						</button>
					</>
				)}
			</footer>
		</div>
	);
};

export default ChatBot;