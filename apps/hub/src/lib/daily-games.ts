// Today's puzzle number and the player's state for the two Letterwell daily games, for the homepage.
// The hub cannot import Letterwell code, so sofiaToday, puzzleNumber and the streak rules below copy
// apps/letterwell/src/daily.ts (EPOCH, sofiaToday, puzzleNumber, currentStreak) and
// apps/letterwell/src/anagram.ts (currentAnagramStreak). Keep them in step; daily-games.spec.ts checks the dates.

/** Puzzle 1 is 9 November 2026 in Sofia (EPOCH in apps/letterwell/src/daily.ts). */
export const EPOCH = Date.UTC(2026, 10, 9)
export const MAX_GUESSES = 6

/** Today's date in Sofia as a UTC midnight timestamp, so days change at midnight Bulgarian time. */
export function sofiaToday(now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Sofia', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now)
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value)
  return Date.UTC(get('year'), get('month') - 1, get('day'))
}

/** Puzzle number for a date: 1 on the launch day, then one more every day. Both games share it. */
export function puzzleNumber(now: Date = new Date()): number {
  return Math.max(1, Math.round((sofiaToday(now) - EPOCH) / 86_400_000) + 1)
}

export type GameStatus = 'new' | 'started' | 'won' | 'lost'
export interface GameState {
  status: GameStatus
  /** the streak as it stands today (0 once a day was missed) */
  streak: number
}

const num = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : 0)
const obj = (value: unknown): Record<string, unknown> => (value && typeof value === 'object' ? (value as Record<string, unknown>) : {})

/**
 * Daily word: stats from `${storage}-stats-v1` ({ streak, lastPuzzle, lastWon, … }) and the saved game
 * from `${storage}-game-v1` ({ puzzle, guesses }), as DailyWord.tsx writes them.
 */
export function dailyWordState(statsRaw: unknown, gameRaw: unknown, puzzle: number): GameState {
  const stats = obj(statsRaw)
  const game = obj(gameRaw)
  const lastWon = num(stats.lastWon)
  const streak = lastWon >= puzzle - 1 ? num(stats.streak) : 0
  if (num(stats.lastPuzzle) >= puzzle) return { status: lastWon === puzzle ? 'won' : 'lost', streak }
  const guesses = num(game.puzzle) === puzzle && Array.isArray(game.guesses) ? game.guesses.length : 0
  return { status: guesses > 0 ? 'started' : 'new', streak }
}

/**
 * Daily anagram: stats from `${storage}-stats-v1` ({ streak, lastPuzzle, lastSolved, … }) and today's
 * game from `${storage}-today-v1` ({ puzzle, hints, guesses, solved, gaveUp }), as AnagramGame.tsx writes them.
 */
export function anagramState(statsRaw: unknown, todayRaw: unknown, puzzle: number): GameState {
  const stats = obj(statsRaw)
  const today = obj(todayRaw)
  const lastSolved = num(stats.lastSolved)
  const streak = lastSolved >= puzzle - 1 ? num(stats.streak) : 0
  const isToday = num(today.puzzle) === puzzle
  if ((isToday && today.solved === true) || lastSolved === puzzle) return { status: 'won', streak }
  if ((isToday && today.gaveUp === true) || num(stats.lastPuzzle) >= puzzle) return { status: 'lost', streak }
  const started = isToday && (num(today.guesses) > 0 || num(today.hints) > 0)
  return { status: started ? 'started' : 'new', streak }
}
