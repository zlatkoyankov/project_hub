import { describe, expect, it } from 'vitest'
import { anagramState, dailyWordState, puzzleNumber, sofiaToday } from './daily-games'

describe('puzzleNumber (same rule as apps/letterwell/src/daily.ts)', () => {
  it('starts at 1 on 9 November 2026 and adds one a day', () => {
    expect(puzzleNumber(new Date('2026-11-09T12:00:00Z'))).toBe(1)
    expect(puzzleNumber(new Date('2026-11-14T12:00:00Z'))).toBe(6)
    expect(puzzleNumber(new Date('2026-12-31T12:00:00Z'))).toBe(53)
    expect(puzzleNumber(new Date('2027-07-01T12:00:00Z'))).toBe(235)
  })

  it('never goes below 1 before the launch', () => {
    expect(puzzleNumber(new Date('2026-10-01T12:00:00Z'))).toBe(1)
  })

  it('changes at midnight Sofia time, not UTC', () => {
    // Sofia is UTC+2 in November: midnight on 14 November is 22:00 UTC on the 13th.
    expect(puzzleNumber(new Date('2026-11-13T21:59:59Z'))).toBe(5)
    expect(puzzleNumber(new Date('2026-11-13T22:00:00Z'))).toBe(6)
    expect(sofiaToday(new Date('2026-11-13T22:00:00Z'))).toBe(Date.UTC(2026, 10, 14))
    // Summer time (UTC+3): midnight on 1 July 2027 is 21:00 UTC on 30 June.
    expect(puzzleNumber(new Date('2027-06-30T20:59:59Z'))).toBe(234)
    expect(puzzleNumber(new Date('2027-06-30T21:00:00Z'))).toBe(235)
  })
})

describe('dailyWordState', () => {
  it('is new with nothing saved, and survives broken data', () => {
    expect(dailyWordState(null, null, 6)).toEqual({ status: 'new', streak: 0 })
    expect(dailyWordState('x', 42, 6)).toEqual({ status: 'new', streak: 0 })
  })

  it('keeps yesterday\'s streak alive until a day is missed', () => {
    expect(dailyWordState({ streak: 3, lastPuzzle: 5, lastWon: 5 }, null, 6)).toEqual({ status: 'new', streak: 3 })
    expect(dailyWordState({ streak: 3, lastPuzzle: 4, lastWon: 4 }, null, 6)).toEqual({ status: 'new', streak: 0 })
  })

  it('reads a started, won or lost game for today only', () => {
    expect(dailyWordState({ streak: 2, lastPuzzle: 5, lastWon: 5 }, { puzzle: 6, guesses: ['a', 'b'] }, 6).status).toBe('started')
    expect(dailyWordState(null, { puzzle: 5, guesses: ['a'] }, 6).status).toBe('new')
    expect(dailyWordState({ streak: 4, lastPuzzle: 6, lastWon: 6 }, { puzzle: 6, guesses: ['a'] }, 6)).toEqual({ status: 'won', streak: 4 })
    expect(dailyWordState({ streak: 0, lastPuzzle: 6, lastWon: 3 }, null, 6)).toEqual({ status: 'lost', streak: 0 })
  })
})

describe('anagramState', () => {
  it('reads today\'s game and the stats', () => {
    expect(anagramState(null, null, 6)).toEqual({ status: 'new', streak: 0 })
    expect(anagramState(null, { puzzle: 6, hints: 1, guesses: 0, solved: false, gaveUp: false }, 6).status).toBe('started')
    expect(anagramState({ streak: 2, lastPuzzle: 6, lastSolved: 6 }, { puzzle: 6, solved: true }, 6)).toEqual({ status: 'won', streak: 2 })
    expect(anagramState({ streak: 0, lastPuzzle: 6, lastSolved: 4 }, { puzzle: 6, gaveUp: true }, 6)).toEqual({ status: 'lost', streak: 0 })
  })

  it('ignores yesterday\'s saved game', () => {
    expect(anagramState({ streak: 1, lastPuzzle: 5, lastSolved: 5 }, { puzzle: 5, solved: true }, 6)).toEqual({ status: 'new', streak: 1 })
  })
})
