// Spelling Bee helper: words of four or more letters made only from seven letters, always using the
// centre letter; letters may repeat. A pangram uses all seven.
import type { Language } from './seo'
import { letterClass } from './crossword'

export const MIN_LENGTH = 4

export interface BeeWord {
  word: string
  points: number
  pangram: boolean
}

/** Up to `max` distinct letters of the language, lower-case, in typing order. */
export function cleanBeeLetters(value: string, language: Language, max: number): string {
  const letter = letterClass(language)
  const locale = language === 'bg' ? 'bg-BG' : 'en'
  return [...new Set([...value.toLocaleLowerCase(locale)].filter((char) => letter.test(char)))].join('').slice(0, max)
}

/** Spelling Bee scoring: 1 point for a four-letter word, one point per letter for longer words, 7 extra for a pangram. */
export const beePoints = (word: string, pangram: boolean) => (word.length === MIN_LENGTH ? 1 : word.length) + (pangram ? 7 : 0)

export function findBeeWords(words: string[], centre: string, outer: string): BeeWord[] {
  if (centre.length !== 1 || !outer.length) return []
  const allowed = new Set([centre, ...outer])
  const all = allowed.size
  const results: BeeWord[] = []
  for (const word of words) {
    if (word.length < MIN_LENGTH || !word.includes(centre)) continue
    let ok = true
    for (const char of word) {
      if (!allowed.has(char)) { ok = false; break }
    }
    if (!ok) continue
    const pangram = all === 7 && new Set(word).size === 7
    results.push({ word, points: beePoints(word, pangram), pangram })
  }
  // Longest first, then alphabetical: the pangrams and big words lead.
  return results.sort((a, b) => b.word.length - a.word.length || a.word.localeCompare(b.word))
}

export interface BeeHints {
  total: number
  points: number
  pangrams: number
  /** Count of words by first letter and length. */
  grid: Map<string, Map<number, number>>
  lengths: number[]
  /** Count of words by their first two letters. */
  starts: [string, number][]
}

export function beeHints(found: BeeWord[]): BeeHints {
  const grid = new Map<string, Map<number, number>>()
  const starts = new Map<string, number>()
  const lengths = new Set<number>()
  for (const { word } of found) {
    const row = grid.get(word[0]) ?? new Map<number, number>()
    row.set(word.length, (row.get(word.length) ?? 0) + 1)
    grid.set(word[0], row)
    lengths.add(word.length)
    const start = word.slice(0, 2)
    starts.set(start, (starts.get(start) ?? 0) + 1)
  }
  return {
    total: found.length,
    points: found.reduce((sum, item) => sum + item.points, 0),
    pangrams: found.filter((item) => item.pangram).length,
    grid: new Map([...grid].sort(([a], [b]) => a.localeCompare(b))),
    lengths: [...lengths].sort((a, b) => a - b),
    starts: [...starts].sort(([a], [b]) => a.localeCompare(b)),
  }
}
