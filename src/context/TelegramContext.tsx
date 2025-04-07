import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Интерфейс для пользователя Telegram
interface TelegramUser {
	id: number;
	first_name: string;
	last_name: string;
	username: string;
	language_code?: string;
	is_premium?: boolean;
	allows_write_to_pm?: boolean;
	photo_url?: string;
}

// Интерфейс для initDataUnsafe
interface InitDataUnsafe {
	user: TelegramUser;
	chat_instance?: string;
	chat_type?: string;
	auth_date?: string;
	signature?: string;
	hash?: string;
}

// Тип для контекста
interface TelegramContextType {
	userData: InitDataUnsafe | null;
	isTelegram: boolean;
}

// Создаём контекст с начальным значением undefined
const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

// Провайдер контекста
export const TelegramProvider = ({ children }: { children: ReactNode }) => {
	const [isTelegram, setIsTelegram] = useState(false);
	const [userData, setUserData] = useState<InitDataUnsafe | null>(null);

	useEffect(() => {
		if (!window.Telegram) {
			console.log('window.Telegram отсутствует');
			return;
		}

		if (!window.Telegram.WebApp) {
			console.log('Telegram.WebApp отсутствует');
			return;
		}

		
		const telegram = window.Telegram.WebApp;
		telegram.expand();

		const initDataUnsafe = telegram.initDataUnsafe;
		
		
		console.log('initDataUnsafe:', initDataUnsafe);
		console.log('Ключи initDataUnsafe:', Object.keys(initDataUnsafe));

		if (initDataUnsafe && Object.keys(initDataUnsafe).length > 0) {
			setIsTelegram(true);
			console.log("telegram init");
			setUserData({ ...initDataUnsafe });
		}
	}, []);

	return (
		<TelegramContext.Provider value={{ userData, isTelegram }}>
			{children}
		</TelegramContext.Provider>
	);
};

// Хук для удобного доступа к контексту
export const useTelegram = () => {
	const context = useContext(TelegramContext);
	if (context === undefined) {
		throw new Error('useTelegram must be used within a TelegramProvider');
	}
	return context;
};