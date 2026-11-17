import { anagramContent } from './anagram'
import { beeContent } from './bee'
import { crosswordContent } from './crossword'
import { dailyContent } from './daily'
import { finderContent } from './finder'
import { wordleContent } from './wordle'
import type { PageContent } from './types'

export type { PageContent, Section } from './types'

export const CONTENT: Record<'finder' | 'wordle' | 'crossword' | 'bee' | 'daily' | 'anagram', PageContent> = {
  finder: finderContent,
  wordle: wordleContent,
  crossword: crosswordContent,
  bee: beeContent,
  daily: dailyContent,
  anagram: anagramContent,
}
