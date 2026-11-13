import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { ANAGRAM_WORDS, anagramFor, anagramHints, anagramShareText, checkGuess, currentAnagramStreak, dailyScramble, emptyAnagramStats, recordAnagram, sameLetters, scramble } from './anagram'
import { DAILY_WORDS } from './daily'

const dictionary = (file: string) => new Set(readFileSync(new URL(`../public/${file}`, import.meta.url), 'utf8').split(/\r?\n/))
const BG = dictionary('bulgarian-words.txt')
const EN = dictionary('english-words.txt')

describe('word lists', () => {
  it('has only six-letter dictionary words, no repeats, none of them a daily answer', () => {
    for (const [language, words, dict] of [['bg', ANAGRAM_WORDS.bg, BG], ['en', ANAGRAM_WORDS.en, EN]] as const) {
      expect(new Set(words).size).toBe(words.length)
      for (const word of words) {
        expect(word, `${language} ${word}`).toHaveLength(6)
        expect(dict.has(word), `${language} ${word} in dictionary`).toBe(true)
        expect(DAILY_WORDS[language].includes(word)).toBe(false)
      }
    }
    expect(ANAGRAM_WORDS.bg.length).toBeGreaterThanOrEqual(140)
    expect(ANAGRAM_WORDS.en.length).toBeGreaterThanOrEqual(150)
  })

  it('cycles through the list', () => {
    const count = ANAGRAM_WORDS.bg.length
    expect(anagramFor(1, 'bg')).toBe(ANAGRAM_WORDS.bg[0])
    expect(anagramFor(count + 1, 'bg')).toBe(ANAGRAM_WORDS.bg[0])
  })
})

describe('scramble', () => {
  it('keeps the letters and never returns the word itself', () => {
    for (let puzzle = 1; puzzle <= 400; puzzle += 1) {
      for (const language of ['bg', 'en'] as const) {
        const word = anagramFor(puzzle, language)
        const letters = dailyScramble(puzzle, language)
        expect(sameLetters(letters.join(''), word)).toBe(true)
        expect(letters.join('')).not.toBe(word)
      }
    }
  })

  it('is the same for everyone on a day', () => {
    expect(dailyScramble(5, 'bg')).toEqual(dailyScramble(5, 'bg'))
    expect(scramble('аа')).toEqual(['а', 'а'])
  })
})

describe('checkGuess', () => {
  const isWord = (word: string) => BG.has(word)
  it('accepts the word and any other dictionary anagram', () => {
    expect(checkGuess('ракета', 'ракета', isWord)).toBe('solved')
    expect(checkGuess('карате', 'ракета', isWord)).toBe('other-word')
    expect(checkGuess('аракет', 'ракета', isWord)).toBe('not-a-word')
    expect(checkGuess('ракети', 'ракета', isWord)).toBe('wrong-letters')
  })
})

describe('stats and sharing', () => {
  it('counts streaks and clean solves', () => {
    let stats = recordAnagram(emptyAnagramStats(), 1, true, 0)
    stats = recordAnagram(stats, 2, true, 2)
    expect(stats).toMatchObject({ played: 2, solved: 2, streak: 2, maxStreak: 2, clean: 1 })
    expect(recordAnagram(stats, 2, true, 0)).toBe(stats)
    expect(currentAnagramStreak(stats, 3)).toBe(2)
    expect(currentAnagramStreak(stats, 4)).toBe(0)
    expect(recordAnagram(stats, 3, false, 3).streak).toBe(0)
  })

  it('shares without the word and gives hints from vague to specific', () => {
    expect(anagramShareText('Анаграма на деня № 5', true, 1, 'bg', 'zyankov.eu/anagrama')).toBe('Анаграма на деня № 5 ✅ с 1 подсказка\nzyankov.eu/anagrama')
    expect(anagramHints('ракета', 'bg')).toEqual(['Първата буква е Р.', 'Последната буква е А.', 'Започва с РАК.'])
  })
})
