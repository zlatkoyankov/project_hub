// Language versions of Letterwell and their metadata. Each language has its own URL:
// English at /letterwell/, Bulgarian at /letterwell/bg/. Used by the app and the prerender.
export type Language = 'en' | 'bg'

export const languages: Language[] = ['en', 'bg']

/** Path of the Letterwell page in a language (relative to the site root). */
export function languagePath(language: Language): string {
  return language === 'bg' ? '/letterwell/bg/' : '/letterwell/'
}

/** Language from a URL path: /letterwell/bg/ is Bulgarian, everything else English. */
export function languageFromPath(path: string): Language {
  return /\/bg\/?$/.test(path) ? 'bg' : 'en'
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

