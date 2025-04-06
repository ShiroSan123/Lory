import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default {
	server: {
		proxy: {
			'/auth': {
				target: 'https://example.com',
				changeOrigin: true,
				secure: false, // Если SSL-сертификат невалидный
			},
		},
	},
	plugins: [
		react(),
		tailwindcss(),
	],
};