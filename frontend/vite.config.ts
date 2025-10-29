import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { iframeErrorPropagation } from './vite-plugin-iframe-errors.ts';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), iframeErrorPropagation()],
    server: {
        allowedHosts: process.env.ALLOWED_HOSTS?.split(',') || true,
        host: '0.0.0.0',
        port: parseInt(process.env.PORT!) || 3000,
        proxy: {
            '/api': {
                target: process.env.VITE_API_BASE_URL || 'http://localhost:4000',
                changeOrigin: true,
                timeout: 60000,
                rewrite: path => path
            }
        }
    },
    base: './',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    }
});
