import { describe, expect, it } from 'vitest'
import { FUEL_PRICES_EUR, tripFuelCost } from './everyday'

describe('tripFuelCost', () => {
  it('works out the page example', () => {
    // 200 km each way, there and back, 7 l/100 km, petrol at the bulletin price, 2 people.
    const result = tripFuelCost({ distance: 200, roundTrip: true, consumption: 7, price: FUEL_PRICES_EUR.petrol, people: 2 })!
    expect(result.km).toBe(400)
    expect(result.litres).toBe(28)
    expect(result.fuel).toBe(44.94)
    expect(result.perPerson).toBe(22.47)
    expect(result.per100km).toBe(11.24)
  })

  it('adds tolls before splitting and handles one way', () => {
    const result = tripFuelCost({ distance: 150, roundTrip: false, consumption: 6, price: 2, people: 3, extra: 15 })!
    expect(result.fuel).toBe(18)
    expect(result.total).toBe(33)
    expect(result.perPerson).toBe(11)
  })

  it('needs a distance, consumption and price', () => {
    expect(tripFuelCost({ distance: 0, roundTrip: false, consumption: 7, price: 1.6, people: 1 })).toBeNull()
    expect(tripFuelCost({ distance: 10, roundTrip: false, consumption: 7, price: 0, people: 1 })).toBeNull()
  })
})
