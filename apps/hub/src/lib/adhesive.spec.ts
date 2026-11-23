import { describe, expect, it } from 'vitest'
import { ADHESIVE_PRODUCTS, SCREED_MATERIALS, estimateAdhesive, estimateScreed } from './materials'

const base = { area: 12, tileLength: 60, tileWidth: 60, thickness: 10, joint: 3, notch: -1, waste: 10, adhesiveBag: 25, groutBag: 5, adhesivePrice: 0, groutPrice: 0 }

describe('estimateAdhesive', () => {
  it('keeps the general table as the default (60 x 60 tiles, 12 mm notch, 4.8 kg/m²)', () => {
    const r = estimateAdhesive(base)!
    // 12 m² + 10% = 13.2 m²; 13.2 × 4.8 = 63.36 kg → 3 bags of 25 kg
    expect(r.notchMm).toBe(12)
    expect(r.adhesive).toBeCloseTo(63.36, 6)
    expect(r.adhesiveBags).toBe(3)
  })

  it('reads the Ceresit CM 11 PLUS table from the Bulgarian sheet', () => {
    // 20 × 20 tiles: sheet says an 8 mm notch and 3.3 kg/m². 10 m² + 10% = 11 m² → 36.3 kg → 2 bags.
    const r = estimateAdhesive({ ...base, product: 1, area: 10, tileLength: 20, tileWidth: 20 })!
    expect(r.notchMm).toBe(8)
    expect(r.adhesivePerM2).toBe(3.3)
    expect(r.adhesive).toBeCloseTo(36.3, 6)
    expect(r.adhesiveBags).toBe(2)
  })

  it('picks the 15 mm notch from the Ceresit sheet for tiles above 30 cm', () => {
    const r = estimateAdhesive({ ...base, product: 1 })!
    expect(r.notchMm).toBe(15)
    expect(r.adhesivePerM2).toBe(6.5)
  })

  it('uses the entered rate for products without a notch table', () => {
    const knauf = ADHESIVE_PRODUCTS.findIndex((p) => p.label.startsWith('Knauf K3'))
    const r = estimateAdhesive({ ...base, product: knauf, rate: 2 })!
    expect(r.notchMm).toBeNull()
    expect(r.adhesive).toBeCloseTo(26.4, 6) // 13.2 m² × 2 kg/m²
    expect(r.adhesiveBags).toBe(2)
  })

  it('falls back to the product default rate and rejects a missing rate for the own-value entry', () => {
    const baumit = ADHESIVE_PRODUCTS.findIndex((p) => p.label.startsWith('Baumit'))
    // 1.2 kg/m² per mm × 3 mm layer = 3.6 kg/m²
    expect(estimateAdhesive({ ...base, product: baumit })!.adhesivePerM2).toBeCloseTo(3.6, 6)
    expect(ADHESIVE_PRODUCTS[baumit].rate).toBeCloseTo(1.2 * 3, 6)
  })

  it('shares the same grout result for every product', () => {
    const a = estimateAdhesive(base)!
    const b = estimateAdhesive({ ...base, product: 2, rate: 3 })!
    expect(b.grout).toBeCloseTo(a.grout, 9)
  })
})

describe('screed products', () => {
  it('appends branded products after the three general ones, so old links keep their meaning', () => {
    expect(SCREED_MATERIALS.slice(0, 3).map((m) => m.label)).toEqual(['Циментова замазка', 'Саморазливна замазка', 'Гипсова мазилка'])
  })

  it('Knauf N 340 at 1.6 kg/m² per mm: 10 m², 40 mm, 10% extra', () => {
    const knauf = SCREED_MATERIALS.findIndex((m) => m.label.startsWith('Knauf N 340'))
    const r = estimateScreed({ area: 10, thickness: 40, material: knauf, consumption: 0, waste: 10, bag: 25, price: 0 })!
    // 10 × 40 × 1.6 = 640 kg, +10% = 704 kg → 28.16 bags → 29
    expect(r.kg).toBeCloseTo(704, 6)
    expect(r.bags).toBe(29)
  })
})
