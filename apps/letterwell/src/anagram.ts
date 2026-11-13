// "Анаграма на деня" / "Letterwell Anagram": one six-letter word a day with its letters shuffled.
// Puzzle numbers follow the daily word game (same EPOCH and Sofia midnight, see daily.ts), but the
// words are six letters long, so an anagram never gives away a daily answer.
// The lists repeat after their length: append new words at the end only, never reorder them.
// Every word was checked against the Letterwell dictionaries (bulgarian-words.txt, english-words.txt).
import type { Language } from './seo'

export const ANAGRAM_WORDS_BG: readonly string[] = [
  'мравка', 'аптека', 'вентил', 'барман', 'завеса', 'сирене', 'футбол', 'мрамор', 'ливада', 'ракета',
  'ножица', 'камина', 'китара', 'погача', 'доктор', 'плочка', 'долина', 'щъркел', 'учител', 'въздух',
  'лопата', 'звезда', 'машина', 'морков', 'събота', 'брашно', 'въпрос', 'малина', 'фъстък', 'стъкло',
  'ябълка', 'вечеря', 'пижама', 'паркет', 'въглен', 'сандал', 'пътека', 'кафене', 'бункер', 'топола',
  'поезия', 'глобус', 'пастир', 'лъжица', 'кадаиф', 'монета', 'подпис', 'касиер', 'бойлер', 'раница',
  'войник', 'лисица', 'сграда', 'врабче', 'спомен', 'гривна', 'бонбон', 'пътник', 'пещера', 'кошара',
  'камера', 'комета', 'площад', 'година', 'бягане', 'матрак', 'задача', 'гребен', 'компот', 'мостче',
  'мотика', 'космос', 'грозде', 'музика', 'оценка', 'череша', 'ученик', 'обущар', 'буркан', 'колбас',
  'иглика', 'мекица', 'победа', 'шофьор', 'театър', 'ограда', 'делфин', 'басейн', 'влакче', 'желязо',
  'камила', 'вилица', 'лодкар', 'гранит', 'баница', 'сметка', 'поляна', 'сестра', 'звънец', 'шахмат',
  'сватба', 'платно', 'пролет', 'магаре', 'корона', 'сутрин', 'внучка', 'стълба', 'чайник', 'балкон',
  'готвач', 'пудинг', 'салата', 'неделя', 'одеяло', 'лешник', 'кокиче', 'сладко', 'минута', 'гребло',
  'сребро', 'царица', 'радост', 'остров', 'снимка', 'колело', 'обувка', 'хартия', 'бизнес', 'кравай',
  'църква', 'чаршаф', 'патица', 'кайсия', 'новина', 'спанак', 'картоф', 'кремък', 'спалня', 'пелети',
  'компас', 'слънце', 'покрив',
]

export const ANAGRAM_WORDS_EN: readonly string[] = [
  'waffle', 'magnet', 'cradle', 'pickle', 'copper', 'family', 'violin', 'puzzle', 'galaxy', 'thread',
  'melody', 'kettle', 'ladder', 'basket', 'pebble', 'valley', 'market', 'pirate', 'spring', 'potato',
  'planet', 'beetle', 'puppet', 'needle', 'singer', 'garlic', 'jungle', 'guitar', 'bakery', 'travel',
  'ribbon', 'sponge', 'poster', 'saucer', 'walnut', 'silver', 'teapot', 'doctor', 'temple', 'autumn',
  'pocket', 'pillow', 'candle', 'collar', 'bottle', 'glider', 'artist', 'yogurt', 'mitten', 'rattle',
  'prince', 'cheese', 'pigeon', 'noodle', 'island', 'finger', 'pepper', 'coffee', 'jacket', 'squash',
  'hammer', 'fossil', 'throne', 'pencil', 'garden', 'oyster', 'sunset', 'velvet', 'harbor', 'paddle',
  'winter', 'stream', 'street', 'ticket', 'summit', 'clover', 'cherry', 'tomato', 'wallet', 'wizard',
  'turtle', 'cotton', 'peanut', 'shadow', 'shovel', 'camera', 'hunter', 'cannon', 'voyage', 'goblet',
  'gravel', 'monkey', 'statue', 'drawer', 'saddle', 'orange', 'socket', 'carpet', 'falcon', 'golden',
  'circle', 'yellow', 'string', 'mirror', 'helmet', 'rabbit', 'parrot', 'tablet', 'muffin', 'bishop',
  'bridge', 'carrot', 'castle', 'spider', 'frozen', 'timber', 'crayon', 'kitten', 'letter', 'bucket',
  'dinner', 'school', 'spirit', 'sleeve', 'farmer', 'button', 'tunnel', 'anchor', 'window', 'butter',
  'forest', 'engine', 'wonder', 'winner', 'sister', 'insect', 'cookie', 'branch', 'palace', 'cactus',
  'meadow', 'parade', 'flower', 'rocket', 'zipper', 'number', 'summer', 'office', 'cattle', 'lizard',
  'friend', 'dragon', 'breeze', 'banana',
]

export const ANAGRAM_WORDS: Record<Language, readonly string[]> = { bg: ANAGRAM_WORDS_BG, en: ANAGRAM_WORDS_EN }

export function anagramFor(puzzle: number, language: Language): string {
  const words = ANAGRAM_WORDS[language]
  const count = words.length
  return words[(((puzzle - 1) % count) + count) % count]
}

/** A small seeded random generator (mulberry32), so every player gets the same shuffle for a puzzle. */
function seeded(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** The letters of a word in an order that is not the word itself. With a seed the order is the same
 *  for everyone (the daily puzzle); "Разбъркай" passes Math.random instead. */
export function scramble(word: string, random: () => number = Math.random): string[] {
  const letters = [...word]
  if (new Set(letters).size < 2) return letters
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const next = [...letters]
    for (let i = next.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1))
      ;[next[i], next[j]] = [next[j], next[i]]
    }
    if (next.join('') !== word) return next
  }
  return [...letters.slice(1), letters[0]]
}

export const dailyScramble = (puzzle: number, language: Language) =>
  scramble(anagramFor(puzzle, language), seeded(puzzle * 7919 + (language === 'bg' ? 1 : 2)))

const sorted = (word: string) => [...word].sort().join('')

/** Whether a guess uses exactly the letters of the answer. */
export const sameLetters = (guess: string, answer: string) => guess.length === answer.length && sorted(guess) === sorted(answer)

export type GuessResult = 'solved' | 'other-word' | 'not-a-word' | 'wrong-letters'

/** Checks a guess. Any dictionary word made of the same letters counts as solved ("other-word"),
 *  because the letters alone cannot tell which of them was meant. */
export function checkGuess(guess: string, answer: string, isWord: (word: string) => boolean): GuessResult {
  if (!sameLetters(guess, answer)) return 'wrong-letters'
  if (guess === answer) return 'solved'
  return isWord(guess) ? 'other-word' : 'not-a-word'
}

/** Hints from vaguest to the word itself. */
export function anagramHints(answer: string, language: Language): string[] {
  const upper = (letter: string) => letter.toLocaleUpperCase(language === 'bg' ? 'bg-BG' : 'en-GB')
  return language === 'bg'
    ? [`Първата буква е ${upper(answer[0])}.`, `Последната буква е ${upper(answer[answer.length - 1])}.`, `Започва с ${upper(answer.slice(0, 3))}.`]
    : [`It starts with ${upper(answer[0])}.`, `It ends with ${upper(answer[answer.length - 1])}.`, `It starts with ${upper(answer.slice(0, 3))}.`]
}

export interface AnagramStats {
  played: number
  solved: number
  streak: number
  maxStreak: number
  /** Puzzles solved without any hint. */
  clean: number
  lastPuzzle: number
  lastSolved: number
}

export const emptyAnagramStats = (): AnagramStats => ({ played: 0, solved: 0, streak: 0, maxStreak: 0, clean: 0, lastPuzzle: 0, lastSolved: 0 })

/** Stats after finishing a puzzle (solved, or given up with "Покажи думата"); twice changes nothing. */
export function recordAnagram(stats: AnagramStats, puzzle: number, solved: boolean, hints: number): AnagramStats {
  if (stats.lastPuzzle >= puzzle) return stats
  const next = { ...stats, played: stats.played + 1, lastPuzzle: puzzle }
  if (solved) {
    next.solved += 1
    next.streak = stats.lastSolved === puzzle - 1 ? stats.streak + 1 : 1
    next.maxStreak = Math.max(next.maxStreak, next.streak)
    if (hints === 0) next.clean += 1
    next.lastSolved = puzzle
  } else {
    next.streak = 0
  }
  return next
}

export const currentAnagramStreak = (stats: AnagramStats, puzzle: number) => (stats.lastSolved >= puzzle - 1 ? stats.streak : 0)

/** Share text without the word: "Анаграма на деня № 5 ✅ без подсказки". */
export function anagramShareText(heading: string, solved: boolean, hints: number, language: Language, url: string): string {
  const result = language === 'bg'
    ? (solved ? `✅ ${hints === 0 ? 'без подсказки' : `с ${hints} ${hints === 1 ? 'подсказка' : 'подсказки'}`}` : '❌ не я познах')
    : (solved ? `✅ ${hints === 0 ? 'no hints' : `${hints} ${hints === 1 ? 'hint' : 'hints'}`}` : '❌ gave up')
  return `${heading} ${result}\n${url}`
}
