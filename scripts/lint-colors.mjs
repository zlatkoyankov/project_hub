// Fails when a colour literal (hex, rgb(), hsl()) appears outside the design tokens.
// Colours belong in packages/design-system/tokens.css; everything else uses var(--token).
import { readdir, readFile } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const allowed = new Set(['packages/design-system/tokens.css'])
const skipDirs = new Set(['node_modules', 'dist', 'public', '.angular', 'preview-dist'])
const colour = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b|\b(?:rgba?|hsla?)\(/g

async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name) || entry.name.startsWith('.')) continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* files(path)
    else if (/\.(css|scss)$/.test(entry.name)) yield path
  }
}

let problems = 0
for (const base of ['apps', 'packages']) {
  for await (const file of files(join(root, base))) {
    const rel = relative(root, file)
    if (allowed.has(rel)) continue
    const lines = (await readFile(file, 'utf8')).split('\n')
    lines.forEach((line, i) => {
      const code = line.replace(/\/\*.*?\*\//g, '')
      for (const match of code.matchAll(colour)) {
        if (/url\(/.test(code)) continue
        console.log(`${rel}:${i + 1}: ${match[0]}  ${line.trim()}`)
        problems++
      }
    })
  }
}

if (problems) {
  console.error(`\n${problems} colour literal(s) outside tokens.css. Use a var(--token) instead.`)
  process.exit(1)
}
console.log('lint:colors: no colour literals outside tokens.css')
