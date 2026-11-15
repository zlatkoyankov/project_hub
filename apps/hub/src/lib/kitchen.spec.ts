import { describe, expect, it } from 'vitest'
import { INGREDIENTS, KITCHEN_SOURCES, US_CUP_ML, US_TBSP_ML, convertKitchen, nearestQuarter, roundKitchen } from './kitchen'

const grams = (amount: number, from: Parameters<typeof convertKitchen>[0]['from'], ingredient: string) =>
  roundKitchen('g', convertKitchen({ amount, from, to: 'g', ingredient })!.value)

describe('kitchen measures', () => {
  it('uses the exact US cup and tablespoon', () => {
    expect(US_CUP_ML).toBeCloseTo(236.588, 3)
    expect(US_TBSP_ML).toBeCloseTo(14.787, 3)
  })

  it('works out the page example: 1.5 water cups (250 ml) of flour', () => {
    // King Arthur: 1 US cup all-purpose flour = 120 g. 120 / 236.5882 = 0.50721 g/ml.
    // 1.5 × 250 ml = 375 ml; 375 × 0.50721 = 190.20 g, shown as 190 g.
    const result = convertKitchen({ amount: 1.5, from: 'water-cup', to: 'g', ingredient: 'flour' })!
    expect(result.ml).toBe(375)
    expect(result.density).toBeCloseTo(0.50721, 5)
    expect(result.grams).toBeCloseTo(190.2, 1)
    expect(roundKitchen('g', result.value)).toBe(190)
  })

  it('gives the same flour in tea cups (200 ml) and spoons', () => {
    expect(grams(1.5, 'tea-cup', 'flour')).toBe(152)
    expect(grams(1, 'tea-cup', 'flour')).toBe(101)
    expect(grams(1, 'tbsp', 'flour')).toBe(7.6)
  })

  it('weighs a tea cup of sugar, water, honey spoon and milk', () => {
    expect(grams(1, 'tea-cup', 'sugar')).toBe(167)
    expect(grams(200, 'ml', 'water')).toBe(200)
    expect(grams(1, 'tbsp', 'honey')).toBe(21)
    expect(grams(250, 'ml', 'milk')).toBe(258)
  })

  it('converts the other way: grams into cups and spoons', () => {
    const cups = convertKitchen({ amount: 250, from: 'g', to: 'water-cup', ingredient: 'flour' })!
    expect(cups.ml).toBeCloseTo(492.9, 1)
    expect(roundKitchen('water-cup', cups.value)).toBe(1.97)
    expect(roundKitchen('tbsp', convertKitchen({ amount: 100, from: 'g', to: 'tbsp', ingredient: 'sugar' })!.value)).toBe(7.97)
  })

  it('rounds with our own rules', () => {
    expect(roundKitchen('g', 190.19)).toBe(190)
    expect(roundKitchen('g', 5.26)).toBe(5.3)
    expect(roundKitchen('tsp', 1.2345)).toBe(1.23)
    expect(nearestQuarter(1.52)).toBe('1½')
    expect(nearestQuarter(0.1)).toBe('¼')
    expect(nearestQuarter(3.9)).toBe('4')
  })

  it('needs an amount and a known ingredient', () => {
    expect(convertKitchen({ amount: 0, from: 'ml', to: 'g', ingredient: 'flour' })).toBeNull()
    expect(convertKitchen({ amount: 1, from: 'ml', to: 'g', ingredient: 'unknown' })).toBeNull()
  })

  it('has a source for every ingredient', () => {
    for (const ingredient of INGREDIENTS) {
      expect(KITCHEN_SOURCES[ingredient.source], ingredient.id).toBeDefined()
      expect(ingredient.density).toBeGreaterThan(0.3)
      expect(ingredient.density).toBeLessThan(1.5)
    }
  })
})
