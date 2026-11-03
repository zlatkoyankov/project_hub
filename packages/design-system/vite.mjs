// Vite plugin: injects the shared shell into every HTML page Vite processes (dev and build).
import { injectShell } from './shell/inject.mjs'

export function zyShell({ project, main = 'main' }) {
  return {
    name: 'zyankov-shell',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => injectShell(html, { project, main }),
    },
  }
}
