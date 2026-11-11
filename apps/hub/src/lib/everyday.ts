// Everyday sums for the Bulgarian pages: percentages, VAT, leva and euro, dates and loan payments.

/** Fixed conversion rate set by the Council of the EU on 8 July 2025: 1 euro = 1.95583 leva. */
export const BGN_PER_EUR = 1.95583

/** VAT rates under the Bulgarian VAT Act (ЗДДС), art. 66: standard 20%, reduced 9% (for example hotel stays), 0%. */
export const VAT_RATES = [20, 9, 0] as const

export type PercentMode = 'of' | 'share' | 'change' | 'add'

export interface PercentResult {
  value: number
  /** The other figure worth showing, e.g. the difference in a change. */
  extra?: number
}

/** of: a% of b · share: a is what % of b · change: % change from a to b · add: b plus/minus a%. */
export function percent(mode: PercentMode, a: number, b: number): PercentResult | null {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null
  if (mode === 'of') return { value: (a / 100) * b }
  if (mode === 'share') return b === 0 ? null : { value: (a / b) * 100 }
  if (mode === 'change') return a === 0 ? null : { value: ((b - a) / a) * 100, extra: b - a }
  return { value: b * (1 + a / 100), extra: (b * a) / 100 }
}

export interface VatResult {
  net: number
  vat: number
  gross: number
}

/** add: the amount is without VAT · remove: the amount already includes VAT. */
export function vat(amount: number, rate: number, mode: 'add' | 'remove'): VatResult | null {
  if (!(amount >= 0) || !(rate >= 0)) return null
  const net = mode === 'add' ? amount : amount / (1 + rate / 100)
  const gross = mode === 'add' ? amount * (1 + rate / 100) : amount
  return { net, vat: gross - net, gross }
}

/** Leva to euro or back at the fixed rate, unrounded (round to cents for display). */
export function convertEuro(amount: number, direction: 'toEur' | 'toBgn'): number | null {
  if (!(amount >= 0)) return null
  return direction === 'toEur' ? amount / BGN_PER_EUR : amount * BGN_PER_EUR
}

const DAY = 86_400_000
/** Parse yyyy-mm-dd as a calendar date (UTC, so daylight saving never shifts a day). */
export const parseDate = (value: string): number | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const time = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return Number.isNaN(time) ? null : time
}

export interface DateSpan {
  days: number
  weekdays: number
  weeks: number
  restDays: number
}

/** Days from one date to another (the end date not counted, like "in 10 days"), and how many are Monday–Friday. */
export function daysBetween(from: string, to: string): DateSpan | null {
  const start = parseDate(from)
  const end = parseDate(to)
  if (start === null || end === null) return null
  const sign = end >= start ? 1 : -1
  const days = Math.round((end - start) / DAY)
  let weekdays = 0
  for (let index = 0; index < Math.abs(days); index += 1) {
    const day = new Date(start + sign * index * DAY).getUTCDay()
    if (day !== 0 && day !== 6) weekdays += 1
  }
  return { days, weekdays: sign * weekdays, weeks: Math.trunc(days / 7), restDays: days % 7 }
}

/** The date a number of days after (or before, if negative) a date, as yyyy-mm-dd. */
export function addDays(from: string, days: number): string | null {
  const start = parseDate(from)
  if (start === null || !Number.isFinite(days)) return null
  return new Date(start + Math.round(days) * DAY).toISOString().slice(0, 10)
}

export interface LoanResult {
  payment: number
  total: number
  interest: number
  months: number
}

/** Equal monthly payments (annuity) for a fixed annual rate: P · r / (1 − (1 + r)^−n), r = rate / 12. */
export function loanPayment(principal: number, annualRate: number, months: number): LoanResult | null {
  const n = Math.round(months)
  if (!(principal > 0) || !(n > 0) || !(annualRate >= 0)) return null
  const r = annualRate / 100 / 12
  const payment = r === 0 ? principal / n : (principal * r) / (1 - (1 + r) ** -n)
  return { payment, total: payment * n, interest: payment * n - principal, months: n }
}

// Salary under a labour contract, 3rd work category, from 1 August 2026 (ЗБДОО 2026, ДВ бр. 68 от 28.07.2026;
// rates unchanged from 1 January 2026). Table: kik-info.com/spravochnik/osigurovki-i-danaci/7354f89bb31b1bf4ab99aaa7d008b2db
/** Employee's share in percent of the insurable income. Born after 1959: pension 6.58 + ДЗПО 2.20;
 *  born before 1960: pension 8.78 and no ДЗПО. Total 13.78% either way. */
export const SALARY_EMPLOYEE = {
  after1959: { pension: 6.58, sickness: 1.4, unemployment: 0.4, supplementary: 2.2, health: 3.2 },
  before1960: { pension: 8.78, sickness: 1.4, unemployment: 0.4, supplementary: 0, health: 3.2 },
}
/** Employer's share: pension 8.22 + ДЗПО 2.80 (or 11.02 and no ДЗПО), ОЗМ 2.10, unemployment 0.60, health 4.80 = 18.52%.
 *  ТЗПБ (work accidents) is added on top: 0.4–1.1% by economic activity. */
export const SALARY_EMPLOYER = {
  after1959: { pension: 8.22, sickness: 2.1, unemployment: 0.6, supplementary: 2.8, health: 4.8 },
  before1960: { pension: 11.02, sickness: 2.1, unemployment: 0.6, supplementary: 0, health: 4.8 },
}
/** Maximum monthly insurable income from 1 August 2026 (ЗБДОО 2026, art. 6). */
export const MAX_INSURABLE_EUR = 2300
/** Minimum monthly wage for 2026 (ПМС № 243 от 13.11.2025, ДВ бр. 98). */
export const MIN_WAGE_EUR = 620.2
/** Flat personal income tax on employment income (ЗДДФЛ, art. 48). */
export const INCOME_TAX = 10

export type BirthGroup = keyof typeof SALARY_EMPLOYEE

export interface SalaryResult {
  gross: number
  insurable: number
  employee: { pension: number; sickness: number; unemployment: number; supplementary: number; health: number; total: number }
  taxBase: number
  tax: number
  net: number
  employer: { pension: number; sickness: number; unemployment: number; supplementary: number; health: number; accident: number; total: number }
  cost: number
}

const cents = (value: number) => Math.round(value * 100) / 100

/** Net pay and employer cost for a monthly gross salary. Each contribution is rounded to cents, as on a pay slip. */
export function salaryFromGross(gross: number, born: BirthGroup = 'after1959', accidentRate = 0.4): SalaryResult | null {
  if (!(gross > 0)) return null
  const g = cents(gross)
  const insurable = Math.min(g, MAX_INSURABLE_EUR)
  const share = (rates: Record<string, number>) => Object.fromEntries(Object.entries(rates).map(([key, rate]) => [key, cents((insurable * rate) / 100)]))
  const own = share(SALARY_EMPLOYEE[born]) as Omit<SalaryResult['employee'], 'total'>
  const ownTotal = cents(own.pension + own.sickness + own.unemployment + own.supplementary + own.health)
  const taxBase = cents(g - ownTotal)
  const tax = cents((taxBase * INCOME_TAX) / 100)
  const theirs = share(SALARY_EMPLOYER[born]) as Omit<SalaryResult['employer'], 'total' | 'accident'>
  const accident = cents((insurable * accidentRate) / 100)
  const theirTotal = cents(theirs.pension + theirs.sickness + theirs.unemployment + theirs.supplementary + theirs.health + accident)
  return {
    gross: g, insurable,
    employee: { ...own, total: ownTotal },
    taxBase, tax, net: cents(taxBase - tax),
    employer: { ...theirs, accident, total: theirTotal },
    cost: cents(g + theirTotal),
  }
}

/** The gross salary that gives a net amount: solve the formula, then step by cents so the rounded net matches. */
export function salaryFromNet(net: number, born: BirthGroup = 'after1959', accidentRate = 0.4): SalaryResult | null {
  if (!(net > 0)) return null
  const keep = (100 - INCOME_TAX) / 100
  const ownRate = 0.1378
  // Below the cap: net = gross · (1 − 0.1378) · 0.9; above it the contributions are fixed at 0.1378 · cap.
  let gross = net / ((1 - ownRate) * keep)
  if (gross > MAX_INSURABLE_EUR) gross = net / keep + ownRate * MAX_INSURABLE_EUR
  gross = cents(gross)
  for (let step = 0; step < 20; step += 1) {
    const result = salaryFromGross(gross, born, accidentRate)!
    const diff = cents(net - result.net)
    if (diff === 0) return result
    gross = cents(gross + (diff > 0 ? 0.01 : -0.01))
  }
  return salaryFromGross(gross, born, accidentRate)
}
