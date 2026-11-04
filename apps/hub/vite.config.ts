import { zyShell } from '@zyankov/design-system/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// The hub is built on its own; Letterwell and BuildCalc are added to the final
// site by scripts/assemble-site.mjs in the repository root.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), zyShell({ project: 'hub', main: 'top' })],
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        privacy: resolve(import.meta.dirname, 'privacy/index.html'),
        terms: resolve(import.meta.dirname, 'terms/index.html'),
        about: resolve(import.meta.dirname, 'about/index.html'),
        disclaimer: resolve(import.meta.dirname, 'disclaimer/index.html'),
      },
    },
  },
})
