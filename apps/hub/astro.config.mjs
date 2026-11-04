// The zyankov.eu hub: homepage, blog and information pages, built as static HTML.
// Letterwell and BuildCalc are built separately and added by scripts/assemble-site.mjs.
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://zyankov.eu',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
})
