// telegram.d.ts
interface TelegramWebApp {
	initData: string;
	initDataUnsafe: any; // Можно уточнить тип, если знаете структуру
	ready: () => void;
	close: () => void;
	expand: () => void;
	// Добавьте другие методы и свойства Telegram.WebApp, которые используете
}

declare global {
	interface Window {
		Telegram: {
			WebApp: TelegramWebApp;
		};
	}
}