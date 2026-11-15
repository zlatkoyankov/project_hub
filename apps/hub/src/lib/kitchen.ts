// Kitchen measures for the Bulgarian page /bg/kuhnenski-merki/: cups, spoons, millilitres and grams.
// Every figure below has its source next to it. Sources opened and checked 15 November 2026.
//
// How it works: a measure of volume is converted to millilitres, and millilitres become grams with the
// ingredient's density in g/ml (grams = ml × density). Densities come from published "grams per cup or
// tablespoon" figures: grams ÷ the volume of that US cup or tablespoon in ml.

export const KITCHEN_CHECKED = '15 ноември 2026'

/** US cup = 8 US fluid ounces exactly = 1/16 of a US gallon; the gallon is 231 cubic inches = 3785.411784 ml.
 *  Source: NIST Handbook 44 (2026), Appendix C (cup 8 fl oz exactly, "237 mL" rounded; gallon 3 785.411 784 mL). */
export const US_CUP_ML = 3785.411784 / 16 // 236.5882365

/** US tablespoon = 1/2 US fluid ounce exactly = 1/16 cup; teaspoon = 1/3 tablespoon.
 *  Source: NIST Handbook 44 (2026), Appendix C. */
export const US_TBSP_ML = US_CUP_ML / 16 // 14.7867648

export type KitchenUnit = 'g' | 'ml' | 'tea-cup' | 'water-cup' | 'tbsp' | 'tsp' | 'us-cup'

export interface UnitInfo {
  label: string
  /** Name next to a number: one and many (1 чаена чаша, 2 чаени чаши). */
  one: string
  many: string
  /** Millilitres in one unit; missing for grams. */
  ml?: number
}

/** The Bulgarian household measures we use, with their volume in ml.
 *  чаена чаша 200 ml, водна чаша 250 ml, супена лъжица 15 ml, чаена лъжичка 5 ml: as given by presmetka.bg
 *  (all four), forlife.bg and vkusnirecepti.com (чаена чаша 200, лъжица 15, лъжичка 5); gotvach.bg gives
 *  190–200 ml for a чаена чаша. The 15 ml and 5 ml spoons are also the metric measuring spoons in NIST's
 *  "Metric Kitchen" table. Real cups and glasses differ from these round values: it is a convention. */
export const KITCHEN_UNITS: Record<KitchenUnit, UnitInfo> = {
  g: { label: 'грама', one: 'г', many: 'г' },
  ml: { label: 'милилитра', one: 'мл', many: 'мл', ml: 1 },
  'tea-cup': { label: 'чаена чаша (200 мл)', one: 'чаена чаша', many: 'чаени чаши', ml: 200 },
  'water-cup': { label: 'водна чаша (250 мл)', one: 'водна чаша', many: 'водни чаши', ml: 250 },
  tbsp: { label: 'супена лъжица (15 мл)', one: 'супена лъжица', many: 'супени лъжици', ml: 15 },
  tsp: { label: 'чаена лъжичка (5 мл)', one: 'чаена лъжичка', many: 'чаени лъжички', ml: 5 },
  'us-cup': { label: 'US чаша (236,6 мл)', one: 'US чаша', many: 'US чаши', ml: US_CUP_ML },
}

export const UNIT_ORDER: KitchenUnit[] = ['g', 'ml', 'tea-cup', 'water-cup', 'tbsp', 'tsp', 'us-cup']

export interface Source {
  id: string
  label: string
  /** Short name for the table. */
  short: string
  href: string
}

export const KITCHEN_SOURCES: Record<string, Source> = {
  ka: {
    id: 'ka',
    short: 'King Arthur Baking',
    label: 'King Arthur Baking: Ingredient Weight Chart',
    href: 'https://www.kingarthurbaking.com/learn/ingredient-weight-chart',
  },
  water: {
    id: 'water',
    short: 'MilliporeSigma',
    label: 'MilliporeSigma (Merck): Pure Water Density Standard, 0,9982 g/ml при 20 °C',
    href: 'https://www.merckmillipore.com/BG/en/product/sial/denwat',
  },
  milk: {
    id: 'milk',
    short: 'Parmar и др. 2021',
    label: 'Parmar и др., Irish Journal of Agricultural and Food Research 59 (2021): плътност на суровото пълномаслено мляко 1,030–1,031 g/cm³',
    href: 'https://doaj.org/article/7301e814575845478858057a3f926e1c',
  },
  oil: {
    id: 'oil',
    short: 'FAO / Codex',
    label: 'FAO / Codex Alimentarius: стандарт за растителни масла, Table 2, относителна плътност на слънчогледовото олио при 20 °C 0,918–0,923',
    href: 'https://www.fao.org/3/y2774e/y2774e04.htm',
  },
}

export interface Ingredient {
  id: string
  label: string
  /** Density in g/ml. */
  density: number
  /** The published figure the density comes from, as shown in the table. */
  basis: string
  source: Source['id']
  /** Caveat shown under the table. */
  note?: string
}

/** Density from a "grams per US cup/tablespoon" figure. */
const perUs = (grams: number, usMl: number) => grams / usMl
const perCup = (grams: number, cups = 1) => perUs(grams, US_CUP_ML * cups)
const perTbsp = (grams: number, tbsp = 1) => perUs(grams, US_TBSP_ML * tbsp)

/** Water: 0.9982 g/ml at 20 °C (MilliporeSigma). */
export const WATER_G_PER_ML = 0.9982
/** Raw whole cow's milk: 1.0303–1.0313 g/cm³ in the study; we use 1.03 (our own rounding). */
export const MILK_G_PER_ML = 1.03
/** Sunflower oil: Codex relative density 0.918–0.923 at 20 °C (to water at 20 °C). We take the middle of
 *  the range (our own middle value, 0.9205) and multiply by the density of water at 20 °C. */
export const SUNFLOWER_OIL_G_PER_ML = ((0.918 + 0.923) / 2) * WATER_G_PER_ML

export const INGREDIENTS: Ingredient[] = [
  { id: 'flour', label: 'Брашно пшенично', density: perCup(120), basis: '120 г на 1 US чаша (All-Purpose Flour)', source: 'ka', note: 'Данните са за американско all-purpose брашно. Българското брашно тип 500 е близко, но не е същото, а теглото зависи и от начина на загребване: пресято, натъпкано или изсипано.' },
  { id: 'sugar', label: 'Захар кристална', density: perCup(198), basis: '198 г на 1 US чаша (granulated white sugar)', source: 'ka' },
  { id: 'powdered-sugar', label: 'Пудра захар', density: perCup(113), basis: '113 г на 1 US чаша (confectioners\' sugar, unsifted)', source: 'ka' },
  { id: 'brown-sugar', label: 'Кафява захар (натъпкана)', density: perCup(213), basis: '213 г на 1 US чаша (brown sugar, packed)', source: 'ka' },
  { id: 'rice', label: 'Ориз (дълго зърно, суров)', density: perCup(99, 0.5), basis: '99 г на ½ US чаша (rice, long grain, dry)', source: 'ka' },
  { id: 'milk', label: 'Прясно мляко', density: MILK_G_PER_ML, basis: '1,03 г/мл (наше закръгляване на 1,0303–1,0313)', source: 'milk', note: 'Плътността е измерена за сурово пълномаслено мляко; пастьоризираното и с по-малко мазнина е много близко до нея.' },
  { id: 'water', label: 'Вода', density: WATER_G_PER_ML, basis: '0,9982 г/мл при 20 °C', source: 'water' },
  { id: 'oil', label: 'Олио (слънчогледово)', density: SUNFLOWER_OIL_G_PER_ML, basis: 'относителна плътност 0,918–0,923; взехме средата 0,9205 (наша средна стойност)', source: 'oil' },
  { id: 'butter', label: 'Масло (твърдо)', density: perCup(113, 0.5), basis: '113 г на 8 US супени лъжици = ½ US чаша (butter)', source: 'ka', note: 'Теглото е за студено, твърдо масло, натъпкано в мярка. Разтопеното е по-плътно, затова за него претегляй.' },
  { id: 'honey', label: 'Мед', density: perTbsp(21), basis: '21 г на 1 US супена лъжица (honey)', source: 'ka' },
  { id: 'salt', label: 'Сол (трапезна, ситна)', density: perTbsp(18), basis: '18 г на 1 US супена лъжица (table salt)', source: 'ka', note: 'Едрата морска сол тежи по-малко от ситната в същата лъжица, а различните марки сол се различават. Данните са за ситна трапезна сол.' },
  { id: 'cocoa', label: 'Какао на прах', density: perCup(42, 0.5), basis: '42 г на ½ US чаша (cocoa, unsweetened)', source: 'ka' },
  { id: 'cornstarch', label: 'Нишесте царевично', density: perCup(28, 0.25), basis: '28 г на ¼ US чаша (cornstarch)', source: 'ka' },
  { id: 'potato-starch', label: 'Нишесте картофено', density: perCup(152), basis: '152 г на 1 US чаша (potato starch)', source: 'ka' },
  { id: 'oats', label: 'Овесени ядки (обикновени или бързо готвещи)', density: perCup(89), basis: '89 г на 1 US чаша (oats, old-fashioned or quick-cooking)', source: 'ka' },
]

export const ingredientById = (id: string) => INGREDIENTS.find((ingredient) => ingredient.id === id)

export interface KitchenInput {
  amount: number
  from: KitchenUnit
  to: KitchenUnit
  ingredient: string
}

export interface KitchenResult {
  /** Converted value, not rounded. */
  value: number
  /** Volume of the amount in ml and its weight in g, not rounded. */
  ml: number
  grams: number
  density: number
  /** The same amount in every unit, not rounded. */
  all: Record<KitchenUnit, number>
}

/** grams = ml × density; ml = amount × the unit's ml (or grams ÷ density when the amount is in grams). */
export function convertKitchen(input: KitchenInput): KitchenResult | null {
  const ingredient = ingredientById(input.ingredient)
  const { amount, from, to } = input
  if (!ingredient || !(amount > 0) || !Number.isFinite(amount) || !KITCHEN_UNITS[from] || !KITCHEN_UNITS[to]) return null
  const density = ingredient.density
  const ml = from === 'g' ? amount / density : amount * KITCHEN_UNITS[from].ml!
  const grams = ml * density
  const all = Object.fromEntries(UNIT_ORDER.map((unit) => [unit, unit === 'g' ? grams : ml / KITCHEN_UNITS[unit].ml!])) as Record<KitchenUnit, number>
  return { value: all[to], ml, grams, density, all }
}

/** Our own rounding rules, shown on the page:
 *  grams and millilitres: whole numbers from 10 up, one decimal below 10;
 *  cups and spoons: two decimals (and the display trims trailing zeros). */
export function roundKitchen(unit: KitchenUnit, value: number): number {
  if (unit === 'g' || unit === 'ml') return value < 10 ? Math.round(value * 10) / 10 : Math.round(value)
  return Math.round(value * 100) / 100
}

const QUARTERS = ['', '¼', '½', '¾']

/** The nearest quarter, for measuring by eye: 1.52 → "1½", 0.2 → "¼", 3.9 → "4". Our own rounding. */
export function nearestQuarter(value: number): string {
  if (!(value > 0)) return '0'
  const quarters = Math.max(1, Math.round(value * 4))
  const whole = Math.floor(quarters / 4)
  const fraction = QUARTERS[quarters % 4]
  return `${whole > 0 ? whole : ''}${fraction}` || '0'
}
