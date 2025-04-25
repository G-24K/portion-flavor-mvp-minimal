import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3001,
    hmr: {
      clientPort: 3001, // Use the same port as the forwarded URL
      host: 'glorious-space-waddle-7v76jrwjgpp93rjq5-3001.app.github.dev',
      protocol: 'wss',
    },
  },
});