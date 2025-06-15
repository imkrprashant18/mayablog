// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // your backend
        changeOrigin: true,
        secure: false,
        // keep /api prefix so your backend route should include /api
        // if your backend route does not have /api, uncomment the rewrite line below
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
