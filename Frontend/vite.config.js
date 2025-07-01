import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/auth': {
        target: 'https://tracepoint-usj3.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
