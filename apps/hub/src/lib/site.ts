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

const BG_MONTHS = ['януари', 'февруари', 'март', 'април', 'май', 'юни', 'юли', 'август', 'септември', 'октомври', 'ноември', 'декември']

/** "7 ноември 2026" -> "2026-11-07". Fails the build on anything else, so a typo cannot ship a wrong date. */
export function isoFromBgDate(text: string): string {
  const match = text.trim().match(/^(\d{1,2}) (\S+) (\d{4})$/)
  const month = match ? BG_MONTHS.indexOf(match[2]) : -1
  if (!match || month < 0) throw new Error(`Not a Bulgarian date like "7 ноември 2026": "${text}"`)
  return `${match[3]}-${String(month + 1).padStart(2, '0')}-${match[1].padStart(2, '0')}`
}

/** The person behind the site, for structured data (author and publisher). */
export const AUTHOR = { '@type': 'Person', name: 'Zlatko Yankov', url: 'https://zyankov.eu/about/' } as const

/** Approximate reading time in minutes (about 220 words a minute). */
export function readingMinutes(body = '') {
  const words = body.replace(/[#>*_`[\]()-]/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

export const TOOLS = {
  letterwell: { en: { href: '/letterwell/', name: 'Letterwell', cta: 'Find words with Letterwell' }, bg: { href: '/letterwell/bg/', name: 'Letterwell', cta: 'Търси думи с Letterwell' } },
  'wordle-solver': { en: { href: '/letterwell/wordle-solver/', name: 'Wordle helper', cta: 'Open the Wordle helper' }, bg: { href: '/letterwell/bg/wordle/', name: 'Помощник за Wordle', cta: 'Към помощника за Wordle' } },
  'spelling-bee': { en: { href: '/letterwell/spelling-bee-solver/', name: 'Spelling Bee helper', cta: 'Open the Spelling Bee helper' }, bg: { href: '/letterwell/bg/spelling-bee/', name: 'Помощник за Spelling Bee', cta: 'Към помощника за Spelling Bee' } },
  'crossword-solver': { en: { href: '/letterwell/crossword-solver/', name: 'Crossword helper', cta: 'Open the crossword helper' }, bg: { href: '/letterwell/bg/krastoslovitsi/', name: 'Помощник за кръстословици', cta: 'Към помощника за кръстословици' } },
  'energy-cost-calculator': { en: { href: '/energy-cost-calculator/', name: 'Energy cost calculator', cta: 'Open the energy cost calculator' }, bg: { href: '/bg/razhod-na-tok/', name: 'Калкулатор за разход на ток', cta: 'Към калкулатора за ток' } },
  'heating-cost-calculator': { en: { href: '/bg/razhod-za-otoplenie/', name: 'Heating cost calculator', cta: 'Open the heating cost calculator' }, bg: { href: '/bg/razhod-za-otoplenie/', name: 'Калкулатор за разход за отопление', cta: 'Към калкулатора за отопление' } },
  'firewood-calculator': { en: { href: '/bg/kalkulator-darva/', name: 'Firewood calculator', cta: 'Open the firewood calculator' }, bg: { href: '/bg/kalkulator-darva/', name: 'Калкулатор за дърва и пелети', cta: 'Към калкулатора за дърва' } },
  'aircon-calculator': { en: { href: '/bg/kalkulator-klimatik/', name: 'Air conditioner size calculator', cta: 'Open the air conditioner calculator' }, bg: { href: '/bg/kalkulator-klimatik/', name: 'Калкулатор за климатик', cta: 'Към калкулатора за климатик' } },
  'concrete-calculator': { en: { href: '/calculators/concrete-calculator/', name: 'Concrete calculator', cta: 'Open the concrete calculator' }, bg: { href: '/bg/kalkulator-beton/', name: 'Калкулатор за бетон', cta: 'Към калкулатора за бетон' } },
  'tile-calculator': { en: { href: '/calculators/tile-calculator/', name: 'Tile calculator', cta: 'Open the tile calculator' }, bg: { href: '/bg/kalkulator-plochki/', name: 'Калкулатор за плочки', cta: 'Към калкулатора за плочки' } },
  'paint-calculator': { en: { href: '/calculators/paint-calculator/', name: 'Paint calculator', cta: 'Open the paint calculator' }, bg: { href: '/bg/kalkulator-boya/', name: 'Калкулатор за боя', cta: 'Към калкулатора за боя' } },
  'mulch-calculator': { en: { href: '/calculators/mulch-calculator/', name: 'Mulch calculator', cta: 'Open the mulch calculator' }, bg: { href: '/calculators/mulch-calculator/', name: 'Калкулатор за мулч', cta: 'Към калкулатора за мулч' } },
  'square-footage-calculator': { en: { href: '/calculators/square-footage-calculator/', name: 'Square footage calculator', cta: 'Open the square footage calculator' }, bg: { href: '/calculators/square-footage-calculator/', name: 'Калкулатор за площ', cta: 'Към калкулатора за площ' } },
  'laminate-flooring-calculator': { en: { href: '/calculators/laminate-flooring-calculator/', name: 'Laminate flooring calculator', cta: 'Open the flooring calculator' }, bg: { href: '/bg/kalkulator-laminat/', name: 'Калкулатор за ламинат', cta: 'Към калкулатора за ламинат' } },
  'drywall-calculator': { en: { href: '/calculators/drywall-calculator/', name: 'Drywall calculator', cta: 'Open the drywall calculator' }, bg: { href: '/bg/kalkulator-gipsokarton/', name: 'Калкулатор за гипсокартон', cta: 'Към калкулатора за гипсокартон' } },
  'brick-block-calculator': { en: { href: '/calculators/brick-block-calculator/', name: 'Brick and block calculator', cta: 'Open the brick and block calculator' }, bg: { href: '/bg/kalkulator-tuhli/', name: 'Калкулатор за тухли', cta: 'Към калкулатора за тухли' } },
  'insulation-board-calculator': { en: { href: '/calculators/insulation-board-calculator/', name: 'Insulation board calculator', cta: 'Open the insulation calculator' }, bg: { href: '/bg/kalkulator-izolatsiya/', name: 'Калкулатор за топлоизолация', cta: 'Към калкулатора за топлоизолация' } },
  'screed-plaster-calculator': { en: { href: '/calculators/screed-plaster-calculator/', name: 'Screed & plaster calculator', cta: 'Open the screed and plaster calculator' }, bg: { href: '/bg/zamazka-i-mazilka/', name: 'Калкулатор за замазка и мазилка', cta: 'Към калкулатора за замазка и мазилка' } },
  'wallpaper-calculator': { en: { href: '/calculators/wallpaper-calculator/', name: 'Wallpaper calculator', cta: 'Open the wallpaper calculator' }, bg: { href: '/bg/kalkulator-tapeti/', name: 'Калкулатор за тапети', cta: 'Към калкулатора за тапети' } },
  'tile-adhesive-grout-calculator': { en: { href: '/calculators/tile-adhesive-grout-calculator/', name: 'Tile adhesive & grout calculator', cta: 'Open the adhesive and grout calculator' }, bg: { href: '/bg/lepilo-i-fuga/', name: 'Калкулатор за лепило и фуга', cta: 'Към калкулатора за лепило и фуга' } },
  'gravel-calculator': { en: { href: '/calculators/gravel-calculator/', name: 'Gravel calculator', cta: 'Open the gravel calculator' }, bg: { href: '/bg/kalkulator-chakal/', name: 'Калкулатор за чакъл', cta: 'Към калкулатора за чакъл' } },
  'percent-calculator': { en: { href: '/percentage-calculator/', name: 'Percentage calculator', cta: 'Open the percentage calculator' }, bg: { href: '/bg/kalkulator-protsenti/', name: 'Калкулатор за проценти', cta: 'Към калкулатора за проценти' } },
  'vat-calculator': { en: { href: '/bg/kalkulator-dds/', name: 'VAT calculator', cta: 'Open the VAT calculator' }, bg: { href: '/bg/kalkulator-dds/', name: 'Калкулатор за ДДС', cta: 'Към калкулатора за ДДС' } },
  'euro-converter': { en: { href: '/bg/leva-v-evro/', name: 'Leva to euro converter', cta: 'Open the leva to euro converter' }, bg: { href: '/bg/leva-v-evro/', name: 'Лева в евро', cta: 'Към превалутирането лева – евро' } },
  'salary-calculator': { en: { href: '/bg/kalkulator-zaplata/', name: 'Salary calculator', cta: 'Open the salary calculator' }, bg: { href: '/bg/kalkulator-zaplata/', name: 'Калкулатор за заплата', cta: 'Към калкулатора за заплата' } },
  'compound-interest-calculator': { en: { href: '/compound-interest-calculator/', name: 'Compound interest calculator', cta: 'Open the compound interest calculator' }, bg: { href: '/compound-interest-calculator/', name: 'Калкулатор за сложна лихва', cta: 'Към калкулатора' } },
  'us-holidays-2027': { en: { href: '/us-federal-holidays-2027/', name: 'US federal holidays 2027', cta: 'See the 2027 holidays' }, bg: { href: '/us-federal-holidays-2027/', name: 'Празници в САЩ 2027', cta: 'Към празниците' } },
  'holidays-2027': { en: { href: '/bg/pochivni-dni-2027/', name: 'Bulgarian days off 2027', cta: 'See the days off in 2027' }, bg: { href: '/bg/pochivni-dni-2027/', name: 'Почивни дни 2027', cta: 'Към почивните дни 2027' } },
  'loan-calculator': { en: { href: '/loan-calculator/', name: 'Loan calculator', cta: 'Open the loan calculator' }, bg: { href: '/bg/kalkulator-kredit/', name: 'Кредитен калкулатор', cta: 'Към кредитния калкулатор' } },
  'date-calculator': { en: { href: '/date-calculator/', name: 'Date calculator', cta: 'Open the date calculator' }, bg: { href: '/bg/kalkulator-dati/', name: 'Калкулатор за дати', cta: 'Към калкулатора за дати' } },
} as const

export type ToolKey = keyof typeof TOOLS
