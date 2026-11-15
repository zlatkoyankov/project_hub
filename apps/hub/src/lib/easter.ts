// "Кога е Великден" (/bg/koga-e-velikden/): Orthodox and Western Easter by year and the days around the
// Orthodox one in Bulgaria. The dates come from the two existing functions, nothing is computed twice:
// orthodoxEaster (lib/holidays.ts, Meeus's Julian algorithm + 13 days) and westernEaster (lib/holidays-en.ts,
// anonymous Gregorian algorithm). Which days are official days off comes from daysOff (Кодекс на труда, чл. 154).
import { daysOff, orthodoxEaster } from './holidays'
import { westernEaster } from './holidays-en'

const DAY = 86_400_000
const time = (date: string) => Date.parse(`${date}T00:00:00Z`)
const shift = (date: string, days: number) => new Date(time(date) + days * DAY).toISOString().slice(0, 10)

export interface EasterYear {
  year: number
  /** yyyy-mm-dd */
  orthodox: string
  western: string
  /** Whole weeks from the Western to the Orthodox Easter; 0 when both fall on the same day. */
  weeksApart: number
}

export function easterYear(year: number): EasterYear {
  const orthodox = orthodoxEaster(year)
  const western = westernEaster(year)
  return { year, orthodox, western, weeksApart: Math.round((time(orthodox) - time(western)) / (7 * DAY)) }
}

/** Both Easters for every year from `from` to `to`, inclusive. */
export const easterYears = (from: number, to: number): EasterYear[] => Array.from({ length: to - from + 1 }, (_, index) => easterYear(from + index))

/** The year of the next Orthodox Easter on or after `today` (yyyy-mm-dd). */
export function upcomingEasterYear(today: string): number {
  const year = Number(today.slice(0, 4))
  return orthodoxEaster(year) >= today ? year : year + 1
}

export interface EasterDay {
  id: string
  /** yyyy-mm-dd */
  date: string
  name: string
  /** An official day off under чл. 154, ал. 1 of the Labour Code (taken from daysOff). */
  official: boolean
  /** Another official holiday on the same date, e.g. 1 May on Holy Saturday 2027. */
  also?: string
}

const AROUND: [string, number, string][] = [
  ['tsvetnitsa', -7, 'Цветница (Връбница)'],
  ['veliki-petak', -2, 'Велики петък'],
  ['velika-sabota', -1, 'Велика събота'],
  ['velikden', 0, 'Великден (неделя)'],
  ['ponedelnik', 1, 'Великден, втори ден (понеделник)'],
]

/** Palm Sunday to Easter Monday around the Orthodox Easter of `year`, with the official days off marked. */
export function easterDays(year: number): EasterDay[] {
  const easter = orthodoxEaster(year)
  const off = new Map(daysOff(year).map((day) => [day.date, day.name]))
  return AROUND.map(([id, offset, name]) => {
    const date = shift(easter, offset)
    // daysOff joins two holidays on one date with " и ": keep the part that is not the Easter day itself.
    const other = (off.get(date) ?? '').split(' и ').filter((part) => !/^(Велик|Великден)/.test(part)).join(' и ')
    return { id, date, name, official: off.has(date), ...(other && off.has(date) && offset !== -7 ? { also: other } : {}) }
  })
}

/** Weekdays right after Easter Monday that are off because a fixed holiday fell on the Easter weekend. */
export function movedAfterEaster(year: number) {
  const easter = orthodoxEaster(year)
  return daysOff(year).filter((day) => day.moved && day.date > shift(easter, 1) && day.date <= shift(easter, 3))
}
