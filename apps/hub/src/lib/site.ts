// Site-wide constants and helpers for the hub (homepage, blog, information pages).
import { getCollection, type CollectionEntry } from 'astro:content'

export const SITE = 'https://zyankov.eu'
export type Lang = 'en' | 'bg'
export type Post = CollectionEntry<'blog'>

export const absolute = (path: string) => new URL(path, SITE).href

/** Key of a page's sharing image: "/" → "home", "/bg/blog/x/" → "bg-blog-x". */
export const ogKey = (path: string) => path.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'home'

/** Blog post slug: the file name inside src/content/blog/<lang>/. */
export const postSlug = (post: Post) => post.id.split('/').pop() as string

/** Public URL path of a post. */
export const postPath = (post: Post) =>
  post.data.lang === 'bg' ? `/bg/blog/${postSlug(post)}/` : `/blog/${postSlug(post)}/`

/** Published posts in a language, newest first. Drafts are shown only in `astro dev`. */
export async function getPosts(lang: Lang): Promise<Post[]> {
  const posts = await getCollection('blog', (post) => post.data.lang === lang && (import.meta.env.DEV || !post.data.draft))
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

/** The same post in the other language, when it exists. */
export async function getTranslation(post: Post): Promise<Post | undefined> {
  if (!post.data.translation) return undefined
  const all = await getCollection('blog', (entry) => !entry.data.draft || import.meta.env.DEV)
  return all.find((entry) => entry.id === post.data.translation)
}

export function formatDate(date: Date, lang: Lang) {
  return date.toLocaleDateString(lang === 'bg' ? 'bg-BG' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

export const isoDate = (date: Date) => date.toISOString().slice(0, 10)

/** Approximate reading time in minutes (about 220 words a minute). */
export function readingMinutes(body = '') {
  const words = body.replace(/[#>*_`[\]()-]/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

export const TOOLS = {
  letterwell: { en: { href: '/letterwell/', name: 'Letterwell', cta: 'Find words with Letterwell' }, bg: { href: '/letterwell/bg/', name: 'Letterwell', cta: 'Търси думи с Letterwell' } },
  'wordle-solver': { en: { href: '/letterwell/wordle-solver/', name: 'Wordle helper', cta: 'Open the Wordle helper' }, bg: { href: '/letterwell/bg/wordle/', name: 'Помощник за Wordle', cta: 'Към помощника за Wordle' } },
  'crossword-solver': { en: { href: '/letterwell/crossword-solver/', name: 'Crossword helper', cta: 'Open the crossword helper' }, bg: { href: '/letterwell/bg/krastoslovitsi/', name: 'Помощник за кръстословици', cta: 'Към помощника за кръстословици' } },
  'energy-cost-calculator': { en: { href: '/energy-cost-calculator/', name: 'Energy cost calculator', cta: 'Open the energy cost calculator' }, bg: { href: '/bg/razhod-na-tok/', name: 'Калкулатор за разход на ток', cta: 'Към калкулатора за ток' } },
  'concrete-calculator': { en: { href: '/calculators/concrete-calculator/', name: 'Concrete calculator', cta: 'Open the concrete calculator' }, bg: { href: '/calculators/concrete-calculator/', name: 'Калкулатор за бетон', cta: 'Към калкулатора за бетон' } },
  'tile-calculator': { en: { href: '/calculators/tile-calculator/', name: 'Tile calculator', cta: 'Open the tile calculator' }, bg: { href: '/calculators/tile-calculator/', name: 'Калкулатор за плочки', cta: 'Към калкулатора за плочки' } },
  'paint-calculator': { en: { href: '/calculators/paint-calculator/', name: 'Paint calculator', cta: 'Open the paint calculator' }, bg: { href: '/calculators/paint-calculator/', name: 'Калкулатор за боя', cta: 'Към калкулатора за боя' } },
  'mulch-calculator': { en: { href: '/calculators/mulch-calculator/', name: 'Mulch calculator', cta: 'Open the mulch calculator' }, bg: { href: '/calculators/mulch-calculator/', name: 'Калкулатор за мулч', cta: 'Към калкулатора за мулч' } },
  'square-footage-calculator': { en: { href: '/calculators/square-footage-calculator/', name: 'Square footage calculator', cta: 'Open the square footage calculator' }, bg: { href: '/calculators/square-footage-calculator/', name: 'Калкулатор за площ', cta: 'Към калкулатора за площ' } },
  'laminate-flooring-calculator': { en: { href: '/calculators/laminate-flooring-calculator/', name: 'Laminate flooring calculator', cta: 'Open the flooring calculator' }, bg: { href: '/bg/kalkulator-laminat/', name: 'Калкулатор за ламинат', cta: 'Към калкулатора за ламинат' } },
  'drywall-calculator': { en: { href: '/calculators/drywall-calculator/', name: 'Drywall calculator', cta: 'Open the drywall calculator' }, bg: { href: '/bg/kalkulator-gipsokarton/', name: 'Калкулатор за гипсокартон', cta: 'Към калкулатора за гипсокартон' } },
  'tile-adhesive-grout-calculator': { en: { href: '/calculators/tile-adhesive-grout-calculator/', name: 'Tile adhesive & grout calculator', cta: 'Open the adhesive and grout calculator' }, bg: { href: '/bg/lepilo-i-fuga/', name: 'Калкулатор за лепило и фуга', cta: 'Към калкулатора за лепило и фуга' } },
  'gravel-calculator': { en: { href: '/calculators/gravel-calculator/', name: 'Gravel calculator', cta: 'Open the gravel calculator' }, bg: { href: '/calculators/gravel-calculator/', name: 'Калкулатор за чакъл', cta: 'Към калкулатора за чакъл' } },
} as const

export type ToolKey = keyof typeof TOOLS
