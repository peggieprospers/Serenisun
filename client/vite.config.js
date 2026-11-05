import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],            // keep your existing plugins line as it is
  server: {
    proxy: { '/api': 'http://localhost:5001' },
  },
});
