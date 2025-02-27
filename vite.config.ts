import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	// server: {
	// 	allowedHosts: ['5c3f-2001-448a-4044-2c17-d5e9-78d2-f61f-e221.ngrok-free.app'],
	// 	cors: true
	// }
});
