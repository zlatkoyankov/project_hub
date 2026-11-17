import { describe, expect, it } from 'vitest'
import { AREAS, electricityPrice } from './electricity'

describe('electricityPrice', () => {
  it('rebuilds the ENERGO-PRO prices published without VAT', () => {
    expect(electricityPrice('north', 'day', false)).toBe(0.12927)
    expect(electricityPrice('north', 'night', false)).toBe(0.07733)
  })

  it('adds 20% VAT: 0.12927 EUR/kWh without VAT is 0.15512 with VAT', () => {
    expect(electricityPrice('north', 'day', true)).toBe(0.15512)
    expect(electricityPrice('north', 'night', true)).toBe(0.0928)
  })

  it('differs by distribution area only through the network charges', () => {
    expect(electricityPrice('south', 'day', false)).toBe(0.12882)
    expect(electricityPrice('west', 'day', false)).toBe(0.12854)
    expect(Object.keys(AREAS)).toHaveLength(3)
  })

  it('worked example: 2 kW heater for 6 h a day, 30 days', () => {
    const kwh = (2000 / 1000) * 6 * 30
    expect(kwh).toBe(360)
    expect(Math.round(kwh * electricityPrice('north', 'day', true) * 100) / 100).toBe(55.84) // with VAT
    expect(Math.round(kwh * electricityPrice('north', 'day', false) * 100) / 100).toBe(46.54) // without VAT
  })
})
