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

// Letterwell pages: the word finder and the Wordle helper, each in both languages.
export type Page = 'finder' | 'wordle'

export const pages: Page[] = ['finder', 'wordle']

/** Path of a Letterwell page in a language: /letterwell/wordle-solver/ and /letterwell/bg/wordle/. */
export function pagePath(page: Page, language: Language): string {
  if (page === 'finder') return languagePath(language)
  return language === 'bg' ? '/letterwell/bg/wordle/' : '/letterwell/wordle-solver/'
}

/** Page from a URL path. */
export function pageFromPath(path: string): Page {
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

/** Head metadata of any Letterwell page. */
export function pageMeta(page: Page, language: Language) {
  return page === 'wordle'
    ? { meta: wordleMetadata[language], social: wordleSocialDescriptions[language] }
    : { meta: seoMetadata[language], social: socialDescriptions[language] }
}
