// Navigation shared by every Letterwell page: links to the other word tools in the top bar,
// and a "More word tools" block at the end of the page.
import { pagePath, type Language, type Page } from './seo'

const TOOLS: { page: Page; name: Record<Language, string>; short: Record<Language, string>; description: Record<Language, string> }[] = [
  {
    page: 'finder',
    name: { en: 'Word finder', bg: 'Търсачка за думи' },
    short: { en: 'Word finder', bg: 'Търсачка' },
    description: { en: 'Make words from your letters, with filters and exact anagrams.', bg: 'Думи от твоите букви, с филтри и точни анаграми.' },
  },
  {
    page: 'wordle',
    name: { en: 'Wordle helper', bg: 'Помощник за Wordle' },
    short: { en: 'Wordle', bg: 'Wordle' },
    description: { en: 'Tap your colours and see every answer that still fits.', bg: 'Оцвети плочките и виж думите, които още пасват.' },
  },
  {
    page: 'crossword',
    name: { en: 'Crossword helper', bg: 'Помощник за кръстословици' },
    short: { en: 'Crosswords', bg: 'Кръстословици' },
    description: { en: 'Known letters and gaps: every word that fits the squares.', bg: 'Известни букви и празни: всички думи, които пасват.' },
  },
  {
    page: 'bee',
    name: { en: 'Spelling Bee helper', bg: 'Помощник за Spelling Bee' },
    short: { en: 'Spelling Bee', bg: 'Spelling Bee' },
    description: { en: 'Seven letters: spoiler-free hints, then the words and pangrams.', bg: 'Седем букви: подсказки без спойлери, после думите.' },
  },
]

/** Top-bar links to the other Letterwell tools. */
export function ToolLinks({ language, current }: { language: Language; current: Page }) {
  return (
    <nav className="tool-links" aria-label={language === 'bg' ? 'Инструменти за думи' : 'Word tools'}>
      {TOOLS.filter((tool) => tool.page !== current).map((tool) => (
        <a className="topbar-link" key={tool.page} href={pagePath(tool.page, language)}>{tool.short[language]}</a>
      ))}
    </nav>
  )
}

/** "More word tools" cards at the end of a page; on phones this is the main way between the tools. */
export function MoreWordTools({ language, current }: { language: Language; current: Page }) {
  return (
    <section className="more-tools" aria-labelledby="more-tools-title">
      <h2 id="more-tools-title">{language === 'bg' ? 'Още инструменти за думи' : 'More word tools'}</h2>
      <ul>
        {TOOLS.filter((tool) => tool.page !== current).map((tool) => (
          <li key={tool.page}>
            <a href={pagePath(tool.page, language)}>
              <strong>{tool.name[language]}</strong>
              <span>{tool.description[language]}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
