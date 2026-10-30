import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createServer } from 'vite'

const vite = await createServer({
  appType: 'custom',
  server: { middlewareMode: true },
})

try {
  const { default: App } = await vite.ssrLoadModule('/src/App.tsx')
  const root = resolve('dist/index.html')
  const html = await readFile(root, 'utf8')
  const placeholder = '<div id="root"></div>'

  if (!html.includes(placeholder)) {
    throw new Error('Could not find the Letterwell root element to prerender.')
  }

  const markup = renderToString(createElement(App))
  await writeFile(root, html.replace(placeholder, `<div id="root">${markup}</div>`))
} finally {
  await vite.close()
}
