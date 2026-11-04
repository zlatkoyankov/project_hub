// Catalogue of every tool on the site, for the homepage grid and its tool search.
import type { Lang } from './site'

export type ToolCategory = 'words' | 'home'
export type ToolIcon = 'concrete' | 'paint' | 'tile' | 'gravel' | 'mulch' | 'area' | 'energy' | 'flooring' | 'drywall'

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
}

const calculator = (slug: string) => ({ en: `/calculators/${slug}/`, bg: `/calculators/${slug}/` })

export const TOOL_CATALOG: Tool[] = [
  {
    id: 'wordle-solver',
    category: 'words',
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
    id: 'word-finder',
    category: 'words',
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
    href: calculator('concrete-calculator'),
    name: { en: 'Concrete', bg: 'Бетон' },
    description: { en: 'Slabs and footings in cubic yards, m³ and bags.', bg: 'Плочи и основи в кубици и торби.' },
    keywords: 'concrete slab footing cement бетон плоча основа цимент',
  },
  {
    id: 'paint',
    category: 'home',
    icon: 'paint',
    href: calculator('paint-calculator'),
    name: { en: 'Paint', bg: 'Боя' },
    description: { en: 'Walls, openings and coats to gallons or litres.', bg: 'Стени, отвори и слоеве в литри боя.' },
    keywords: 'paint wall room gallons litres боя стена стая литри',
  },
  {
    id: 'tile',
    category: 'home',
    icon: 'tile',
    href: calculator('tile-calculator'),
    name: { en: 'Tiles', bg: 'Плочки' },
    description: { en: 'Tiles and boxes for a floor or wall, with waste.', bg: 'Плочки и кутии за под или стена, с фира.' },
    keywords: 'tile tiles floor wall grout плочки фаянс теракот под фуга',
  },
  {
    id: 'flooring',
    category: 'home',
    icon: 'flooring',
    href: calculator('laminate-flooring-calculator'),
    name: { en: 'Laminate flooring', bg: 'Ламинат' },
    description: { en: 'Boxes of laminate or vinyl plank for a room, with waste.', bg: 'Кутии ламинат или винил за стая, с фира.' },
    keywords: 'laminate flooring vinyl plank lvp floor boxes ламинат паркет винил под кутии',
    isNew: true,
  },
  {
    id: 'drywall',
    category: 'home',
    icon: 'drywall',
    href: calculator('drywall-calculator'),
    name: { en: 'Drywall', bg: 'Гипсокартон' },
    description: { en: 'Sheets for walls and ceilings, minus doors and windows.', bg: 'Листове за стени и таван, без вратите и прозорците.' },
    keywords: 'drywall plasterboard gypsum sheetrock sheets wall ceiling гипсокартон листове стена таван',
    isNew: true,
  },
  {
    id: 'gravel',
    category: 'home',
    icon: 'gravel',
    href: calculator('gravel-calculator'),
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
  drywall: '<rect x="3" y="3" width="8" height="18" rx="1"/><rect x="13" y="3" width="8" height="18" rx="1"/><path d="M5.5 6v.01M5.5 12v.01M5.5 18v.01M15.5 6v.01M15.5 12v.01M15.5 18v.01"/>',
}

/** Blog category of a post, from the tool it links to. */
export function postCategory(tool?: string): ToolCategory | 'general' {
  if (!tool) return 'general'
  return tool === 'letterwell' || tool === 'wordle-solver' ? 'words' : 'home'
}
