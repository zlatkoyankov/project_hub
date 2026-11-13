import { describe, expect, it } from 'vitest'
import { OCCASIONS, countdown, dayWord, nextDate } from './countdown'

const occasion = (id: string) => OCCASIONS.find((o) => o.id === id)!

describe('nextDate', () => {
  it('takes this year until the day has passed', () => {
    expect(nextDate(occasion('koleda'), '2026-11-13')).toBe('2026-12-25')
    expect(nextDate(occasion('koleda'), '2026-12-25')).toBe('2026-12-25')
    expect(nextDate(occasion('koleda'), '2026-12-26')).toBe('2027-12-25')
    expect(nextDate(occasion('nova-godina'), '2026-11-13')).toBe('2027-01-01')
  })

  it('moves Easter with the year', () => {
    expect(nextDate(occasion('velikden'), '2026-11-13')).toBe('2027-05-02')
    expect(nextDate(occasion('velikden'), '2026-04-01')).toBe('2026-04-12')
  })
})

describe('countdown', () => {
  it('counts days, weeks and Bulgarian working days', () => {
    // 13 Nov 2026 (Friday) to 25 Dec 2026: 42 days = 6 weeks. Working days 13 Nov – 24 Dec:
    // 30 weekdays, minus 24 Dec (Бъдни вечер) = 29.
    expect(countdown('2026-11-13', '2026-12-25')).toEqual({ date: '2026-12-25', days: 42, weeks: 6, restDays: 0, workdays: 29 })
    expect(countdown('2026-12-25', '2026-12-25')?.days).toBe(0)
    expect(countdown('2026-12-26', '2026-12-25')).toBeNull()
  })

  it('writes the day word', () => {
    expect(dayWord(1)).toBe('1 ден')
    expect(dayWord(42)).toBe('42 дни')
    expect(dayWord(1000)).toBe('1000 дни')
  })
})
