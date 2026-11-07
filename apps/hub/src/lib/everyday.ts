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
