import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    rollupOptions: {
      external: [/legacy-vanilla/],
    },
  },
  server: {
    fs: {
      deny: ['legacy-vanilla'],
    },
  },
  optimizeDeps: {
    entries: ['index.html'],
    exclude: ['legacy-vanilla'],
  },
})
