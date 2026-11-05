// Short Wiktionary meanings for the Wordle helper, built by scripts/build-meanings.mjs.
// index.txt says which words have a meaning (one bit per word of the Wordle list), so a page can
// grey out the button without loading anything else; the meanings themselves are split by first
// letter and fetched only when someone asks for one.
import type { Language } from './seo'
import type { WordleList } from './wordle'

export type MeaningParts = [partOfSpeech: string, senses: string[]][]
export interface Meaning {
  word: string
  /** Dictionary form when the word is an inflected form, e.g. "plays" → "play". */
  headword?: string
  parts: MeaningParts
}

type ChunkEntry = MeaningParts | { f: string; m: MeaningParts }

const base = () => `${import.meta.env.BASE_URL}meanings/`
const indexes: Partial<Record<Language, Promise<Set<string>>>> = {}
const chunks = new Map<string, Promise<Record<string, ChunkEntry>>>()

/** Words of the list that have a meaning. Empty if the index cannot be loaded. */
export function loadMeaningIndex(language: Language, list: WordleList): Promise<Set<string>> {
  indexes[language] ??= fetch(`${base()}${language}/index.txt`)
    .then((response) => (response.ok ? response.text() : ''))
    .then((encoded) => {
      const bits = Uint8Array.from(atob(encoded.trim()), (char) => char.charCodeAt(0))
      const words = [...list.common, ...list.rare]
      return new Set(words.filter((_, index) => (bits[index >> 3] ?? 0) & (1 << (index & 7))))
    })
    .catch(() => new Set<string>())
  return indexes[language]
}

export async function loadMeaning(language: Language, word: string): Promise<Meaning | null> {
  const key = `${language}/${word.codePointAt(0)}`
  if (!chunks.has(key)) {
    chunks.set(key, fetch(`${base()}${key}.json`).then((response) => {
      if (!response.ok) throw new Error(String(response.status))
      return response.json() as Promise<Record<string, ChunkEntry>>
    }).catch((error: unknown) => {
      chunks.delete(key)
      throw error
    }))
  }
  const entry = (await chunks.get(key)!)[word]
  if (!entry) return null
  return Array.isArray(entry) ? { word, parts: entry } : { word, headword: entry.f, parts: entry.m }
}

const PARTS_BG: Record<string, string> = {
  noun: 'съществително', verb: 'глагол', adj: 'прилагателно', adv: 'наречие', pron: 'местоимение',
  prep: 'предлог', conj: 'съюз', intj: 'междуметие', num: 'числително', name: 'собствено име',
  particle: 'частица', character: 'буква', phrase: 'израз', prefix: 'представка', suffix: 'наставка',
  det: 'определител', abbrev: 'съкращение', article: 'член', contraction: 'съкращение',
}
const PARTS_EN: Record<string, string> = {
  adj: 'adjective', adv: 'adverb', pron: 'pronoun', prep: 'preposition', conj: 'conjunction',
  intj: 'interjection', num: 'numeral', name: 'proper noun', det: 'determiner', abbrev: 'abbreviation',
}

export const partLabel = (part: string, language: Language) =>
  (language === 'bg' ? PARTS_BG[part] : PARTS_EN[part]) ?? part

export const wiktionaryUrl = (word: string, language: Language) =>
  `https://en.wiktionary.org/wiki/${encodeURIComponent(word)}#${language === 'bg' ? 'Bulgarian' : 'English'}`
