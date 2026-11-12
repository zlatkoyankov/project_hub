// Working days between dates and N working days after a date, without weekends and the public holidays of
// Bulgaria (lib/holidays.ts), the US (federal) or the UK (lib/holidays-en.ts). The holiday rules are computed for any
// year; one-off days are only known where the lists carry them.
import { daysOff } from './holidays'
import { UK_REGIONS, ukBankHolidays, usFederalHolidays, type UkRegion } from './holidays-en'

export type HolidayCalendar = 'none' | 'bg' | 'us' | UkRegion

export const CALENDAR_NAMES: Record<HolidayCalendar, string> = {
  none: 'weekends only',
  bg: 'Bulgaria',
  us: 'US federal holidays',
  ...(Object.fromEntries(UK_REGIONS.map((region) => [region.id, `bank holidays, ${region.name}`])) as Record<UkRegion, string>),
}

const DAY = 86_400_000
const parse = (date: string) => (/^\d{4}-\d{2}-\d{2}$/.test(date) ? Date.parse(`${date}T00:00:00Z`) : NaN)
const iso = (time: number) => new Date(time).toISOString().slice(0, 10)
const weekend = (time: number) => [0, 6].includes(new Date(time).getUTCDay())

/** Holiday dates (days off on weekdays and weekends) for the years from–to. */
export function holidayDates(calendar: HolidayCalendar, fromYear: number, toYear: number): Set<string> {
  const dates = new Set<string>()
  if (calendar === 'none') return dates
  for (let year = fromYear; year <= toYear; year += 1) {
    const list = calendar === 'bg' ? daysOff(year) : calendar === 'us' ? usFederalHolidays(year) : ukBankHolidays(year, calendar)
    for (const day of list) dates.add(day.date)
  }
  return dates
}

export interface WorkdaySpan {
  /** Working days, counted like days between dates: the start day counts, the end day does not. */
  workdays: number
  /** Holidays that fell on a weekday in the span. */
  holidays: number
}

export function workdaysBetween(from: string, to: string, calendar: HolidayCalendar): WorkdaySpan | null {
  const start = parse(from)
  const end = parse(to)
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null
  const [low, high] = start <= end ? [start, end] : [end, start]
  const off = holidayDates(calendar, new Date(low).getUTCFullYear(), new Date(high).getUTCFullYear())
  let workdays = 0
  let holidays = 0
  for (let time = low; time < high; time += DAY) {
    if (weekend(time)) continue
    if (off.has(iso(time))) holidays += 1
    else workdays += 1
  }
  const sign = start <= end ? 1 : -1
  return { workdays: sign * workdays, holidays }
}

/** The date N working days after (or, with a negative N, before) a date. The start day is not counted. */
export function addWorkdays(from: string, count: number, calendar: HolidayCalendar): string | null {
  const start = parse(from)
  if (!Number.isFinite(start) || !Number.isFinite(count) || Math.abs(count) > 5000) return null
  const step = count < 0 ? -1 : 1
  const year = new Date(start).getUTCFullYear()
  const off = holidayDates(calendar, year - Math.ceil(Math.abs(count) / 200) - 1, year + Math.ceil(Math.abs(count) / 200) + 1)
  let time = start
  for (let left = Math.abs(Math.round(count)); left > 0; ) {
    time += step * DAY
    if (!weekend(time) && !off.has(iso(time))) left -= 1
  }
  return iso(time)
}
