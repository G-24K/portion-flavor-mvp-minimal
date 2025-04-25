import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // Avoid conflict with backend on 3000
    strictPort: true, // Fail if port 3001 is in use
    hmr: true, // Enable hot module replacement
  },
  logLevel: 'info', // Increase logging for debugging
});