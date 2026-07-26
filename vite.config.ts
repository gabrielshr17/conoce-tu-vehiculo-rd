import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    // Inline (empty) config so Vite doesn't walk up to a stray
    // ~/postcss.config.mjs from an unrelated project.
    postcss: {},
  },
})
