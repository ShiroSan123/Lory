import { createContext, useContext, useState, useEffect } from 'react';

// Создаём контекст
const ThemeContext = createContext();

// Провайдер темы
export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState('light'); // По умолчанию светлая тема

	// При монтировании проверяем сохранённую тему в localStorage
	useEffect(() => {
		const savedTheme = localStorage.getItem('theme') || 'light';
		setTheme(savedTheme);
		document.documentElement.classList.add(savedTheme);
	}, []);

	// Функция для переключения темы
	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
		localStorage.setItem('theme', newTheme);
		document.documentElement.classList.remove(theme);
		document.documentElement.classList.add(newTheme);
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

// Хук для использования темы
export const useTheme = () => useContext(ThemeContext);