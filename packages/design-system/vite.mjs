// Vite plugin: injects the shared shell into every HTML page Vite processes (dev and build).
import { injectShell } from './shell/inject.mjs'

// devOnly: inject only in the dev server; the build keeps the slots for a post-build
// `zy-inject` run (needed when a prerender step writes extra pages, such as language versions).
export function zyShell({ project, main = 'main', devOnly = false }) {
  return {
    name: 'zyankov-shell',
    ...(devOnly ? { apply: 'serve' } : {}),
    transformIndexHtml: {
      order: 'pre',
      handler: (html, ctx) => injectShell(html, { project, main, path: ctx.path }),
    },
  }
}
