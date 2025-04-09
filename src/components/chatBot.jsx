import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTheme } from '../ThemeContext';

const ChatBot = ({ onSubmitData, customBotMessage, showButtons, buttonOptions, onButtonClick, startRegistration, isLoading, children, onAddMessage }) => {
	const [messages, setMessages] = useState([
		{
			sender: 'bot',
			text: 'Привет! Я твой помощник LoryAI. Я могу помочь с регистрацией бизнеса или ответить на твои вопросы.\n\nДоступные команды:\n/reg - Начать регистрацию бизнеса\n/ai - Задать вопрос ИИ\n\nЧем могу помочь?',
		},
	]);
	const [inputText, setInputText] = useState('');
	const [mode, setMode] = useState('welcome');
	const chatRef = useRef(null);

	const addMessage = (message) => {
		console.log('[ChatBot] addMessage:', message);
		setMessages((prev) => [...prev, message]);
		onAddMessage?.(message); // Передаем сообщение родительскому компоненту
	};

	const handleSendMessage = async () => {
		if (!inputText.trim() || isLoading) return; // Блокируем отправку во время загрузки

		console.log('[ChatBot] handleSendMessage: inputText=', inputText);
		addMessage({ sender: 'user', text: inputText });
		const trimmedInput = inputText.trim().toLowerCase();

		if (mode === 'welcome') {
			if (trimmedInput === '/reg') {
				setMode('registration');
				startRegistration && startRegistration();
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
				console.log('[ChatBot] handleSendMessage: AI response:', response.data);
				const botMessage = { sender: 'bot', text: response.data.response || 'Ответ от сервера' };
				addMessage(botMessage);
			} catch (err) {
				console.error('[ChatBot] handleSendMessage: Error:', err);
				addMessage({ sender: 'bot', text: 'Произошла ошибка. Попробуйте снова.' });
			}
			setInputText('');
			return;
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && !isLoading) {
			handleSendMessage();
		}
	};

	const handleButtonClick = (value) => {
		console.log('[ChatBot] handleButtonClick: value=', value);
		addMessage({ sender: 'user', text: value });
		onButtonClick(value, addMessage);
	};

	useEffect(() => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	}, [messages]);

	const { theme } = useTheme();

	return (
		// Центрирование и ограничение по ширине для адаптивности на десктопе и мобильных устройствах
		<div className={`flex flex-col h-full p-4 w-full max-w-md mx-auto ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'
			}`}>
			<header className="mb-4 bg-gray-100 p-4 rounded-lg shadow">
				<div className="flex items-center gap-2">
					<img src="/Logo-ico.svg" alt="Logo" className="h-8" />
					<h2 className="text-lg font-bold text-gray-800">Привет, я LoryAI!</h2>
				</div>
				<p className="mt-1 text-sm text-gray-600">Генерирую текст и фото для вашей компании</p>
			</header>
			<main
				ref={chatRef}
				className="chat-main flex-1 mb-4 overflow-y-auto max-h-[calc(100vh-300px)]"
			>
				{messages.map((msg, idx) => (
					<div key={idx} className="mb-4 flex justify-start">
						<div
							className={`p-4 rounded-lg shadow max-w-[70%] ${msg.sender === 'user'
								? 'bg-blue-500 text-white'
								: 'bg-white text-gray-800'
								}`}
						>
							<p className="text-sm">{msg.text}</p>
						</div>
					</div>
				))}
			</main>
			<footer className="flex flex-col items-center gap-2">
				{children} {/* Добавляем дочерние элементы для настройки */}
				{showButtons && buttonOptions.length > 0 ? (
					<div className="flex flex-wrap gap-2 w-full justify-center">
						{buttonOptions.map((option) => (
							<button
								key={option.value}
								onClick={() => handleButtonClick(option.value)}
								className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
								disabled={isLoading} // Блокируем кнопки выбора во время загрузки
							>
								{option.label}
							</button>
						))}
					</div>
				) : (
					<>
						<input
							type="text"
							value={inputText}
							onChange={(e) => setInputText(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Чем могу помочь?"
							className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
							disabled={isLoading} // Блокируем поле ввода во время загрузки
						/>
						<button
							onClick={handleSendMessage}
							className={`px-4 py-2 rounded-lg text-sm w-full ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
							disabled={isLoading} // Блокируем кнопку отправки во время загрузки
						>
							{isLoading ? 'Загрузка...' : 'Отправить'}
						</button>
					</>
				)}
			</footer>
		</div>
	);
};

export default ChatBot;
