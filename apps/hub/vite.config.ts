import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The hub is built on its own; Letterwell and BuildCalc are added to the final
// site by scripts/assemble-site.mjs in the repository root.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
