// Wordle helper logic: feedback patterns, filtering and next-guess suggestions.
// Everything works on five-letter lowercase words; tiles are 0 grey, 1 yellow, 2 green.
import type { Language } from './seo'

export const WORD_LENGTH = 5
export type Tile = 0 | 1 | 2
export interface GuessRow {
  word: string
  tiles: Tile[]
}
export interface WordleList {
  /** Everyday words, most frequent first: the likely answers. */
  common: string[]
  /** The rest of the dictionary's five-letter words, alphabetical. */
  rare: string[]
}

/** Best first guesses for each language (from scoring every common word, see the blog). */
export const OPENERS: Record<Language, string[]> = {
  en: ['raise', 'arise', 'irate', 'arose', 'later'],
  bg: ['ролка', 'норма', 'корал', 'катер', 'нотка'],
}

const lists: Partial<Record<Language, Promise<WordleList>>> = {}

/** Loads the language's word list once (common words, a "---" line, then rare words). */
export function loadWordleList(language: Language): Promise<WordleList> {
  lists[language] ??= fetch(`${import.meta.env.BASE_URL}wordle-${language}.txt`)
    .then((response) => {
      if (!response.ok) throw new Error(language === 'bg' ? 'Списъкът с думи не може да бъде зареден.' : 'We could not load the word list.')
      return response.text()
    })
    .then(parseWordleList)
    .catch((error) => {
      delete lists[language]
      throw error
    })
  return lists[language]
}

export function parseWordleList(text: string): WordleList {
  const [common = '', rare = ''] = text.split(/\r?\n---\r?\n/)
  const words = (block: string) => block.split(/\r?\n/).filter((word) => word.length === WORD_LENGTH)
  return { common: words(common), rare: words(rare) }
}

// Scratch buffers for feedback(): letter counts keyed by char code & 63, which is unique for
// a-z and for а-я, and the five tiles.
const letterCounts = new Uint8Array(64)
const tileBuffer = new Uint8Array(WORD_LENGTH)

/** Feedback for a guess against an answer, as a number from 0 to 242 (base 3, first letter highest). */
export function feedback(guess: string, answer: string): number {
  for (let i = 0; i < WORD_LENGTH; i++) {
    letterCounts[answer.charCodeAt(i) & 63] = 0
    letterCounts[guess.charCodeAt(i) & 63] = 0
  }
  for (let i = 0; i < WORD_LENGTH; i++) {
    const letter = answer.charCodeAt(i)
    if (guess.charCodeAt(i) === letter) tileBuffer[i] = 2
    else {
      tileBuffer[i] = 0
      letterCounts[letter & 63]++
    }
  }
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (tileBuffer[i] === 2) continue
    const key = guess.charCodeAt(i) & 63
    if (letterCounts[key] > 0) {
      tileBuffer[i] = 1
      letterCounts[key]--
    }
  }
  return (((tileBuffer[0] * 3 + tileBuffer[1]) * 3 + tileBuffer[2]) * 3 + tileBuffer[3]) * 3 + tileBuffer[4]
}

export const encodeTiles = (tiles: Tile[]): number => tiles.reduce<number>((code, tile) => code * 3 + tile, 0)

/** Words that would have produced exactly these colours for every guess. */
export function filterWords(words: string[], rows: GuessRow[]): string[] {
  const complete = rows.filter((row) => row.word.length === WORD_LENGTH)
  if (complete.length === 0) return words
  const codes = complete.map((row) => encodeTiles(row.tiles))
  return words.filter((word) => complete.every((row, index) => feedback(row.word, word) === codes[index]))
}

export interface Suggestion {
  word: string
  /** Average number of possible answers left after this guess. */
  expectedLeft: number
  /** Whether the suggested word could itself be the answer. */
  possibleAnswer: boolean
}

// Upper bound on feedback calculations per suggestion, to keep the page responsive.
const BUDGET = 1_500_000

/**
 * The guess that leaves the fewest possible answers on average (sum of squared group sizes),
 * chosen from the common words. Among equal scores, a word that could be the answer wins.
 */
export function suggestGuess(candidates: string[], guessPool: string[]): Suggestion | null {
  if (candidates.length === 0) return null
  if (candidates.length <= 2) return { word: candidates[0], expectedLeft: candidates.length === 1 ? 1 : 1.5, possibleAnswer: true }
  const possible = new Set(candidates)
  const poolSize = Math.max(50, Math.floor(BUDGET / candidates.length))
  const pool = [...candidates.slice(0, poolSize), ...guessPool.slice(0, poolSize)]
  const counts = new Uint16Array(243)
  let best: Suggestion | null = null
  let bestScore = Infinity
  const seen = new Set<string>()
  for (const guess of pool) {
    if (seen.has(guess)) continue
    seen.add(guess)
    counts.fill(0)
    for (const answer of candidates) counts[feedback(guess, answer)]++
    let score = 0
    for (const count of counts) score += count * count
    if (possible.has(guess)) score -= 0.5
    if (score < bestScore) {
      bestScore = score
      best = { word: guess, expectedLeft: 0, possibleAnswer: possible.has(guess) }
    }
  }
  if (best) best.expectedLeft = Math.max(1, (bestScore + (best.possibleAnswer ? 0.5 : 0)) / candidates.length)
  return best
}
