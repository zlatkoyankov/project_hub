// Official days off in Bulgaria, Кодекс на труда чл. 154:
// ал. 1 lists the holidays; ал. 2: when one of them (except the Easter days) falls on a Saturday or Sunday,
// the first working day after it is a day off. Extra days the Council of Ministers announces (чл. 154, ал. 3)
// are not included: they are decided year by year.

export interface DayOff {
  /** yyyy-mm-dd */
  date: string
  name: string
  /** A weekday that is off because a holiday fell on the weekend. */
  moved?: boolean
}

const FIXED: [string, string][] = [
  ['01-01', 'Нова година'],
  ['03-03', 'Ден на Освобождението на България'],
  ['05-01', 'Ден на труда и на международната работническа солидарност'],
  ['05-06', 'Гергьовден, Ден на храбростта и Българската армия'],
  ['05-24', 'Ден на светите братя Кирил и Методий, на българската азбука, просвета и култура'],
  ['09-06', 'Ден на Съединението'],
  ['09-22', 'Ден на Независимостта на България'],
  ['12-24', 'Бъдни вечер'],
  ['12-25', 'Рождество Христово'],
  ['12-26', 'Рождество Христово'],
]

const DAY = 86_400_000
const iso = (time: number) => new Date(time).toISOString().slice(0, 10)
const utc = (year: number, month: number, day: number) => Date.UTC(year, month - 1, day)
const weekend = (time: number) => [0, 6].includes(new Date(time).getUTCDay())

/** Orthodox Easter Sunday (Meeus's Julian algorithm, + 13 days to the Gregorian calendar for 1900–2099). */
export function orthodoxEaster(year: number): string {
  const a = year % 4
  const b = year % 7
  const c = year % 19
  const d = (19 * c + 15) % 30
  const e = (2 * a + 4 * b - d + 34) % 7
  const month = Math.floor((d + e + 114) / 31)
  const day = ((d + e + 114) % 31) + 1
  return iso(utc(year, month, day) + 13 * DAY)
}

/** Extra days off the Council of Ministers declared (чл. 154, ал. 3 КТ). Add new decisions here with their source.
 *  2 January 2026: day off for the switch to the euro, without a working Saturday (248 working days in 2026). */
export const EXTRA_DAYS_OFF: DayOff[] = [{ date: '2026-01-02', name: 'Почивен ден по решение на Министерския съвет (въвеждане на еврото)' }]

/** All official days off in a year, in date order. Weekend days are included when they are holidays. */
export function daysOff(year: number): DayOff[] {
  const easter = Date.parse(`${orthodoxEaster(year)}T00:00:00Z`)
  const list: DayOff[] = [
    ...FIXED.map(([md, name]) => ({ date: `${year}-${md}`, name })),
    { date: iso(easter - 2 * DAY), name: 'Велики петък' },
    { date: iso(easter - DAY), name: 'Велика събота' },
    { date: iso(easter), name: 'Великден' },
    { date: iso(easter + DAY), name: 'Великден (втори ден)' },
  ]
  const taken = new Set(list.map((day) => day.date))
  for (const [md, name] of FIXED) {
    let time = Date.parse(`${year}-${md}T00:00:00Z`)
    if (!weekend(time)) continue
    do time += DAY
    while (weekend(time) || taken.has(iso(time)))
    taken.add(iso(time))
    list.push({ date: iso(time), name: `Почивен ден вместо ${name} (${md.split('-').reverse().join('.')})`, moved: true })
  }
  for (const extra of EXTRA_DAYS_OFF) if (extra.date.startsWith(`${year}-`)) list.push(extra)
  // 1 May and Holy Saturday can fall on the same day: keep one entry with both names.
  const merged = new Map<string, DayOff>()
  for (const day of list) {
    const seen = merged.get(day.date)
    merged.set(day.date, seen ? { ...seen, name: `${seen.name} и ${day.name}` } : day)
  }
  return [...merged.values()].sort((x, y) => x.date.localeCompare(y.date))
}

export interface MonthCount {
  month: number
  workdays: number
  hours: number
}

/** Working days (Monday–Friday, without days off) per month, with hours at 8 a day. */
export function workdaysByMonth(year: number): MonthCount[] {
  const off = new Set(daysOff(year).map((day) => day.date))
  return Array.from({ length: 12 }, (_, index) => {
    let workdays = 0
    for (let time = utc(year, index + 1, 1); new Date(time).getUTCMonth() === index; time += DAY) {
      if (!weekend(time) && !off.has(iso(time))) workdays += 1
    }
    return { month: index + 1, workdays, hours: workdays * 8 }
  })
}
