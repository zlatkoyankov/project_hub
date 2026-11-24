import { describe, expect, it } from 'vitest'
import { LOAN_EXAMPLES, loanPayment } from './everyday'

const round = (value: number) => Math.round(value * 100) / 100

describe('loan examples table', () => {
  it('matches the known checks', () => {
    // 5000 at 5.5% for 10 months = 512.69; 25,000 at 7% for 5 years = 495.03 (the page's headline example).
    expect(round(loanPayment(5000, 5.5, 10)!.payment)).toBe(512.69)
    expect(round(loanPayment(25000, 7, 60)!.payment)).toBe(495.03)
  })

  it('has the values shown in the table for the 7% example rate', () => {
    expect(LOAN_EXAMPLES.rate).toBe(7)
    const row = (amount: number) => LOAN_EXAMPLES.years.map((years) => round(loanPayment(amount, 7, years * 12)!.payment))
    // Worked out independently with the annuity formula.
    expect(row(10000)).toEqual([308.77, 198.01, 150.93])
    expect(row(33000)).toEqual([1018.94, 653.44, 498.06])
    expect(row(100000)).toEqual([3087.71, 1980.12, 1509.27])
  })

  it('lists the popular amounts in ascending order', () => {
    expect(LOAN_EXAMPLES.amounts).toEqual([...LOAN_EXAMPLES.amounts].sort((a, b) => a - b))
    expect(LOAN_EXAMPLES.amounts).toContain(33000)
  })
})
