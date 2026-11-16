import { describe, expect, it } from 'vitest'
import { LEAVE_NOT_COVERED, LEAVE_SOURCES, unusedLeaveCompensation } from './leave'

describe('unusedLeaveCompensation', () => {
  it('works out the page example', () => {
    // Termination in June 2026. Base month: 1 760 € gross, all 22 working days worked.
    // Daily gross: 1 760 / 22 = 80.00 €.
    // 8 unused days from 2025 (not time-barred) + this year: 20 days × 6 months / 12 = 10, minus 4 taken = 6.
    // Days: 8 + 6 = 14. Compensation: 14 × 80.00 = 1 120.00 € gross.
    const result = unusedLeaveCompensation({ gross: 1760, workdays: 22, carriedDays: 8, annualDays: 20, months: 6, usedDays: 4 })!
    expect(result.daily).toBe(80)
    expect(result.proportionalDays).toBe(10)
    expect(result.currentDays).toBe(6)
    expect(result.totalDays).toBe(14)
    expect(result.amount).toBe(1120)
    expect(result.overUsed).toBe(false)
  })

  it('rounds the daily rate to cents first, then multiplies', () => {
    // 2 000 / 21 = 95.2381 → 95.24; 5 days → 476.20 (not 476.19 from the unrounded rate).
    const result = unusedLeaveCompensation({ gross: 2000, workdays: 21, carriedDays: 5, annualDays: 20, months: 0, usedDays: 0 })!
    expect(result.daily).toBe(95.24)
    expect(result.amount).toBe(476.2)
  })

  it('takes a known daily gross instead of the monthly one', () => {
    const result = unusedLeaveCompensation({ dailyGross: 100, gross: 999, workdays: 1, carriedDays: 0, annualDays: 20, months: 12, usedDays: 5 })!
    expect(result.daily).toBe(100)
    expect(result.currentDays).toBe(15)
    expect(result.amount).toBe(1500)
  })

  it('keeps fractions of a day to two decimals', () => {
    // 20 × 5 / 12 = 8.33 days; at 80 € that is 666.40 €.
    const result = unusedLeaveCompensation({ dailyGross: 80, carriedDays: 0, annualDays: 20, months: 5, usedDays: 0 })!
    expect(result.proportionalDays).toBe(8.33)
    expect(result.amount).toBe(666.4)
  })

  it('does not go below zero when more days were taken than the proportional leave', () => {
    const result = unusedLeaveCompensation({ dailyGross: 80, carriedDays: 2, annualDays: 20, months: 3, usedDays: 10 })!
    expect(result.proportionalDays).toBe(5)
    expect(result.currentDays).toBe(0)
    expect(result.overUsed).toBe(true)
    expect(result.totalDays).toBe(2)
    expect(result.amount).toBe(160)
  })

  it('caps the months at 12 and ignores negative days', () => {
    const result = unusedLeaveCompensation({ dailyGross: 50, carriedDays: -3, annualDays: 20, months: 15, usedDays: -1 })!
    expect(result.proportionalDays).toBe(20)
    expect(result.carriedDays).toBe(0)
    expect(result.amount).toBe(1000)
  })

  it('needs a daily rate', () => {
    expect(unusedLeaveCompensation({ gross: 0, workdays: 22, carriedDays: 5, annualDays: 20, months: 6, usedDays: 0 })).toBeNull()
    expect(unusedLeaveCompensation({ gross: 1500, workdays: 0, carriedDays: 5, annualDays: 20, months: 6, usedDays: 0 })).toBeNull()
  })

  it('has sources and a list of what it does not cover', () => {
    expect(LEAVE_SOURCES.every((source) => source.href.startsWith('https://'))).toBe(true)
    expect(LEAVE_NOT_COVERED.length).toBeGreaterThan(5)
  })
})
