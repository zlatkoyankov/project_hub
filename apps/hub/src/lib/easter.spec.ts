import { describe, expect, it } from 'vitest'
import { easterDays, easterYear, easterYears, movedAfterEaster, upcomingEasterYear } from './easter'

// Published dates, not our own output:
// Western and Orthodox Easter 2026–2035 from https://en.wikipedia.org/wiki/List_of_dates_for_Easter (read 14 Nov 2026);
// Western 2027–2029 also from Royal Museums Greenwich, https://www.rmg.co.uk/discover/explore/when-easter;
// Orthodox 2026–2030 also from https://www.calendardate.com/orthodox_easter_2027.htm;
// the shared dates 2028, 2031 and 2034 from https://leancrew.com/all-this/2025/03/aligned-easters/.
const PUBLISHED: [number, string, string][] = [
  [2026, '2026-04-12', '2026-04-05'],
  [2027, '2027-05-02', '2027-03-28'],
  [2028, '2028-04-16', '2028-04-16'],
  [2029, '2029-04-08', '2029-04-01'],
  [2030, '2030-04-28', '2030-04-21'],
  [2031, '2031-04-13', '2031-04-13'],
  [2032, '2032-05-02', '2032-03-28'],
  [2033, '2033-04-24', '2033-04-17'],
  [2034, '2034-04-09', '2034-04-09'],
  [2035, '2035-04-29', '2035-03-25'],
]

describe('easterYears', () => {
  it('matches the published Orthodox and Western dates for 2026–2035', () => {
    expect(easterYears(2026, 2035).map((row) => [row.year, row.orthodox, row.western])).toEqual(PUBLISHED)
  })

  it('always lands on a Sunday', () => {
    for (const row of easterYears(2026, 2035)) {
      expect(new Date(`${row.orthodox}T12:00:00Z`).getUTCDay()).toBe(0)
      expect(new Date(`${row.western}T12:00:00Z`).getUTCDay()).toBe(0)
    }
  })

  it('counts the weeks between the two', () => {
    expect(easterYear(2027).weeksApart).toBe(5)
    expect(easterYear(2026).weeksApart).toBe(1)
    expect(easterYears(2026, 2035).filter((row) => row.weeksApart === 0).map((row) => row.year)).toEqual([2028, 2031, 2034])
  })
})

describe('upcomingEasterYear', () => {
  it('moves to the next year the day after Orthodox Easter', () => {
    expect(upcomingEasterYear('2026-11-14')).toBe(2027)
    expect(upcomingEasterYear('2027-05-02')).toBe(2027)
    expect(upcomingEasterYear('2027-05-03')).toBe(2028)
  })
})

describe('easterDays', () => {
  it('lists the days around Easter 2027 with the official days off', () => {
    expect(easterDays(2027).map((day) => [day.id, day.date, day.official])).toEqual([
      ['tsvetnitsa', '2027-04-25', false],
      ['veliki-petak', '2027-04-30', true],
      ['velika-sabota', '2027-05-01', true],
      ['velikden', '2027-05-02', true],
      ['ponedelnik', '2027-05-03', true],
    ])
  })

  it('notes 1 May on Holy Saturday 2027 and the day off moved to 4 May', () => {
    expect(easterDays(2027).find((day) => day.id === 'velika-sabota')?.also).toBe('Ден на труда и на международната работническа солидарност')
    expect(movedAfterEaster(2027).map((day) => day.date)).toEqual(['2027-05-04'])
    expect(easterDays(2028).some((day) => day.also)).toBe(false)
    expect(movedAfterEaster(2028)).toEqual([])
  })
})
