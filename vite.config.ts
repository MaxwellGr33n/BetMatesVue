import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
 plugins: [
    vue(),
    vueJsx(),
 ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
 },
 // Expose environment variables to your Vite application
 define: {
    'process.env': process.env
 },
 })
