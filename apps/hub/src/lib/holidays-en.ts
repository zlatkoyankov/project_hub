// US federal holidays and UK bank holidays, computed by the rules each government publishes.
// US: 5 U.S.C. § 6103(a) lists the 11 holidays; § 6103(b) moves a Saturday holiday to the Friday before,
// Executive Order 11582 moves a Sunday holiday to the Monday after (OPM applies both).
// UK: the Banking and Financial Dealings Act 1971 and royal proclamations; GOV.UK publishes the dates. When a bank
// holiday falls on a weekend, a substitute weekday becomes a bank holiday, normally the following Monday.
// One-off days (a coronation, a state funeral) are not included.

export interface Holiday {
  /** The date it is observed (the day off), yyyy-mm-dd. */
  date: string
  name: string
  /** The calendar date when the day off moves (a weekend holiday). */
  actual?: string
}

const DAY = 86_400_000
const iso = (time: number) => new Date(time).toISOString().slice(0, 10)
const utc = (year: number, month: number, day: number) => Date.UTC(year, month - 1, day)
const weekday = (time: number) => new Date(time).getUTCDay()
const isWeekend = (time: number) => weekday(time) === 0 || weekday(time) === 6

/** The nth given weekday (0 = Sunday) of a month; n = -1 for the last one. */
function nthWeekday(year: number, month: number, day: number, n: number): number {
  if (n > 0) {
    const first = utc(year, month, 1)
    return first + (((day - weekday(first) + 7) % 7) + (n - 1) * 7) * DAY
  }
  const last = utc(year, month + 1, 1) - DAY
  return last - ((weekday(last) - day + 7) % 7) * DAY
}

/** Western (Gregorian) Easter Sunday, anonymous Gregorian algorithm (Meeus/Jones/Butcher). */
export function westernEaster(year: number): string {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return iso(utc(year, month, day))
}

/** US federal holidays observed in a calendar year, including New Year's Day of the next year when it is observed on 31 December. */
export function usFederalHolidays(year: number): Holiday[] {
  const list: [number, string][] = [
    [utc(year, 1, 1), 'New Year\'s Day'],
    [nthWeekday(year, 1, 1, 3), 'Birthday of Martin Luther King, Jr.'],
    [nthWeekday(year, 2, 1, 3), 'Washington\'s Birthday (Presidents\' Day)'],
    [nthWeekday(year, 5, 1, -1), 'Memorial Day'],
    [utc(year, 6, 19), 'Juneteenth National Independence Day'],
    [utc(year, 7, 4), 'Independence Day'],
    [nthWeekday(year, 9, 1, 1), 'Labor Day'],
    [nthWeekday(year, 10, 1, 2), 'Columbus Day'],
    [utc(year, 11, 11), 'Veterans Day'],
    [nthWeekday(year, 11, 4, 4), 'Thanksgiving Day'],
    [utc(year, 12, 25), 'Christmas Day'],
    [utc(year + 1, 1, 1), `New Year's Day ${year + 1}`],
  ]
  return list
    .map(([time, name]) => {
      const observed = weekday(time) === 6 ? time - DAY : weekday(time) === 0 ? time + DAY : time
      return { date: iso(observed), name, ...(observed !== time && { actual: iso(time) }) }
    })
    .filter((holiday) => holiday.date.startsWith(`${year}-`))
}

export type UkRegion = 'england-and-wales' | 'scotland' | 'northern-ireland'

export const UK_REGIONS: { id: UkRegion; name: string }[] = [
  { id: 'england-and-wales', name: 'England and Wales' },
  { id: 'scotland', name: 'Scotland' },
  { id: 'northern-ireland', name: 'Northern Ireland' },
]

/** UK bank holidays in a year for one region, with substitute days. */
export function ukBankHolidays(year: number, region: UkRegion): Holiday[] {
  const easter = Date.parse(`${westernEaster(year)}T00:00:00Z`)
  const scotland = region === 'scotland'
  // Fixed-date holidays can fall on a weekend and get a substitute day; the others are always weekdays.
  const fixed: [number, string][] = [
    [utc(year, 1, 1), 'New Year\'s Day'],
    ...(scotland ? [[utc(year, 1, 2), '2nd January'] as [number, string]] : []),
    ...(region === 'northern-ireland' ? [[utc(year, 3, 17), 'St Patrick\'s Day'] as [number, string], [utc(year, 7, 12), 'Battle of the Boyne (Orangemen\'s Day)'] as [number, string]] : []),
    ...(scotland ? [[utc(year, 11, 30), 'St Andrew\'s Day'] as [number, string]] : []),
    [utc(year, 12, 25), 'Christmas Day'],
    [utc(year, 12, 26), 'Boxing Day'],
  ]
  const moving: [number, string][] = [
    [easter - 2 * DAY, 'Good Friday'],
    ...(scotland ? [] : [[easter + DAY, 'Easter Monday'] as [number, string]]),
    [nthWeekday(year, 5, 1, 1), 'Early May bank holiday'],
    [nthWeekday(year, 5, 1, -1), 'Spring bank holiday'],
    [scotland ? nthWeekday(year, 8, 1, 1) : nthWeekday(year, 8, 1, -1), 'Summer bank holiday'],
  ]
  const taken = new Set<number>([...fixed, ...moving].map(([time]) => time).filter((time) => !isWeekend(time)))
  const list: Holiday[] = moving.map(([time, name]) => ({ date: iso(time), name }))
  for (const [time, name] of fixed.sort((x, y) => x[0] - y[0])) {
    if (!isWeekend(time)) {
      list.push({ date: iso(time), name })
      continue
    }
    let substitute = time + DAY
    while (isWeekend(substitute) || taken.has(substitute)) substitute += DAY
    taken.add(substitute)
    list.push({ date: iso(substitute), name: `${name} (substitute day)`, actual: iso(time) })
  }
  return list.sort((x, y) => x.date.localeCompare(y.date))
}

/** Monday–Friday days in a year that are not in the list. */
export function workdays(year: number, holidays: Holiday[]): number {
  const off = new Set(holidays.map((holiday) => holiday.date))
  let count = 0
  for (let time = utc(year, 1, 1); time < utc(year + 1, 1, 1); time += DAY) if (!isWeekend(time) && !off.has(iso(time))) count += 1
  return count
}
