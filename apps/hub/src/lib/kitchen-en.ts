// English cups-to-grams converter for /cups-to-grams-calculator/. It reuses the densities of lib/kitchen.ts
// (the Bulgarian kitchen-measures tool): no figure is repeated here, only English names and units are added.
// An ingredient that has no source in kitchen.ts is not in this tool either. Sources opened 15 November 2026.
import {
  INGREDIENTS,
  KITCHEN_SOURCES,
  US_CUP_ML,
  US_TBSP_ML,
  ingredientById,
  nearestQuarter,
  roundKitchen,
  type Ingredient,
} from './kitchen'

export { nearestQuarter }

export const CUPS_CHECKED = '15 November 2026'
export const CUPS_CHECKED_ISO = '2026-11-15'

/** US teaspoon = 1/3 tablespoon exactly. Source: NIST Handbook 44 (2026), Appendix C, p. C-26. */
export const US_TSP_ML = US_TBSP_ML / 3 // 4.92892159

/** Metric cup = 250 ml. Sources: UK Metric Association ("A metric cup (used in Australia) is 250 ml"; cups are not a
 *  standard UK measure) and Foodwatch ("one metric cup holds 250 mL"). It is a convention, not a legal unit. */
export const METRIC_CUP_ML = 250

export type CookUnit = 'g' | 'ml' | 'us-cup' | 'metric-cup' | 'tbsp' | 'tsp'

export interface CookUnitInfo {
  label: string
  one: string
  many: string
  /** Millilitres in one unit; missing for grams. */
  ml?: number
}

export const COOK_UNITS: Record<CookUnit, CookUnitInfo> = {
  g: { label: 'grams (g)', one: 'g', many: 'g' },
  ml: { label: 'millilitres (ml)', one: 'ml', many: 'ml', ml: 1 },
  'us-cup': { label: 'US cups (236.6 ml)', one: 'US cup', many: 'US cups', ml: US_CUP_ML },
  'metric-cup': { label: 'metric cups (250 ml)', one: 'metric cup', many: 'metric cups', ml: METRIC_CUP_ML },
  tbsp: { label: 'US tablespoons (14.79 ml)', one: 'US tablespoon', many: 'US tablespoons', ml: US_TBSP_ML },
  tsp: { label: 'US teaspoons (4.93 ml)', one: 'US teaspoon', many: 'US teaspoons', ml: US_TSP_ML },
}

/** The first entry of each list is the default of the form (the share link keeps only what differs from it). */
export const FROM_ORDER: CookUnit[] = ['us-cup', 'metric-cup', 'tbsp', 'tsp', 'ml', 'g']
export const TO_ORDER: CookUnit[] = ['g', 'ml', 'us-cup', 'metric-cup', 'tbsp', 'tsp']
export const ALL_ORDER: CookUnit[] = ['g', 'ml', 'us-cup', 'metric-cup', 'tbsp', 'tsp']

/** English names, the published figure each density comes from, and caveats. The densities themselves are
 *  not repeated: they come from kitchen.ts (kitchen-en.spec.ts checks that each "basis" agrees with them). */
const TEXT: Record<string, { label: string; basis: string; note?: string }> = {
  flour: {
    label: 'All-purpose flour',
    basis: '120 g per 1 US cup (All-Purpose Flour)',
    note: 'The figure is for US all-purpose flour. UK plain flour is a different product and can weigh a little differently, and the weight depends on how the cup is filled: sifted, spooned or scooped from the bag.',
  },
  sugar: { label: 'Granulated sugar', basis: '198 g per 1 US cup (granulated white sugar)' },
  'powdered-sugar': { label: 'Powdered (icing) sugar, unsifted', basis: "113 g per 1 US cup (confectioners' sugar, unsifted)" },
  'brown-sugar': { label: 'Brown sugar, packed', basis: '213 g per 1 US cup (brown sugar, dark or light, packed)' },
  rice: { label: 'Long-grain rice, dry', basis: '99 g per ½ US cup (rice, long grain, dry)' },
  milk: {
    label: 'Milk',
    basis: '1.03 g/ml (our own rounding of 1.0303–1.0313)',
    note: 'The density was measured for raw whole cow\'s milk; pasteurized and lower-fat milk is very close to it.',
  },
  water: { label: 'Water', basis: '0.9982 g/ml at 20 °C' },
  oil: { label: 'Sunflower oil', basis: 'relative density 0.918–0.923; we took the middle, 0.9205 (our own middle value)' },
  butter: {
    label: 'Butter (solid)',
    basis: '113 g per 8 US tablespoons = ½ US cup (butter)',
    note: 'The weight is for cold, solid butter packed into the measure. Melted butter is denser in a cup, so weigh it.',
  },
  honey: { label: 'Honey', basis: '21 g per 1 US tablespoon (honey)' },
  salt: {
    label: 'Table salt (fine)',
    basis: '18 g per 1 US tablespoon (table salt)',
    note: 'Coarse sea salt weighs less than fine salt in the same spoon, and brands differ. The figure is for fine table salt.',
  },
  cocoa: { label: 'Unsweetened cocoa powder', basis: '42 g per ½ US cup (cocoa, unsweetened)' },
  cornstarch: { label: 'Cornstarch (cornflour in the UK)', basis: '28 g per ¼ US cup (cornstarch)' },
  'potato-starch': { label: 'Potato starch', basis: '152 g per 1 US cup (potato starch)' },
  oats: { label: 'Rolled oats (old-fashioned or quick-cooking)', basis: '89 g per 1 US cup (oats, old-fashioned or quick-cooking)' },
}

export interface IngredientEn extends Ingredient {
  /** The English text is in `label`, `basis` and `note`; density and source id come from kitchen.ts. */
}

export const INGREDIENTS_EN: IngredientEn[] = INGREDIENTS.map((ingredient) => {
  const text = TEXT[ingredient.id]
  if (!text) throw new Error(`kitchen-en.ts: no English text for ingredient "${ingredient.id}"`)
  return { ...ingredient, label: text.label, basis: text.basis, note: text.note }
})

export const ingredientEnById = (id: string) => INGREDIENTS_EN.find((ingredient) => ingredient.id === id)

/** English names of the density sources; the links are those of kitchen.ts. */
const SOURCE_LABELS: Record<string, string> = {
  ka: 'King Arthur Baking: Ingredient Weight Chart',
  water: 'MilliporeSigma (Merck): Pure Water Density Standard, 0.9982 g/ml at 20 °C',
  milk: 'Parmar et al., Irish Journal of Agricultural and Food Research 59 (2021): density of raw whole milk 1.030–1.031 g/cm³',
  oil: 'FAO / Codex Alimentarius, standard for named vegetable oils, Table 2: relative density of sunflower oil at 20 °C, 0.918–0.923',
}

export const SOURCES_EN: Record<string, { short: string; label: string; href: string }> = Object.fromEntries(
  Object.values(KITCHEN_SOURCES).map((source) => [source.id, { short: source.short.replace('Parmar и др.', 'Parmar et al.'), label: SOURCE_LABELS[source.id], href: source.href }]),
)

/** Sources for the units, besides the density sources above. */
export const UNIT_SOURCES = [
  { label: 'NIST Handbook 44 (2026), Appendix C: 1 US cup = 8 fluid ounces exactly (237 mL rounded), 1 tablespoon = ½ fluid ounce exactly = 3 teaspoons, 1 gallon = 231 cubic inches = 3,785.411784 mL', href: 'https://www.nist.gov/document/2026-nist-handbook-44-appendix-c' },
  { label: 'NIST, Metric Kitchen: measuring spoons of 15 mL (tablespoon) and 5 mL (teaspoon); the table rounds a cup to 240 mL', href: 'https://www.nist.gov/pml/owm/cooking-measurement-equivalencies' },
  { label: 'UK Metric Association, cooking in metric: "A metric cup (used in Australia) is 250 ml"; cups are not a standard UK measure; the US cup is about 237 ml', href: 'https://ukma.org.uk/practical-help/cooking/' },
  { label: 'Foodwatch (Australia): one metric cup holds 250 mL, one metric tablespoon 20 mL, one metric teaspoon 5 mL', href: 'https://foodwatch.com.au/blog/healthy-cooking/item/food-measurement-and-conversions.html' },
]

export interface CookInput {
  amount: number
  from: CookUnit
  to: CookUnit
  ingredient: string
}

export interface CookResult {
  /** Converted value, not rounded. */
  value: number
  ml: number
  grams: number
  density: number
  all: Record<CookUnit, number>
}

/** grams = ml × density; ml = amount × the unit's ml (or grams ÷ density when the amount is in grams). */
export function convertCooking(input: CookInput): CookResult | null {
  const ingredient = ingredientById(input.ingredient)
  const { amount, from, to } = input
  if (!ingredient || !(amount > 0) || !Number.isFinite(amount) || !COOK_UNITS[from] || !COOK_UNITS[to]) return null
  const density = ingredient.density
  const ml = from === 'g' ? amount / density : amount * COOK_UNITS[from].ml!
  const grams = ml * density
  const all = Object.fromEntries(ALL_ORDER.map((unit) => [unit, unit === 'g' ? grams : ml / COOK_UNITS[unit].ml!])) as Record<CookUnit, number>
  return { value: all[to], ml, grams, density, all }
}

/** Our own rounding, the same as the Bulgarian tool: grams and ml whole from 10 up and one decimal below 10;
 *  cups and spoons two decimals. */
export const roundCooking = (unit: CookUnit, value: number) => roundKitchen(unit === 'g' || unit === 'ml' ? unit : 'tbsp', value)
