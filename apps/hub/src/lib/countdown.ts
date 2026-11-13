// "Колко дни до…" (/bg/kolko-dni-do/): days left until holidays and other dates people count down to.
// Holiday dates follow Кодекс на труда чл. 154 and the Orthodox Easter algorithm in lib/holidays.ts.
// Days are counted like the date calculator: today counts, the day itself does not, so on the day it is 0.
import { orthodoxEaster } from './holidays'
import { workdaysBetween } from './workdays'

export interface Occasion {
  /** Anchor on the page, e.g. #koleda. */
  id: string
  /** "Коледа" */
  name: string
  /** "до Коледа" for headings and the custom-date result. */
  until: string
  /** The date in a given year, yyyy-mm-dd. */
  dateIn: (year: number) => string
  note: string
}

const fixed = (md: string) => (year: number) => `${year}-${md}`

export const OCCASIONS: Occasion[] = [
  { id: 'koleda', name: 'Коледа', until: 'до Коледа', dateIn: fixed('12-25'), note: '24, 25 и 26 декември са официални почивни дни.' },
  { id: 'nova-godina', name: 'Нова година', until: 'до Нова година', dateIn: fixed('01-01'), note: '1 януари е официален почивен ден.' },
  { id: 'velikden', name: 'Великден', until: 'до Великден', dateIn: orthodoxEaster, note: 'Православният Великден. Почивни са Велики петък, Велика събота, Великден и понеделник след него.' },
  { id: 'baba-marta', name: 'Баба Марта', until: 'до Баба Марта', dateIn: fixed('03-01'), note: 'Денят на мартениците. Не е официален почивен ден.' },
  { id: '3-mart', name: '3 март', until: 'до 3 март', dateIn: fixed('03-03'), note: 'Ден на Освобождението, официален почивен ден.' },
  { id: '1-mai', name: '1 май', until: 'до 1 май', dateIn: fixed('05-01'), note: 'Ден на труда, официален почивен ден.' },
  { id: '24-mai', name: '24 май', until: 'до 24 май', dateIn: fixed('05-24'), note: 'Ден на светите братя Кирил и Методий, официален почивен ден.' },
  { id: '6-septemvri', name: '6 септември', until: 'до 6 септември', dateIn: fixed('09-06'), note: 'Ден на Съединението, официален почивен ден.' },
  { id: '22-septemvri', name: '22 септември', until: 'до 22 септември', dateIn: fixed('09-22'), note: 'Ден на Независимостта, официален почивен ден.' },
]

const DAY = 86_400_000
const time = (date: string) => Date.parse(`${date}T00:00:00Z`)

/** Whole days from `from` to `to` (yyyy-mm-dd); negative if `to` is earlier. */
export const daysBetweenDates = (from: string, to: string) => Math.round((time(to) - time(from)) / DAY)

/** The next date of the occasion on or after `today`. */
export function nextDate(occasion: Occasion, today: string): string {
  const year = Number(today.slice(0, 4))
  const thisYear = occasion.dateIn(year)
  return thisYear >= today ? thisYear : occasion.dateIn(year + 1)
}

export interface Countdown {
  date: string
  days: number
  weeks: number
  restDays: number
  /** Bulgarian working days from today up to the day before, today included. */
  workdays: number
}

export function countdown(today: string, date: string): Countdown | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(today) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(time(date))) return null
  const days = daysBetweenDates(today, date)
  if (days < 0) return null
  return { date, days, weeks: Math.floor(days / 7), restDays: days % 7, workdays: workdaysBetween(today, date, 'bg')?.workdays ?? 0 }
}

/** "1 ден", "2 дни", "21 дни" */
export const dayWord = (n: number) => `${n.toLocaleString('bg-BG')} ${n === 1 ? 'ден' : 'дни'}`
