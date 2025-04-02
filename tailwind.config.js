/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}", // Указывает, где искать классы Tailwind
	],
	theme: {
		extend: {}, // Здесь можно расширить стандартные стили
	},
	plugins: [],
}