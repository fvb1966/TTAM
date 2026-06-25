import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

export default defineConfig({
  plugins: [react()],
  // Use a relative base path for production so Vite-built assets load correctly
  // when served from the filesystem (file://) inside an Electron packaged app.
  base: process.env.NODE_ENV === 'development' ? '/' : './',
  root: '.',
  build: {
    outDir: 'dist/renderer',
    rollupOptions: {
      input: path.resolve(__dirname, 'src/renderer/index.html'),
    },
  },
  server: {
    port: 5173,
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
})
