// Prerenders one static HTML page per language: dist/index.html (English, /letterwell/)
// and dist/bg/index.html (Bulgarian, /letterwell/bg/), each with its own head metadata.
// The shared shell is injected afterwards by zy-inject (see the build script).
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { createServer } from 'vite'

const site = 'https://zyankov.eu'
const placeholder = '<div id="root"></div>'

const escape = (value) =>
  String(value).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

function setMeta(html, attribute, key, value) {
  const pattern = new RegExp(`(<meta\\s+${attribute}="${key}"\\s+content=")[^"]*(")`)
  if (!pattern.test(html)) throw new Error(`Missing <meta ${attribute}="${key}"> in index.html.`)
  return html.replace(pattern, `$1${escape(value)}$2`)
}

function localizeHead(html, { language, url, meta, social }) {
  let out = html.replace(/<html lang="[^"]*"/, `<html lang="${language}"`)
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${escape(meta.title)}</title>`)
  out = out.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
  out = setMeta(out, 'name', 'description', meta.description)
  out = setMeta(out, 'property', 'og:locale', language === 'bg' ? 'bg_BG' : 'en_US')
  out = setMeta(out, 'property', 'og:url', url)
  out = setMeta(out, 'property', 'og:title', meta.title)
  out = setMeta(out, 'property', 'og:description', social)
  out = setMeta(out, 'name', 'twitter:title', meta.title)
  out = setMeta(out, 'name', 'twitter:description', social)
  const image = `${site}/og/${language === 'bg' ? 'letterwell-bg' : 'letterwell'}.png`
  out = setMeta(out, 'property', 'og:image', image)
  out = setMeta(out, 'name', 'twitter:image', image)
  const structured = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Letterwell',
    url,
    applicationCategory: 'GameApplication',
    operatingSystem: 'Any',
    inLanguage: language,
    description: meta.structuredDescription,
    featureList: meta.features,
  }
  out = out.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">${JSON.stringify(structured).replace(/</g, '\\u003c')}</script>`,
  )
  return out
}

const vite = await createServer({ appType: 'custom', server: { middlewareMode: true } })

try {
  const { default: App } = await vite.ssrLoadModule('/src/App.tsx')
  const { languages, languagePath, seoMetadata, socialDescriptions } = await vite.ssrLoadModule('/src/seo.ts')
  const template = await readFile(resolve('dist/index.html'), 'utf8')
  if (!template.includes(placeholder)) throw new Error('Could not find the Letterwell root element to prerender.')

  for (const language of languages) {
    const path = languagePath(language)
    const markup = renderToString(createElement(App, { language }))
    const html = localizeHead(template.replace(placeholder, `<div id="root">${markup}</div>`), {
      language,
      url: `${site}${path}`,
      meta: seoMetadata[language],
      social: socialDescriptions[language],
    })
    const file = resolve('dist', path.replace(/^\/letterwell\//, ''), 'index.html')
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, html)
    console.log(`prerendered ${path}`)
  }
} finally {
  await vite.close()
}
