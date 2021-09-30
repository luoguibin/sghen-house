import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['ie >= 11'],
    })],
  base: './',
  // esbuild: false,

  resolve: {
    extensions: ['.js', '.vue', '.json', '.ts'],
    alias: {
      '@': path.resolve(__dirname, "./src")
    }
  },

  server: {
    port: 3000,
    open: false,
    proxy: {
      '/sapi/': {
        target: 'https://www.sghen.cn',
        ws: false,
        secure: true,
        changeOrigin: true
      },
      '/napi/': {
        target: 'https://www.sghen.cn',
        ws: false,
        secure: true,
        changeOrigin: true
      }
    }
  }
})
