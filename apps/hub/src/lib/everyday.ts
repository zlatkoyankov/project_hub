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

export interface ScheduleRow {
  /** Month number, or year number in a yearly summary. */
  period: number
  payment: number
  interest: number
  principal: number
  balance: number
}

export interface LoanSchedule {
  months: ScheduleRow[]
  years: ScheduleRow[]
  totalInterest: number
  /** Months until the loan is paid off (fewer than the term with an extra payment). */
  paidOffIn: number
}

/** Month-by-month repayment plan of an equal-payment loan, with an optional extra payment towards the principal each
 *  month. Interest each month is the balance × annual rate ÷ 12 (the same r as in loanPayment). */
export function loanSchedule(principal: number, annualRate: number, months: number, extra = 0): LoanSchedule | null {
  const base = loanPayment(principal, annualRate, months)
  if (!base || !(extra >= 0)) return null
  const r = annualRate / 100 / 12
  const rows: ScheduleRow[] = []
  let balance = principal
  for (let month = 1; balance > 1e-9 && month <= base.months; month += 1) {
    const interest = balance * r
    const principalPart = Math.min(balance, base.payment - interest + extra)
    balance -= principalPart
    rows.push({ period: month, payment: interest + principalPart, interest, principal: principalPart, balance: Math.max(0, balance) })
  }
  const years: ScheduleRow[] = []
  rows.forEach((row) => {
    const year = Math.ceil(row.period / 12)
    const last = years[year - 1] ?? (years[year - 1] = { period: year, payment: 0, interest: 0, principal: 0, balance: 0 })
    last.payment += row.payment
    last.interest += row.interest
    last.principal += row.principal
    last.balance = row.balance
  })
  return { months: rows, years, totalInterest: rows.reduce((sum, row) => sum + row.interest, 0), paidOffIn: rows.length }
}

// ---- Sick pay (временна неработоспособност), employees, from 1 January 2024 ----
// КСО чл. 40, ал. 5: the employer pays the first two working days at 70% of the average daily gross wage of the month
// the illness began (three days before 2024). Not paid when the leave continues an earlier one without a break.
// КСО чл. 41: from the third working day НОИ pays 80% (90% for a work accident or occupational disease, from the first
// day) of the average daily insurable income over the 18 calendar months before the month of illness, divided by the
// working days in those months; the daily benefit may not exceed the average daily net wage for the same period.
// Source: НОИ, „Парично обезщетение при временна неработоспособност“ (nssi.bg).
export const SICK_EMPLOYER_DAYS = 2
export const SICK_EMPLOYER_RATE = 0.7
export const SICK_NOI_RATE = { illness: 0.8, accident: 0.9 }
export const SICK_PERIOD_MONTHS = 18

export interface SickPayInput {
  /** Average monthly gross over the last 18 months (one figure for all months). */
  gross: number
  /** Gross for the month the illness began, for the employer's days; defaults to gross. */
  monthGross?: number
  /** First and last day of the sick leave (both included), yyyy-mm-dd. */
  from: string
  to: string
  cause: 'illness' | 'accident'
  /** The leave continues an earlier one without a break: no employer days. */
  continuation?: boolean
}

export interface SickPayResult {
  workdays: number
  employerDays: number
  noiDays: number
  employerPerDay: number
  employer: number
  noiPerDay: number
  noiGrossRate: number
  noiNetCap: number
  capped: boolean
  noi: number
  total: number
  /** Net pay you would have had for the same working days, for comparison. */
  usualNet: number
  periodWorkdays: number
}

const nextDay = (date: string) => new Date(Date.parse(`${date}T00:00:00Z`) + DAY).toISOString().slice(0, 10)
const monthStart = (date: string, shift = 0) => {
  const d = new Date(`${date}T00:00:00Z`)
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + shift, 1)).toISOString().slice(0, 10)
}

export function sickPay(input: SickPayInput, countWorkdays: (from: string, to: string) => number): SickPayResult | null {
  if (!(input.gross > 0) || parseDate(input.from) === null || parseDate(input.to) === null || input.to < input.from) return null
  const insurable = Math.min(input.gross, MAX_INSURABLE_EUR)
  const workdays = countWorkdays(input.from, nextDay(input.to))
  const periodWorkdays = countWorkdays(monthStart(input.from, -SICK_PERIOD_MONTHS), monthStart(input.from))
  const monthWorkdays = countWorkdays(monthStart(input.from), monthStart(input.from, 1))
  if (!(periodWorkdays > 0 && monthWorkdays > 0)) return null
  const employerDays = input.cause === 'illness' && !input.continuation ? Math.min(SICK_EMPLOYER_DAYS, workdays) : 0
  const noiDays = workdays - employerDays
  const employerPerDay = cents((SICK_EMPLOYER_RATE * (input.monthGross ?? input.gross)) / monthWorkdays)
  const noiGrossRate = (SICK_NOI_RATE[input.cause] * insurable * SICK_PERIOD_MONTHS) / periodWorkdays
  const net = salaryFromGross(input.gross)!.net
  const noiNetCap = (net * SICK_PERIOD_MONTHS) / periodWorkdays
  const capped = input.cause === 'illness' && noiGrossRate > noiNetCap
  const noiPerDay = cents(capped ? noiNetCap : noiGrossRate)
  const employer = cents(employerPerDay * employerDays)
  const noi = cents(noiPerDay * noiDays)
  return {
    workdays, employerDays, noiDays, employerPerDay, employer, noiPerDay, noiGrossRate: cents(noiGrossRate), noiNetCap: cents(noiNetCap), capped, noi,
    total: cents(employer + noi), usualNet: cents((net / monthWorkdays) * workdays), periodWorkdays,
  }
}
