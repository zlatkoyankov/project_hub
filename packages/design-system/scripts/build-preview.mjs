// Builds preview-dist/ with the preview page, styles and fonts, shell injected.
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { injectShell } from '../shell/inject.mjs'

const here = (path) => new URL(`../${path}`, import.meta.url)
await rm(here('preview-dist'), { recursive: true, force: true })
await mkdir(here('preview-dist'), { recursive: true })
for (const file of ['tokens.css', 'fonts.css', 'shell.css']) await cp(here(file), here(`preview-dist/${file}`))
await cp(here('fonts'), here('preview-dist/fonts'), { recursive: true })
const html = await readFile(here('preview.html'), 'utf8')
await writeFile(here('preview-dist/index.html'), injectShell(html, { project: 'design-system', main: 'main' }))
console.log('preview-dist/ ready')
