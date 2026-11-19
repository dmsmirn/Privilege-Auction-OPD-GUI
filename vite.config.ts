import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Запросы на /api уходят на C++-сервер, поэтому в коде не нужен адрес сервера
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
