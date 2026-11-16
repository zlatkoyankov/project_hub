import { describe, expect, it } from 'vitest'
import { INGREDIENTS, SUNFLOWER_OIL_G_PER_ML, US_CUP_ML, US_TBSP_ML, WATER_G_PER_ML, MILK_G_PER_ML } from './kitchen'
import { COOK_UNITS, INGREDIENTS_EN, SOURCES_EN, US_TSP_ML, convertCooking, nearestQuarter, roundCooking } from './kitchen-en'

const grams = (amount: number, from: Parameters<typeof convertCooking>[0]['from'], ingredient: string) =>
  roundCooking('g', convertCooking({ amount, from, to: 'g', ingredient })!.value)

describe('cups to grams (English)', () => {
  it('uses the exact US spoons and the 250 ml metric cup', () => {
    expect(US_TSP_ML).toBeCloseTo(4.9289, 4)
    expect(US_TSP_ML * 3).toBeCloseTo(US_TBSP_ML, 10)
    expect(COOK_UNITS['metric-cup'].ml).toBe(250)
  })

  it('works out the page example: 1.5 metric cups (250 ml) of flour', () => {
    // King Arthur: 1 US cup all-purpose flour = 120 g, so 120 / 236.5882 = 0.50721 g/ml.
    // 1.5 × 250 ml = 375 ml; 375 × 0.50721 = 190.20 g, shown as 190 g (the same as the Bulgarian page).
    const result = convertCooking({ amount: 1.5, from: 'metric-cup', to: 'g', ingredient: 'flour' })!
    expect(result.ml).toBe(375)
    expect(result.density).toBeCloseTo(0.50721, 5)
    expect(result.grams).toBeCloseTo(190.2, 1)
    expect(roundCooking('g', result.value)).toBe(190)
  })

  it('gives back the published figure for one US cup or spoon', () => {
    expect(grams(1, 'us-cup', 'flour')).toBe(120)
    expect(grams(2, 'us-cup', 'sugar')).toBe(396)
    expect(grams(1, 'us-cup', 'butter')).toBe(226)
    expect(grams(1, 'tbsp', 'honey')).toBe(21)
    expect(grams(1, 'tsp', 'salt')).toBe(6)
    expect(grams(250, 'ml', 'water')).toBe(250)
  })

  it('weighs one metric cup of other ingredients', () => {
    expect(grams(1, 'metric-cup', 'flour')).toBe(127)
    expect(grams(1, 'metric-cup', 'sugar')).toBe(209)
    expect(grams(1, 'metric-cup', 'milk')).toBe(258)
  })

  it('converts the other way: grams into cups and spoons', () => {
    const cups = convertCooking({ amount: 250, from: 'g', to: 'us-cup', ingredient: 'flour' })!
    expect(cups.ml).toBeCloseTo(492.9, 1)
    expect(roundCooking('us-cup', cups.value)).toBe(2.08)
    expect(nearestQuarter(cups.value)).toBe('2')
    expect(roundCooking('tbsp', convertCooking({ amount: 100, from: 'g', to: 'tbsp', ingredient: 'sugar' })!.value)).toBe(8.08)
  })

  it('needs an amount and a known ingredient', () => {
    expect(convertCooking({ amount: 0, from: 'ml', to: 'g', ingredient: 'flour' })).toBeNull()
    expect(convertCooking({ amount: 1, from: 'ml', to: 'g', ingredient: 'unknown' })).toBeNull()
  })

  it('has the same ingredients and densities as the Bulgarian tool, and a source for each', () => {
    expect(INGREDIENTS_EN.map((item) => item.id)).toEqual(INGREDIENTS.map((item) => item.id))
    INGREDIENTS_EN.forEach((item, index) => {
      expect(item.density).toBe(INGREDIENTS[index].density)
      expect(SOURCES_EN[item.source], item.id).toBeDefined()
    })
  })

  it('shows a published figure that gives the density', () => {
    const volumes: Record<string, number> = {
      '1 US cup': US_CUP_ML,
      '½ US cup': US_CUP_ML / 2,
      '¼ US cup': US_CUP_ML / 4,
      '1 US tablespoon': US_TBSP_ML,
      '8 US tablespoons': US_TBSP_ML * 8,
    }
    for (const item of INGREDIENTS_EN) {
      const match = item.basis.match(/^(\d+) g per (1 US cup|½ US cup|¼ US cup|1 US tablespoon|8 US tablespoons)\b/)
      if (match) expect(Number(match[1]) / volumes[match[2]], item.id).toBeCloseTo(item.density, 9)
    }
    const basis = (id: string) => INGREDIENTS_EN.find((item) => item.id === id)!.basis
    expect(basis('water')).toContain(String(WATER_G_PER_ML))
    expect(basis('milk')).toContain(String(MILK_G_PER_ML))
    expect(basis('oil')).toContain('0.9205')
    expect(SUNFLOWER_OIL_G_PER_ML).toBeCloseTo(0.9205 * WATER_G_PER_ML, 10)
  })
})
