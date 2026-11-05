#!/usr/bin/env node
// Replaces the shell slots in HTML with the shared head snippet, top bar and footer.
//
// Slots (put them in each app's index.html):
//   <template data-zy-slot="head"></template>     inside <head>
//   <template data-zy-slot="bar"></template>      first thing in <body>
//   <template data-zy-slot="footer"></template>   after the app root
//   <template data-zy-slot="privacy-analytics"></template>  privacy policy only
//
// Library:  injectShell(html, { project, main, path })   path decides whether ads load
//           (privacy and terms pages never load ad tags; <meta name="zy-ads" content="off"> also turns them off)
// CLI:      node inject.mjs <dir> --project <slug> [--main <id>] [--base <url path>]
//           rewrites every .html file under <dir> that contains a slot. With --base (the URL path the
//           directory is served from), it also preloads the page language's body and heading fonts.
import { realpathSync } from 'node:fs'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { basename, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderBar, renderFooter, renderHead, renderPrivacyAnalytics } from './render.mjs'

const slot = (name) => new RegExp(`<template data-zy-slot="${name}"\\s*>\\s*</template>`, 'g')

export function hasSlots(html) {
  return /<template data-zy-slot="/.test(html)
}

// Pages that must not load ad tags (Google: privacy and cookie-policy pages carry no ad tags).
const NO_ADS_PAGE = /(^|\/)(privacy|terms|disclaimer)(\/(index\.html)?)?$/

/** True when the page at this path (URL path or file path) should load no ads. */
export function isNoAdsPage(path = '') {
  return NO_ADS_PAGE.test(path.replace(/\\/g, '/'))
}

/** Language of the page: <html lang="…">, else 'en'. */
export function pageLanguage(html) {
  return /<html[^>]*\slang="bg/i.test(html) ? 'bg' : 'en'
}

/** hreflang alternates declared in the page head: { en: url, bg: url }. */
export function pageAlternates(html) {
  const alternates = {}
  for (const tag of html.match(/<link[^>]+rel="alternate"[^>]*>/g) ?? []) {
    const lang = /hreflang="([a-z]{2})"/.exec(tag)?.[1]
    const href = /href="([^"]+)"/.exec(tag)?.[1]
    if (lang && href) alternates[lang] = href
  }
  return alternates
}

// Calculators shown inside other sites' iframes: no site bar, footer or ads.
const EMBED_PAGE = /(^|\/)embed\//

/** True for pages built to be embedded in other sites. */
export function isEmbedPage(path = '') {
  return EMBED_PAGE.test(path.replace(/\\/g, '/'))
}

// Fonts to preload for each page language: the heading face and the body face, in the subset the
// language needs. Preloading stops text from being painted twice (fallback font, then the real one).
const PRELOAD_FONTS = {
  en: ['literata-latin-opsz-normal', 'onest-latin-wght-normal'],
  bg: ['literata-cyrillic-opsz-normal', 'onest-cyrillic-wght-normal'],
}

/** <link rel="preload"> tags for the language, picked from the built font URLs. */
export function fontPreloads(lang, fontUrls = []) {
  return (PRELOAD_FONTS[lang] ?? PRELOAD_FONTS.en)
    .map((name) => fontUrls.find((url) => basename(url).startsWith(name)))
    .filter(Boolean)
    .map((href) => `<link rel="preload" href="${href}" as="font" type="font/woff2" crossorigin>`)
    .join('')
}

export function injectShell(html, { project = 'hub', main = 'main', path = '', fontUrls = [] } = {}) {
  const embed = isEmbedPage(path)
  const ads = !embed && !isNoAdsPage(path) && !/<meta name="zy-ads" content="off"/.test(html)
  const lang = pageLanguage(html)
  const alternates = pageAlternates(html)
  let out = html
    .replace(slot('head'), () => renderHead({ ads }) + fontPreloads(lang, fontUrls))
    .replace(slot('bar'), () => (embed ? '' : renderBar({ project, main, lang, alternates })))
    .replace(slot('footer'), () => (embed ? '' : renderFooter({ project, lang })))
    .replace(slot('privacy-analytics'), () => renderPrivacyAnalytics())
  if (!/<html[^>]*\sdata-project=/.test(out)) {
    out = out.replace(/<html(\s|>)/, `<html data-project="${project}"$1`)
  }
  return out
}

async function* filesWith(dir, extension) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* filesWith(path, extension)
    else if (entry.name.endsWith(extension)) yield path
  }
}
const htmlFiles = (dir) => filesWith(dir, '.html')

async function main(argv) {
  const [dir, ...rest] = argv
  const option = (name, fallback) => {
    const i = rest.indexOf(`--${name}`)
    return i >= 0 ? rest[i + 1] : fallback
  }
  if (!dir) throw new Error('Usage: inject.mjs <dir> --project <slug> [--main <id>]')
  const project = option('project', 'hub')
  const mainId = option('main', 'main')
  const base = option('base', '')
  const fontUrls = []
  if (base) {
    for await (const file of filesWith(resolve(dir), '.woff2')) {
      fontUrls.push(base.replace(/\/?$/, '/') + relative(resolve(dir), file).split(sep).join('/'))
    }
  }
  let changed = 0
  for await (const file of htmlFiles(resolve(dir))) {
    const html = await readFile(file, 'utf8')
    if (!hasSlots(html)) continue
    await writeFile(file, injectShell(html, { project, main: mainId, path: relative(resolve(dir), file), fontUrls }))
    changed++
  }
  if (changed === 0) throw new Error(`No shell slots found in ${dir}.`)
  console.log(`zyankov shell: injected into ${changed} page(s) in ${dir}`)
}

// Run as a CLI (also through the npm bin symlink).
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
}
