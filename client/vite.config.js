import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allows external access
    port: 5173,
    strictPort: true,
    allowedHosts: [
      'e58b-110-227-210-237.ngrok-free.app', // Add your Ngrok host manually
      '.ngrok-free.app' // Allow all Ngrok URLs
    ],
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
  },
});


