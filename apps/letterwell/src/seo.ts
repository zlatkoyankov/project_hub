// Language versions of Letterwell and their metadata. Each language has its own URL:
// English at /letterwell/, Bulgarian at /letterwell/bg/. Used by the app and the prerender.
export type Language = 'en' | 'bg'

export const languages: Language[] = ['en', 'bg']

/** Path of the Letterwell page in a language (relative to the site root). */
export function languagePath(language: Language): string {
  return language === 'bg' ? '/letterwell/bg/' : '/letterwell/'
}

/** Language from a URL path: anything under /letterwell/bg/ is Bulgarian, everything else English. */
export function languageFromPath(path: string): Language {
  return /\/letterwell\/bg(\/|$)/.test(path) ? 'bg' : 'en'
}

// Letterwell pages: the word finder and the Wordle, crossword and Spelling Bee helpers, each in both languages.
export type Page = 'finder' | 'wordle' | 'crossword' | 'bee' | 'daily' | 'hints' | 'anagram'

export const pages: Page[] = ['finder', 'wordle', 'crossword', 'bee', 'daily', 'hints', 'anagram']

/** Languages a page exists in (all of them, for now). */
export function pageLanguages(page: Page): Language[] {
  void page
  return languages
}

/** Path of a Letterwell page in a language, e.g. /letterwell/wordle-solver/ and /letterwell/bg/wordle/. */
export function pagePath(page: Page, language: Language): string {
  if (page === 'finder') return languagePath(language)
  if (page === 'daily') return language === 'bg' ? '/letterwell/bg/duma-na-denya/' : '/letterwell/daily/'
  if (page === 'hints') return language === 'bg' ? '/letterwell/bg/duma-na-denya/podskazki/' : '/letterwell/daily/hints/'
  if (page === 'anagram') return language === 'bg' ? '/letterwell/bg/anagrama-na-denya/' : '/letterwell/anagram/'
  if (page === 'bee') return language === 'bg' ? '/letterwell/bg/spelling-bee/' : '/letterwell/spelling-bee-solver/'
  if (page === 'crossword') return language === 'bg' ? '/letterwell/bg/krastoslovitsi/' : '/letterwell/crossword-solver/'
  return language === 'bg' ? '/letterwell/bg/wordle/' : '/letterwell/wordle-solver/'
}

/** Page from a URL path. */
export function pageFromPath(path: string): Page {
  if (/\/(duma-na-denya\/podskazki|daily\/hints)\/?$/.test(path)) return 'hints'
  if (/\/(anagrama-na-denya|anagram)\/?$/.test(path)) return 'anagram'
  if (/\/(duma-na-denya|daily)\/?$/.test(path)) return 'daily'
  if (/\/(spelling-bee-solver|spelling-bee)\/?$/.test(path)) return 'bee'
  if (/\/(crossword-solver|krastoslovitsi)\/?$/.test(path)) return 'crossword'
  return /\/wordle(-solver)?\/?$/.test(path) ? 'wordle' : 'finder'
}

/** Key of the page's sharing image on the hub (/og/<key>.png): the path without slashes. */
export function pageOgKey(page: Page, language: Language): string {
  return pagePath(page, language).replace(/^\/|\/$/g, '').replace(/\//g, '-')
}

export const socialDescriptions: Record<Language, string> = {
  en: 'Discover English words from your letters and compare Scrabble, Words With Friends, and Boggle scores.',
  bg: 'Откривай български думи от буквите си и проверявай точките за Scrabble и Boggle.',
}

export const seoMetadata: Record<Language, { title: string; description: string; structuredDescription: string; features: string[] }> = {
  en: {
    title: 'Letterwell | Find Words from Your Letters',
    description: 'Find English words from your letters with flexible word filters, random letter racks, and Scrabble, Words With Friends, or Boggle scores.',
    structuredDescription: 'An English word finder that makes words from supplied letters and calculates Scrabble, Words With Friends, and Boggle scores.',
    features: [
      'English word finder',
      'Letter position filters',
      'Random letter racks',
      'Scrabble score calculator',
      'Words With Friends score calculator',
      'Boggle score calculator',
    ],
  },
  bg: {
    title: 'Помощник за думи: думи от букви на български | Letterwell',
    description: 'Помощник за думи: намери български думи от зададени букви, по брой букви (например всички думи със 7 букви) и по позиция. Точки за Scrabble и Boggle.',
    structuredDescription: 'Българска търсачка за думи, която съставя думи от зададени букви и изчислява точки за Scrabble и Boggle.',
    features: [
      'Българска търсачка за думи',
      'Филтри по позиция на буквите',
      'Случайни комбинации от букви',
      'Калкулатор за точки в български Scrabble',
      'Калкулатор за точки в Boggle',
    ],
  },
}


export const wordleSocialDescriptions: Record<Language, string> = {
  en: 'Type your Wordle guesses, match the tile colours and see every possible answer plus the best next guess.',
  bg: 'Въведи опитите си в Wordle, оцвети буквите и виж всички възможни думи и най-добрия следващ опит.',
}

export const wordleMetadata: Record<Language, { title: string; description: string; structuredDescription: string; features: string[] }> = {
  en: {
    title: 'Wordle Solver & Helper: Narrow Down the Answer | Letterwell',
    description: 'Enter your Wordle guesses, tap the tiles to match the colours, and see every possible answer plus the best next guess. Free, no sign-up.',
    structuredDescription: 'A Wordle helper that lists the possible answers for your guesses and colour clues and suggests the next guess.',
    features: ['Wordle solver', 'Green, yellow and grey letter clues', 'Best next guess', 'Repeated letters handled'],
  },
  bg: {
    title: 'Wordle на български: помощник за отговора | Letterwell',
    description: 'Въведи опитите си в Wordle, оцвети буквите като в играта и виж всички възможни думи и най-добрия следващ опит. Безплатно, без регистрация.',
    structuredDescription: 'Помощник за Wordle на български, който показва възможните думи според опитите и цветовете и предлага следващ опит.',
    features: ['Помощник за Wordle на български', 'Зелени, жълти и сиви букви', 'Най-добър следващ опит', 'Повтарящи се букви'],
  },
}

export const crosswordSocialDescriptions: Record<Language, string> = {
  en: 'Type the letters you know and a ? for each gap, and see every word that fits your crossword.',
  bg: 'Въведи буквите, които знаеш, и ? за всяка празна, и виж всички думи, които пасват на кръстословицата.',
}

export const crosswordMetadata: Record<Language, { title: string; description: string; structuredDescription: string; features: string[] }> = {
  en: {
    title: 'Crossword Solver & Helper: Word Finder by Pattern | Letterwell',
    description: 'Stuck on a crossword clue? Type the letters you know, a ? for each gap, and see every word that fits. Filter by letters to include or leave out.',
    structuredDescription: 'A crossword helper that lists every English word matching a pattern of known letters and gaps.',
    features: ['Crossword pattern search', 'Letters to include', 'Letters to leave out', 'Links to dictionary definitions'],
  },
  bg: {
    title: 'Помощник за кръстословици: думи по шаблон | Letterwell',
    description: 'Заседна на кръстословица? Въведи буквите, които знаеш, и ? за всяка празна. Виж всички български думи, които пасват, и значенията им в речника.',
    structuredDescription: 'Помощник за кръстословици, който показва всички български думи по шаблон от известни букви и празни места.',
    features: ['Търсене на думи по шаблон', 'Букви, които трябва да има', 'Букви, които да няма', 'Линкове към тълковен речник'],
  },
}

export const beeSocialDescriptions: Record<Language, string> = {
  en: 'Enter the seven letters of today’s Spelling Bee: hints by first letter and length first, then every word and pangram when you want them.',
  bg: 'Въведи седемте букви на Spelling Bee: първо подсказки по първа буква и дължина, после всички думи и панграми, когато поискаш.',
}

export const beeMetadata: Record<Language, { title: string; description: string; structuredDescription: string; features: string[] }> = {
  en: {
    title: 'Spelling Bee Solver & Hints: Words and Pangrams | Letterwell',
    description: 'Stuck on the Spelling Bee? Enter the centre letter and the six around it. Get hints by first letter and length, then reveal the words and pangrams.',
    structuredDescription: 'A Spelling Bee helper that lists words made from seven letters that always use the centre letter, with spoiler-free hints and pangrams.',
    features: ['Spoiler-free hint grid', 'Two-letter starts', 'Pangram finder', 'Points total'],
  },
  bg: {
    title: 'Помощник за Spelling Bee: подсказки, думи и панграми | Letterwell',
    description: 'Въведи централната буква и шестте около нея. Виж подсказки по първа буква и дължина, а после думите и панграмите, когато поискаш. На английски и български.',
    structuredDescription: 'Помощник за Spelling Bee, който показва думите от седем букви с централната буква, с подсказки без спойлери и панграми.',
    features: ['Таблица с подсказки', 'Първи две букви', 'Панграми', 'Точки'],
  },
}

/** Head metadata of any Letterwell page. */
export function pageMeta(page: Page, language: Language) {
  if (page === 'hints') return { meta: hintsMetadata[language], social: hintsSocialDescriptions[language] }
  if (page === 'anagram') return { meta: anagramMetadata[language], social: anagramSocialDescriptions[language] }
  if (page === 'daily') return { meta: dailyMetadata[language], social: dailySocialDescriptions[language] }
  if (page === 'bee') return { meta: beeMetadata[language], social: beeSocialDescriptions[language] }
  if (page === 'crossword') return { meta: crosswordMetadata[language], social: crosswordSocialDescriptions[language] }
  return page === 'wordle'
    ? { meta: wordleMetadata[language], social: wordleSocialDescriptions[language] }
    : { meta: seoMetadata[language], social: socialDescriptions[language] }
}

export const dailySocialDescriptions: Record<Language, string> = {
  bg: 'Познай думата от 5 букви с 6 опита. Една дума за цяла България, нова всеки ден. Сподели резултата, без да издаваш думата.',
  en: 'Find the five-letter word in six tries. A new word every day, an unlimited mode, and a spoiler-free result to share.',
}

export const dailyMetadata: Record<Language, { title: string; description: string; structuredDescription: string; features: string[] }> = {
  bg: {
    title: 'Дума на деня: българска игра на думи от 5 букви | Letterwell',
    description: 'Познай думата на деня от 5 букви с 6 опита. Нова дума всеки ден в полунощ, подсказки без спойлери, режим „Неограничено“, статистика и серия.',
    structuredDescription: 'Ежедневна игра на думи на български: познай думата от пет букви с шест опита.',
    features: ['Нова дума всеки ден', 'Подсказки без спойлери', 'Режим „Неограничено“', 'Български фонетичен клавиатурен ред', 'Статистика и серия', 'Споделяне без спойлери'],
  },
  en: {
    title: 'Letterwell Daily: a free five-letter word game | Letterwell',
    description: 'Find the five-letter word in six tries. A new word every day, an unlimited mode for more games, streaks and statistics, and a spoiler-free result to share.',
    structuredDescription: 'A daily five-letter word game with an unlimited mode, streaks and shareable results.',
    features: ['A new word every day', 'Unlimited mode', 'Streaks and statistics', 'Spoiler-free sharing'],
  },
}

export const hintsSocialDescriptions: Record<Language, string> = {
  bg: 'Подсказки за днешната Дума на деня, една по една: гласни, повтаряща се буква, първа и последна буква. Думата само ако я поискаш.',
  en: 'Hints for today’s Letterwell Daily, one at a time: vowels, a repeated letter, the first and last letter. The word only if you ask.',
}

export const hintsMetadata: Record<Language, { title: string; description: string; structuredDescription: string; features: string[] }> = {
  bg: {
    title: 'Дума на деня: подсказки за днешната дума | Letterwell',
    description: 'Подсказки за днешната Дума на деня от 5 букви, една по една и без спойлери: брой гласни, повтаряща се буква, първа и последна буква. Плюс вчерашната дума.',
    structuredDescription: 'Подсказки без спойлери за ежедневната българска игра на думи от пет букви.',
    features: ['Четири подсказки една по една', 'Думата само при поискване', 'Вчерашната дума с речник', 'Съвети за по-бързо познаване'],
  },
  en: {
    title: 'Letterwell Daily hints: clues for today’s word | Letterwell',
    description: 'Spoiler-free hints for today’s five-letter Letterwell Daily word, one at a time: vowels, a repeated letter, the first and last letter. Plus yesterday’s word.',
    structuredDescription: 'Spoiler-free hints for the Letterwell Daily five-letter word game.',
    features: ['Four hints, one at a time', 'The word only on request', 'Yesterday’s word with dictionary links', 'Tips to solve faster'],
  },
}

export const anagramSocialDescriptions: Record<Language, string> = {
  bg: 'Шест разбъркани букви, една дума. Нова анаграма всеки ден, с подсказки по желание и серия.',
  en: 'Six shuffled letters, one word. A new anagram every day, with optional hints and a streak.',
}

export const anagramMetadata: Record<Language, { title: string; description: string; structuredDescription: string; features: string[] }> = {
  bg: {
    title: 'Анаграма на деня: подреди буквите и познай думата | Letterwell',
    description: 'Безплатна игра на думи на български: всеки ден шест разбъркани букви и една дума. Подсказки по желание, серия и вчерашната дума с речник.',
    structuredDescription: 'Ежедневна игра с анаграми на български: подреди шест букви в дума.',
    features: ['Нова дума от 6 букви всеки ден', 'Три подсказки по желание', 'Серия и статистика', 'Вчерашната дума с речник'],
  },
  en: {
    title: 'Letterwell Anagram: daily word scramble | Letterwell',
    description: 'A free daily anagram game: six shuffled letters, one word. Optional hints, a streak, and yesterday’s word with a dictionary link.',
    structuredDescription: 'A daily anagram game: put six letters in order to make the word.',
    features: ['A new six-letter word every day', 'Three optional hints', 'Streak and stats', 'Yesterday’s word with a dictionary link'],
  },
}
