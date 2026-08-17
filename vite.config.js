import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' para que el build funcione en GitHub Pages bajo /<repo>/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173,
    strictPort: true,
  },
})
