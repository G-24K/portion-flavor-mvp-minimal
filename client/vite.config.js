import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all interfaces
    port: 3001,
    hmr: {
      host: 'glorious-space-waddle-7v76jrwjgpp93rjq5-3001.app.github.dev',
      protocol: 'wss',
      port: 3001,
    },
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8', // Force correct MIME type for JS files
    },
  },
});