import { describe, expect, it } from 'vitest'
import { LEGAL_INTEREST_RATES, legalInterest, type LegalInterestResult } from './everyday'

describe('legalInterest', () => {
  it('works out the page example across three half-years', () => {
    // 1 000 € late from 1.11.2025 to 31.08.2026, both days included. By hand:
    // 1.11–31.12.2025: 61 days × 11.91% (ОЛП 1.91 + 10): 1000 × 0.1191 × 61 / 360 = 20.18
    // 1.1–30.6.2026: 181 days × 10.15% (ECB 2.15 + 8): 1000 × 0.1015 × 181 / 360 = 51.03
    // 1.7–31.8.2026: 62 days × 10.40% (ECB 2.40 + 8): 1000 × 0.1040 × 62 / 360 = 17.91
    const result = legalInterest(1000, '2025-11-01', '2026-08-31') as LegalInterestResult
    expect(result.periods.map((period) => [period.start, period.end, period.days, period.rate, period.interest])).toEqual([
      ['2025-11-01', '2025-12-31', 61, 11.91, 20.18],
      ['2026-01-01', '2026-06-30', 181, 10.15, 51.03],
      ['2026-07-01', '2026-08-31', 62, 10.4, 17.91],
    ])
    expect(result.days).toBe(304)
    expect(result.interest).toBe(89.12)
    expect(result.total).toBe(1089.12)
  })

  it('uses 10% for 2022 (ОЛП 0) and a 360-day year', () => {
    const result = legalInterest(1000, '2022-01-01', '2022-12-31') as LegalInterestResult
    expect(result.days).toBe(365)
    expect(result.periods.map((period) => period.interest)).toEqual([50.28, 51.11])
    expect(result.interest).toBe(101.39)
  })

  it('counts a single day', () => {
    const result = legalInterest(3600, '2026-07-01', '2026-07-01') as LegalInterestResult
    expect(result.days).toBe(1)
    expect(result.interest).toBe(1.04) // 3600 × 10.40% ÷ 360
  })

  it('rejects bad input, reversed dates and dates outside the table', () => {
    expect(legalInterest(0, '2026-01-01', '2026-02-01')).toBe('input')
    expect(legalInterest(100, '2026-02-01', '2026-01-01')).toBe('order')
    expect(legalInterest(100, '2021-12-31', '2026-01-01')).toBe('range')
    expect(legalInterest(100, '2026-01-01', '2027-01-01')).toBe('range')
  })

  it('has one rate per half-year with no gaps', () => {
    expect(LEGAL_INTEREST_RATES).toHaveLength(10)
    expect(LEGAL_INTEREST_RATES.map((rate) => rate.rate)).toEqual([10, 10, 11.42, 13.12, 13.79, 13.63, 12.95, 11.91, 10.15, 10.4])
  })
})
