import react from '@vitejs/plugin-react'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'

function servePrerenderedCalculators(): Plugin {
  return {
    name: 'serve-prerendered-calculators',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        if (!request.url) {
          next()
          return
        }

        const url = new URL(request.url, 'http://localhost')
        if (!url.pathname.startsWith('/calculators/')) {
          next()
          return
        }

        const routeDirectory = resolve(process.cwd(), 'public', url.pathname.slice(1))
        if (!existsSync(resolve(routeDirectory, 'index.html'))) {
          next()
          return
        }

        url.pathname = `${url.pathname.replace(/\/?$/, '/')}index.html`
        request.url = `${url.pathname}${url.search}`
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), servePrerenderedCalculators()],
})
