// The full Letterwell dictionaries (english-words.txt, bulgarian-words.txt), loaded once per language.
import type { Language } from './seo'

const dictionaryPromises: Partial<Record<Language, Promise<string[]>>> = {}

export function getDictionary(language: Language) {
  if (!dictionaryPromises[language]) {
    dictionaryPromises[language] = fetch(`${import.meta.env.BASE_URL}${language === 'bg' ? 'bulgarian-words.txt' : 'english-words.txt'}`)
      .then((response) => {
        if (!response.ok) throw new Error(language === 'bg' ? 'Българският речник не може да бъде зареден.' : 'We could not load the dictionary.')
        return response.text()
      })
      .then((text) => text.split(/\r?\n/).filter((word) => language === 'bg' ? /^[а-я]+$/i.test(word) : /^[a-z]+$/.test(word)))
      .catch((error: unknown) => {
        delete dictionaryPromises[language]
        throw error
      })
  }

  return dictionaryPromises[language] as Promise<string[]>
}
