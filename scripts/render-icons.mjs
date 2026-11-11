// Renders the site icons from one SVG source, so the favicon, app icons and the BuildCalc and Letterwell
// favicons always match. Run after changing the mark or its colours: node scripts/render-icons.mjs
//
// Colours: the navy tile is --inverse-bg (light theme) and the strokes are --inverse-text, with the coral
// underline from the dark theme's --coral, as in tokens.css. Raster files cannot read CSS variables.
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const NAVY = '#1f2a44'
const PAPER = '#f7f3ea'
const CORAL = '#ef8a5f'
const mark = `<g transform="translate(32 32) scale(1.12) translate(-22 -20)"><path d="M3 8h15L4 28h16M15 8l8 9 9-9m-9 9v11m5-20h14M30 17h11M30 28h11m-11-20v20" fill="none" stroke="${PAPER}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 32h12" fill="none" stroke="${CORAL}" stroke-width="3.2" stroke-linecap="round"/></g>`

/** The rounded tile used as favicon and app icon. */
const tile = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="zyankov.eu"><rect width="64" height="64" rx="14" fill="${NAVY}"/>${mark}</svg>`
/** Full-bleed square with the mark inside the 80% safe zone, for Android's maskable icon. */
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${NAVY}"/><g transform="translate(32 32) scale(0.72) translate(-32 -32)">${mark}</g></svg>`
/** Apple adds its own rounded corners, so the touch icon is square too. */
const square = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${NAVY}"/>${mark}</svg>`

const png = (svg, size) => new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng()

/** A .ico file that holds PNG images (supported by every current browser). */
function ico(images) {
  const header = Buffer.alloc(6 + images.length * 16)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)
  let offset = header.length
  images.forEach(({ size, data }, index) => {
    const entry = 6 + index * 16
    header.writeUInt8(size % 256, entry)
    header.writeUInt8(size % 256, entry + 1)
    header.writeUInt16LE(1, entry + 4)
    header.writeUInt16LE(32, entry + 6)
    header.writeUInt32LE(data.length, entry + 8)
    header.writeUInt32LE(offset, entry + 12)
    offset += data.length
  })
  return Buffer.concat([header, ...images.map((image) => image.data)])
}

const favicon = ico([16, 32, 48].map((size) => ({ size, data: png(tile, size) })))
const outputs = {
  'apps/hub/public/favicon.svg': tile,
  'apps/hub/public/favicon.ico': favicon,
  'apps/hub/public/icon-192.png': png(tile, 192),
  'apps/hub/public/icon-512.png': png(tile, 512),
  'apps/hub/public/icon-maskable-512.png': png(maskable, 512),
  'apps/hub/public/apple-touch-icon.png': png(square, 180),
  'apps/buildcalc/public/favicon.ico': favicon,
  'apps/letterwell/public/favicon.svg': tile,
}
for (const [path, data] of Object.entries(outputs)) {
  await writeFile(resolve(root, path), data)
  console.log(`wrote ${path}`)
}
