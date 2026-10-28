import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  server: {
    port: 3000,
    host: true,
    allowedHosts: true,
    open: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true
      }
    },
    watch: {
      ignored: ['**/*.apk', '**/node_modules/**', '**/.git/**']
    }
  }
})
