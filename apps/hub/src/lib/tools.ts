// Catalogue of every tool on the site, for the homepage grid and its tool search.
import type { Lang } from './site'

export type ToolCategory = 'words' | 'home'
export type ToolIcon = 'concrete' | 'paint' | 'tile' | 'gravel' | 'mulch' | 'area' | 'energy' | 'flooring' | 'drywall' | 'crossword' | 'adhesive' | 'wallpaper' | 'screed' | 'insulation' | 'masonry' | 'bee' | 'wordle' | 'finder'

export interface Tool {
  id: string
  category: ToolCategory
  icon?: ToolIcon
  href: Record<Lang, string>
  name: Record<Lang, string>
  description: Record<Lang, string>
  /** Extra words the homepage search matches, in both languages. */
  keywords: string
  isNew?: boolean
  comingSoon?: boolean
  /** Shown only on the homepage in this language. */
  only?: Lang
}

const calculator = (slug: string) => ({ en: `/calculators/${slug}/`, bg: `/calculators/${slug}/` })

export const TOOL_CATALOG: Tool[] = [
  {
    id: 'daily-word',
    category: 'words',
    icon: 'wordle',
    href: { en: '/letterwell/bg/duma-na-denya/', bg: '/letterwell/bg/duma-na-denya/' },
    name: { en: 'Word of the day (Bulgarian)', bg: 'Дума на деня' },
    description: {
      en: 'A daily Bulgarian five-letter word game.',
      bg: 'Познай думата от 5 букви с 6 опита. Нова всеки ден, за цяла България.',
    },
    keywords: 'daily word game дума на деня игра думи пет букви всеки ден',
    isNew: true,
    only: 'bg',
  },
  {
    id: 'wordle-solver',
    category: 'words',
    icon: 'wordle',
    href: { en: '/letterwell/wordle-solver/', bg: '/letterwell/bg/wordle/' },
    name: { en: 'Wordle helper', bg: 'Помощник за Wordle' },
    description: {
      en: 'Tap your colours, see every answer that still fits and the best next guess.',
      bg: 'Оцвети плочките и виж всички думи, които още пасват, и най-добрия следващ опит.',
    },
    keywords: 'wordle solver helper five letters уърдъл думи пет букви',
    isNew: true,
  },
  {
    id: 'spelling-bee',
    category: 'words',
    icon: 'bee',
    href: { en: '/letterwell/spelling-bee-solver/', bg: '/letterwell/bg/spelling-bee/' },
    name: { en: 'Spelling Bee helper', bg: 'Помощник за Spelling Bee' },
    description: { en: 'Seven letters: spoiler-free hints first, then every word and pangram.', bg: 'Седем букви: първо подсказки без спойлери, после думите и панграмите.' },
    keywords: 'spelling bee solver hints pangram nyt seven letters панграма седем букви',
    isNew: true,
  },
  {
    id: 'crossword-solver',
    category: 'words',
    icon: 'crossword',
    href: { en: '/letterwell/crossword-solver/', bg: '/letterwell/bg/krastoslovitsi/' },
    name: { en: 'Crossword helper', bg: 'Помощник за кръстословици' },
    description: {
      en: 'Type the letters you know and ? for the gaps: every word that fits, with dictionary links.',
      bg: 'Въведи известните букви и ? за празните: всички думи, които пасват, с линк към речник.',
    },
    keywords: 'crossword solver pattern missing letters clue кръстословица шаблон липсващи букви',
    isNew: true,
  },
  {
    id: 'word-finder',
    category: 'words',
    icon: 'finder',
    href: { en: '/letterwell/', bg: '/letterwell/bg/' },
    name: { en: 'Word finder', bg: 'Търсачка за думи' },
    description: {
      en: 'Every word you can make from your letters, with Scrabble, Words With Friends and Boggle scores.',
      bg: 'Всички думи от твоите букви, на български и английски, с точки за Scrabble и Boggle.',
    },
    keywords: 'letterwell anagram unscramble scrabble boggle letters words думи букви анаграма скрабъл',
  },
  {
    id: 'concrete',
    category: 'home',
    icon: 'concrete',
    href: { en: '/calculators/concrete-calculator/', bg: '/bg/kalkulator-beton/' },
    name: { en: 'Concrete', bg: 'Бетон' },
    description: { en: 'Slabs and footings in cubic yards, m³ and bags.', bg: 'Кубици за плоча, основа или колони, и цимент, пясък и чакъл.' },
    keywords: 'concrete slab footing cement бетон плоча основа цимент',
  },
  {
    id: 'paint',
    category: 'home',
    icon: 'paint',
    href: { en: '/calculators/paint-calculator/', bg: '/bg/kalkulator-boya/' },
    name: { en: 'Paint', bg: 'Боя' },
    description: { en: 'Walls, openings and coats to gallons or litres.', bg: 'Литри боя и грунд за стаята, и кои кофи да купиш.' },
    keywords: 'paint wall room gallons litres боя стена стая литри',
  },
  {
    id: 'tile',
    category: 'home',
    icon: 'tile',
    href: { en: '/calculators/tile-calculator/', bg: '/bg/kalkulator-plochki/' },
    name: { en: 'Tiles', bg: 'Плочки' },
    description: { en: 'Tiles and boxes for a floor or wall, with waste.', bg: 'Плочки и кашони за под или баня, с фугата и фирата.' },
    keywords: 'tile tiles floor wall grout плочки фаянс теракот под фуга',
  },
  {
    id: 'flooring',
    category: 'home',
    icon: 'flooring',
    href: { en: '/calculators/laminate-flooring-calculator/', bg: '/bg/kalkulator-laminat/' },
    name: { en: 'Laminate flooring', bg: 'Ламинат' },
    description: { en: 'Boxes of laminate or vinyl plank for a room, with waste.', bg: 'Кутии ламинат, первази, ъгли и прагове за стая.' },
    keywords: 'laminate flooring vinyl plank lvp floor boxes ламинат паркет винил под кутии',
    isNew: true,
  },
  {
    id: 'drywall',
    category: 'home',
    icon: 'drywall',
    href: { en: '/calculators/drywall-calculator/', bg: '/bg/kalkulator-gipsokarton/' },
    name: { en: 'Drywall', bg: 'Гипсокартон' },
    description: { en: 'Sheets for walls and ceilings, minus doors and windows.', bg: 'Листове за стени и таван, без вратите и прозорците.' },
    keywords: 'drywall plasterboard gypsum sheetrock sheets wall ceiling гипсокартон листове стена таван',
    isNew: true,
  },
  {
    id: 'masonry',
    category: 'home',
    icon: 'masonry',
    href: { en: '/calculators/brick-block-calculator/', bg: '/bg/kalkulator-tuhli/' },
    name: { en: 'Bricks & blocks', bg: 'Тухли и блокчета' },
    description: { en: 'Bricks or blocks for a wall, with mortar and mortar bags.', bg: 'Тухли или блокове за стена, с разтвора и торбите.' },
    keywords: 'bricks blocks CMU mortar wall masonry тухли блокчета газобетон Porotherm разтвор зидария',
    isNew: true,
  },
  {
    id: 'insulation',
    category: 'home',
    icon: 'insulation',
    href: { en: '/calculators/insulation-board-calculator/', bg: '/bg/kalkulator-izolatsiya/' },
    name: { en: 'Insulation boards', bg: 'Топлоизолация' },
    description: { en: 'Foam or mineral wool boards, adhesive, mesh and anchors for a wall.', bg: 'Плочи стиропор или вата, лепило, мрежа и дюбели за фасада.' },
    keywords: 'insulation EPS XPS mineral wool EIFS ETICS boards anchors топлоизолация стиропор вата фасада дюбели мрежа',
    isNew: true,
  },
  {
    id: 'screed',
    category: 'home',
    icon: 'screed',
    href: { en: '/calculators/screed-plaster-calculator/', bg: '/bg/zamazka-i-mazilka/' },
    name: { en: 'Screed & plaster', bg: 'Замазка и мазилка' },
    description: { en: 'Bags of screed, floor leveler or plaster from area and thickness.', bg: 'Торби замазка или мазилка по площ и дебелина.' },
    keywords: 'screed floor leveler self-leveling plaster bags замазка саморазливна мазилка гипсова торби',
    isNew: true,
  },
  {
    id: 'wallpaper',
    category: 'home',
    icon: 'wallpaper',
    href: { en: '/calculators/wallpaper-calculator/', bg: '/bg/kalkulator-tapeti/' },
    name: { en: 'Wallpaper', bg: 'Тапети' },
    description: { en: 'Rolls of wallpaper for a room, strip by strip, with pattern repeat.', bg: 'Ролки тапет за стая, по ивици и с раппорт на десена.' },
    keywords: 'wallpaper rolls pattern repeat strips тапет тапети ролки раппорт',
    isNew: true,
  },
  {
    id: 'adhesive',
    category: 'home',
    icon: 'adhesive',
    href: { en: '/calculators/tile-adhesive-grout-calculator/', bg: '/bg/lepilo-i-fuga/' },
    name: { en: 'Tile adhesive & grout', bg: 'Лепило и фуга' },
    description: { en: 'Bags of thinset and grout from tile size, joint and trowel.', bg: 'Торби лепило и фуга по плочка, фуга и маламашка.' },
    keywords: 'tile adhesive thinset mortar grout trowel лепило плочки фуга фугираща смес маламашка',
    isNew: true,
  },
  {
    id: 'gravel',
    category: 'home',
    icon: 'gravel',
    href: { en: '/calculators/gravel-calculator/', bg: '/bg/kalkulator-chakal/' },
    name: { en: 'Gravel', bg: 'Чакъл' },
    description: { en: 'Volume and weight for drives, paths and beds.', bg: 'Обем и тегло за алеи, пътеки и лехи.' },
    keywords: 'gravel driveway path stone чакъл алея камък',
  },
  {
    id: 'mulch',
    category: 'home',
    icon: 'mulch',
    href: calculator('mulch-calculator'),
    name: { en: 'Mulch', bg: 'Мулч' },
    description: { en: 'Beds, borders and tree rings to bags or yards.', bg: 'Лехи, бордюри и кръгове около дървета.' },
    keywords: 'mulch garden bed мулч градина леха',
  },
  {
    id: 'area',
    category: 'home',
    icon: 'area',
    href: calculator('square-footage-calculator'),
    name: { en: 'Square footage', bg: 'Площ' },
    description: { en: 'Add up rooms and odd shapes in ft² or m².', bg: 'Събери площта на стаи и сложни форми в м².' },
    keywords: 'square footage area room floor площ квадратура стая',
  },
  {
    id: 'energy',
    category: 'home',
    icon: 'energy',
    href: { en: '/energy-cost-calculator/', bg: '/bg/razhod-na-tok/' },
    name: { en: 'Appliance energy cost', bg: 'Разход на ток' },
    description: { en: 'What a heater, air conditioner or water heater costs to run.', bg: 'Колко струва печката, климатикът или бойлерът на месец.' },
    keywords: 'electricity energy kwh heater boiler air conditioner cost ток електричество печка духалка бойлер климатик сметка',
    isNew: true,
  },
]

/** Inline stroke icons (24×24) for the calculator tiles. */
export const TOOL_ICONS: Record<ToolIcon, string> = {
  concrete: '<path d="M12 3 3 7.5v9L12 21l9-4.5v-9z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>',
  paint: '<rect x="3" y="3" width="15" height="6" rx="1.5"/><path d="M18 6h3v5h-9v3"/><rect x="10" y="14" width="4" height="7" rx="1"/>',
  tile: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 12h18M12 3v18"/>',
  gravel: '<circle cx="7" cy="15" r="3"/><circle cx="15.5" cy="16" r="2.5"/><circle cx="11" cy="8.5" r="2.5"/><circle cx="18" cy="9" r="2"/>',
  mulch: '<path d="M5 20c0-9 6-15 15-15 0 9-6 15-15 15z"/><path d="M5 20 13 12"/>',
  area: '<path d="M3 17 17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
  energy: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  flooring: '<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 9.3h18M3 14.6h18M10 4v5.3M16 9.3v5.3M8 14.6V20"/>',
  bee: '<path d="M12 3l4 2.3v4.6L12 12l-4-2.1V5.3z"/><path d="M8 12l4 2.1V19l-4 2.3-4-2.3v-4.6z"/><path d="M16 12l4 2.1V19l-4 2.3-4-2.3v-4.6z"/>',
  masonry: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 9.7h18M3 14.3h18M9 5v4.7M15 9.7v4.6M9 14.3V19"/>',
  insulation: '<path d="M4 4h6v16H4z"/><path d="M10 7h10M10 12h10M10 17h10"/><path d="M14 4v16"/>',
  screed: '<path d="M3 17h18v3H3z"/><path d="M5 17l3-5h8l3 5"/><path d="M10 12V5h6"/><path d="M14 3l2 2-2 2"/>',
  wallpaper: '<path d="M5 3h10v18H5z"/><path d="M15 5h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-3"/><path d="M8 7l2 2-2 2M12 13l-2 2 2 2"/>',
  wordle: '<rect x="2.5" y="8" width="5.5" height="8" rx="1"/><rect x="9.25" y="8" width="5.5" height="8" rx="1"/><rect x="16" y="8" width="5.5" height="8" rx="1"/>',
  finder: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/><path d="M8 13l2.5-6 2.5 6M8.9 11h3.2"/>',
  adhesive: '<path d="M4 20h10l6-6V4H4z"/><path d="M4 14h4v6M10 14h4v6M16 14h4"/><path d="M8 4v4M12 4v4M16 4v4"/>',
  crossword: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/><path d="M10.5 10.5h3v3h-3z"/>',
  drywall: '<rect x="3" y="3" width="8" height="18" rx="1"/><rect x="13" y="3" width="8" height="18" rx="1"/><path d="M5.5 6v.01M5.5 12v.01M5.5 18v.01M15.5 6v.01M15.5 12v.01M15.5 18v.01"/>',
}

/** Blog category of a post, from the tool it links to. */
export function postCategory(tool?: string): ToolCategory | 'general' {
  if (!tool) return 'general'
  return tool === 'letterwell' || tool === 'wordle-solver' || tool === 'crossword-solver' || tool === 'spelling-bee' ? 'words' : 'home'
}

/** Sub-groups of "Home & DIY" on the homepage, in display order. */
export const HOME_GROUPS: { id: string; name: Record<Lang, string>; tools: string[] }[] = [
  { id: 'floors', name: { en: 'Floors and tiles', bg: 'Под и плочки' }, tools: ['tile', 'adhesive', 'flooring', 'screed'] },
  { id: 'walls', name: { en: 'Walls and finishes', bg: 'Стени и довършване' }, tools: ['paint', 'wallpaper', 'drywall', 'insulation', 'masonry'] },
  { id: 'outdoor', name: { en: 'Concrete and garden', bg: 'Бетон и двор' }, tools: ['concrete', 'gravel', 'mulch', 'area'] },
  { id: 'energy', name: { en: 'Energy', bg: 'Енергия' }, tools: ['energy'] },
]

/** Tools that go together, for the "Related tools" block on tool pages and articles. */
export const RELATED_TOOLS: Record<string, string[]> = {
  'wordle-solver': ['word-finder', 'spelling-bee', 'crossword-solver'],
  'word-finder': ['wordle-solver', 'crossword-solver', 'spelling-bee'],
  'crossword-solver': ['word-finder', 'spelling-bee', 'wordle-solver'],
  'spelling-bee': ['word-finder', 'wordle-solver', 'crossword-solver'],
  tile: ['adhesive', 'screed', 'area'],
  adhesive: ['tile', 'screed', 'flooring'],
  flooring: ['screed', 'tile', 'area'],
  screed: ['flooring', 'tile', 'concrete'],
  paint: ['wallpaper', 'drywall', 'area'],
  wallpaper: ['paint', 'drywall', 'area'],
  drywall: ['paint', 'insulation', 'masonry'],
  insulation: ['masonry', 'drywall', 'paint'],
  masonry: ['insulation', 'concrete', 'drywall'],
  concrete: ['gravel', 'masonry', 'screed'],
  gravel: ['concrete', 'mulch', 'area'],
  mulch: ['gravel', 'area', 'concrete'],
  area: ['flooring', 'paint', 'tile'],
  energy: ['insulation', 'paint', 'area'],
}

/** Catalogue id of the tool a blog post links to (the post's `tool` field). */
export const POST_TOOL_IDS: Record<string, string> = {
  letterwell: 'word-finder',
  'wordle-solver': 'wordle-solver',
  'crossword-solver': 'crossword-solver',
  'spelling-bee': 'spelling-bee',
  'energy-cost-calculator': 'energy',
  'concrete-calculator': 'concrete',
  'tile-calculator': 'tile',
  'paint-calculator': 'paint',
  'gravel-calculator': 'gravel',
  'mulch-calculator': 'mulch',
  'square-footage-calculator': 'area',
  'laminate-flooring-calculator': 'flooring',
  'drywall-calculator': 'drywall',
  'tile-adhesive-grout-calculator': 'adhesive',
  'wallpaper-calculator': 'wallpaper',
  'screed-plaster-calculator': 'screed',
  'insulation-board-calculator': 'insulation',
  'brick-block-calculator': 'masonry',
}

export const toolById = (id: string) => TOOL_CATALOG.find((tool) => tool.id === id)

/** Related tools for a catalogue id, skipping any that are missing. */
export const relatedTools = (id: string | undefined) =>
  (id ? RELATED_TOOLS[id] ?? [] : []).map(toolById).filter((tool): tool is Tool => Boolean(tool))
