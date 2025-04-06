// src/types/global.d.ts
interface TelegramWebApp {
	initData: string;
	initDataUnsafe: {
		id?: number;
		first_name?: string;
		last_name?: string;
		username?: string;
		[key: string]: any;
	};
	expand: () => void;
	// Добавь другие методы или свойства Telegram Web App, если используешь
}

declare global {
	interface Window {
		Telegram?: {
			WebApp: TelegramWebApp;
		};
	}
}

export { };