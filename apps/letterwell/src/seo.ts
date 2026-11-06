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
export type Page = 'finder' | 'wordle' | 'crossword' | 'bee' | 'daily'

export const pages: Page[] = ['finder', 'wordle', 'crossword', 'bee', 'daily']

/** Languages a page exists in: the daily word game is Bulgarian only. */
export function pageLanguages(page: Page): Language[] {
  return page === 'daily' ? ['bg'] : languages
}

/** Path of a Letterwell page in a language, e.g. /letterwell/wordle-solver/ and /letterwell/bg/wordle/. */
export function pagePath(page: Page, language: Language): string {
  if (page === 'finder') return languagePath(language)
  if (page === 'daily') return '/letterwell/bg/duma-na-denya/'
  if (page === 'bee') return language === 'bg' ? '/letterwell/bg/spelling-bee/' : '/letterwell/spelling-bee-solver/'
  if (page === 'crossword') return language === 'bg' ? '/letterwell/bg/krastoslovitsi/' : '/letterwell/crossword-solver/'
  return language === 'bg' ? '/letterwell/bg/wordle/' : '/letterwell/wordle-solver/'
}

/** Page from a URL path. */
export function pageFromPath(path: string): Page {
  if (/\/duma-na-denya\/?$/.test(path)) return 'daily'
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
    title: 'Думи от букви: търсачка за български думи | Letterwell',
    description: 'Намери български думи от зададени букви, използвай филтри и разбъркай произволни букви. Провери точките си в Scrabble и Boggle.',
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
    title: 'Crossword Solver: Find Words by Pattern | Letterwell',
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
    description: 'Stuck on the Spelling Bee? Enter the centre letter and the six around it. Get hints by first letter and length, then reveal the words and pangrams when you are ready.',
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
  if (page === 'daily') return { meta: dailyMetadata, social: dailySocialDescription }
  if (page === 'bee') return { meta: beeMetadata[language], social: beeSocialDescriptions[language] }
  if (page === 'crossword') return { meta: crosswordMetadata[language], social: crosswordSocialDescriptions[language] }
  return page === 'wordle'
    ? { meta: wordleMetadata[language], social: wordleSocialDescriptions[language] }
    : { meta: seoMetadata[language], social: socialDescriptions[language] }
}

export const dailySocialDescription = 'Познай думата от 5 букви с 6 опита. Една дума за цяла България, нова всеки ден. Сподели резултата, без да издаваш думата.'

export const dailyMetadata = {
  title: 'Дума на деня: българска игра на думи от 5 букви | Letterwell',
  description: 'Познай думата на деня от 5 букви с 6 опита, като в Wordle, но на български. Нова дума всеки ден в полунощ, статистика, серия и споделяне на резултата.',
  structuredDescription: 'Ежедневна игра на думи на български: познай думата от пет букви с шест опита.',
  features: ['Нова дума всеки ден', 'Български фонетичен клавиатурен ред', 'Статистика и серия', 'Споделяне без спойлери'],
}
