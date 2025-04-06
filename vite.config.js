import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default {
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:4200',
				changeOrigin: true,
			},
		},
		port: 4200
	},
	plugins: [
		react(),
		tailwindcss(),
	],
};