// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or whatever you use

export default defineConfig({
  base: './',   // ← add this line (important for GitHub Pages)
  plugins: [react()],
  // ...other config
})
