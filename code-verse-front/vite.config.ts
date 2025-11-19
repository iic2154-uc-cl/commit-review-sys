import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'


// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    cors: true,
    // Configure the proxy to redirect API requests
    // to the backend server
    proxy: {
      '/auth': {
        target: 'https://aicommit.ing.puc.cl',
        changeOrigin: true,
        secure: true,
      },
      '/api': {
        target: 'https://aicommit.ing.puc.cl',
        changeOrigin: true,
        secure: true,
      },
    }
  },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
