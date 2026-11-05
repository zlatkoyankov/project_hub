// Crossword helper logic: find every dictionary word that fits a pattern such as "c?o?s" or "к_л__а".
import type { Language } from './seo'

export const MAX_PATTERN = 20
/** Characters that stand for an unknown letter. */
const UNKNOWN = /[?_.*\s-]/

export const letterClass = (language: Language) => (language === 'bg' ? /[а-я]/ : /[a-z]/)

/** Lower-case pattern with every unknown written as "?", letters kept, anything else dropped. */
export function cleanPattern(value: string, language: Language): string {
  const letter = letterClass(language)
  const locale = language === 'bg' ? 'bg-BG' : 'en'
  return [...value.toLocaleLowerCase(locale)]
    .map((char) => (UNKNOWN.test(char) ? '?' : letter.test(char) ? char : ''))
    .join('')
    .slice(0, MAX_PATTERN)
}

/** Distinct letters of a text, for the "must contain" and "leave out" fields. */
export function cleanLetters(value: string, language: Language): string {
  const letter = letterClass(language)
  const locale = language === 'bg' ? 'bg-BG' : 'en'
  return [...new Set([...value.toLocaleLowerCase(locale)].filter((char) => letter.test(char)))].join('')
}

export interface CrosswordQuery {
  pattern: string
  include?: string
  exclude?: string
}

/** Words of the dictionary that match the pattern, alphabetical. */
export function findMatches(words: string[], { pattern, include = '', exclude = '' }: CrosswordQuery): string[] {
  if (!pattern) return []
  const length = pattern.length
  const known = [...pattern].map((char, index) => [index, char] as const).filter(([, char]) => char !== '?')
  const required = [...include]
  const banned = new Set(exclude)
  const results: string[] = []
  for (const word of words) {
    if (word.length !== length) continue
    if (!known.every(([index, char]) => word[index] === char)) continue
    // Letters to leave out may still appear where the pattern itself places them.
    if (banned.size && [...word].some((char, index) => banned.has(char) && pattern[index] !== char)) continue
    if (!required.every((char) => word.includes(char))) continue
    results.push(word)
  }
  return results.sort((a, b) => a.localeCompare(b))
}
