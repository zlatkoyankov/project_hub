import { zyShell } from '@zyankov/design-system/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), zyShell({ project: 'letterwell', main: 'top', devOnly: true })],
  base: '/letterwell/',
})
