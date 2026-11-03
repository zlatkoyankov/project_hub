#!/usr/bin/env node
// Replaces the shell slots in HTML with the shared head snippet, top bar and footer.
//
// Slots (put them in each app's index.html):
//   <template data-zy-slot="head"></template>     inside <head>
//   <template data-zy-slot="bar"></template>      first thing in <body>
//   <template data-zy-slot="footer"></template>   after the app root
//
// Library:  injectShell(html, { project, main })
// CLI:      node inject.mjs <dir> --project <slug> [--main <id>]
//           rewrites every .html file under <dir> that contains a slot.
import { realpathSync } from 'node:fs'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderBar, renderFooter, renderHead } from './render.mjs'

const slot = (name) => new RegExp(`<template data-zy-slot="${name}"\\s*>\\s*</template>`, 'g')

export function hasSlots(html) {
  return /<template data-zy-slot="/.test(html)
}

export function injectShell(html, { project = 'hub', main = 'main' } = {}) {
  let out = html
    .replace(slot('head'), () => renderHead())
    .replace(slot('bar'), () => renderBar({ project, main }))
    .replace(slot('footer'), () => renderFooter({ project }))
  if (!/<html[^>]*\sdata-project=/.test(out)) {
    out = out.replace(/<html(\s|>)/, `<html data-project="${project}"$1`)
  }
  return out
}

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* htmlFiles(path)
    else if (entry.name.endsWith('.html')) yield path
  }
}

async function main(argv) {
  const [dir, ...rest] = argv
  const option = (name, fallback) => {
    const i = rest.indexOf(`--${name}`)
    return i >= 0 ? rest[i + 1] : fallback
  }
  if (!dir) throw new Error('Usage: inject.mjs <dir> --project <slug> [--main <id>]')
  const project = option('project', 'hub')
  const mainId = option('main', 'main')
  let changed = 0
  for await (const file of htmlFiles(resolve(dir))) {
    const html = await readFile(file, 'utf8')
    if (!hasSlots(html)) continue
    await writeFile(file, injectShell(html, { project, main: mainId }))
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
