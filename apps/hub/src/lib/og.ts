// Social sharing images (og:image), 1200×630 PNG, rendered at build time with satori + resvg.
// Raster output, so the brand colours are written out here (same values as tokens.css).
// Satori does not fall back between fonts of the same name, so the Cyrillic subsets have their
// own family names and are listed after the Latin ones in fontFamily.
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'

// Read from the project folder (the build runs in apps/hub); bundling moves this module.
const font = (file: string) => readFile(resolve(process.cwd(), 'src/og-fonts', file))

let fonts: Promise<{ name: string; data: Buffer; weight: 400 | 600 | 700; style: 'normal' }[]> | undefined
function loadFonts() {
  fonts ??= Promise.all([
    font('literata-latin-600-normal.woff').then((data) => ({ name: 'Literata', data, weight: 600 as const, style: 'normal' as const })),
    font('literata-cyrillic-600-normal.woff').then((data) => ({ name: 'Literata Cyrillic', data, weight: 600 as const, style: 'normal' as const })),
    font('onest-latin-400-normal.woff').then((data) => ({ name: 'Onest', data, weight: 400 as const, style: 'normal' as const })),
    font('onest-cyrillic-400-normal.woff').then((data) => ({ name: 'Onest Cyrillic', data, weight: 400 as const, style: 'normal' as const })),
    font('onest-latin-700-normal.woff').then((data) => ({ name: 'Onest', data, weight: 700 as const, style: 'normal' as const })),
    font('onest-cyrillic-700-normal.woff').then((data) => ({ name: 'Onest Cyrillic', data, weight: 700 as const, style: 'normal' as const })),
  ])
  return fonts
}

const INK = '#1f2a44' // --inverse-bg
const LIGHT = '#f7f3ea' // --inverse-text
const MUTED = '#c4cad8' // --inverse-muted
const CORAL = '#ef8a5f' // --coral (dark theme)

const monogram = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 5 44 30"><path d="M3 8h15L4 28h16M15 8l8 9 9-9m-9 9v11m5-20h14M30 17h11M30 28h11m-11-20v20" fill="none" stroke="${LIGHT}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 32h12" stroke="${CORAL}" stroke-width="2.6" stroke-linecap="round"/></svg>`,
)}`

type Node = { type: string; props: Record<string, unknown> }
const el = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style, children, ...extra },
})

export interface OgCard {
  title: string
  kicker: string
  footer?: string
}

export async function renderOg({ title, kicker, footer = 'zyankov.eu' }: OgCard): Promise<Buffer> {
  const size = title.length > 70 ? 56 : title.length > 45 ? 66 : 76
  // Outer box fills the canvas; the padded inner box stretches inside it (padding on a sized
  // box would push the content past the canvas edge).
  const tree = el('div', { width: '100%', height: '100%', display: 'flex', background: INK }, [
   el('div', { flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px', color: LIGHT, fontFamily: 'Onest, Onest Cyrillic' }, [
    el('div', { display: 'flex', alignItems: 'center', gap: '18px' }, [
      el('img', { width: 88, height: 60 }, undefined, { src: monogram, width: 88, height: 60 }),
      el('div', { fontSize: 34, fontWeight: 700, letterSpacing: '-0.5px' }, 'zyankov.eu'),
    ]),
    el('div', { display: 'flex', flexDirection: 'column' }, [
      el('div', { fontSize: 24, fontWeight: 700, letterSpacing: '3px', color: CORAL, textTransform: 'uppercase', marginBottom: '22px' }, kicker),
      el('div', { fontFamily: 'Literata, Literata Cyrillic', fontWeight: 600, fontSize: size, lineHeight: 1.12, letterSpacing: '-1px', maxWidth: '1000px' }, title),
    ]),
    el('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 24, color: MUTED }, [
      el('div', { display: 'flex' }, footer),
      el('div', { display: 'flex', gap: '10px' }, ['#f2b294', '#f5d77e', '#b9d3ea', '#fffdf8', '#c9dfb8'] /* --topic-heat, -words, -money, --surface, --topic-build */.map((background) =>
        el('div', { width: 30, height: 34, borderRadius: 4, backgroundColor: background }),
      )),
    ]),
   ]),
  ])
  const svg = await satori(tree as never, { width: 1200, height: 630, fonts: await loadFonts() })
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
}
