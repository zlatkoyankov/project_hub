import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import { track } from '@zyankov/design-system/analytics'
import './App.css'
import './wordle.css'
import { beeHints, cleanBeeLetters, findBeeWords, MIN_LENGTH } from './bee'
import { getDictionary } from './dictionary'
import { beeMetadata, pagePath, type Language } from './seo'
import { MoreWordTools, ToolLinks } from './ToolNav'
import { EmptyArt, HeroDecor } from './Playful'
import { MeaningButton, MeaningPopover, type OpenMeaning } from './WordMeaning'

const copy = {
  en: {
    tagline: 'Spelling Bee helper',
    finder: 'Word finder',
    wordle: 'Wordle helper',
    crossword: 'Crosswords',
    eyebrow: 'SPELLING BEE HELPER',
    titleFirst: 'Seven letters.',
    titleEmphasis: 'How many words?',
    description: 'Enter the centre letter and the six around it. Start with hints that do not spoil the puzzle, and reveal the words only when you want them.',
    lettersTitle: 'Your letters',
    lettersHint: 'Centre letter plus six more',
    centreLabel: 'CENTRE LETTER',
    outerLabel: 'OTHER SIX LETTERS',
    outerPlaceholder: 'e.g. lpcire',
    example: 'TRY',
    results: 'Results',
    resultsHint: `Words of ${MIN_LENGTH}+ letters that use the centre letter. Letters can repeat.`,
    hints: 'Hints',
    answers: 'Show words',
    hide: 'Hide words',
    words: 'words',
    points: 'points',
    pangrams: 'pangrams',
    gridTitle: 'Words by first letter and length',
    startsTitle: 'Two-letter starts',
    total: 'Σ',
    pangram: 'pangram',
    loading: 'Loading the dictionary…',
    startTitle: 'Enter your seven letters',
    startText: 'Type the centre letter and the six letters around it.',
    noneTitle: 'No words found',
    noneText: 'Check the letters. The centre letter must be in every word.',
    error: 'Something went wrong',
    guideTitle: 'How the Spelling Bee helper works',
    guide: [
      'Every word in the dictionary with at least four letters is checked: it must contain the centre letter and no letters other than your seven. Letters can be used more than once. A pangram uses all seven letters.',
      'Points follow the usual Spelling Bee rule: one point for a four-letter word, one point per letter for longer words, and seven extra for a pangram. Our dictionary is much larger than the list used by the daily puzzle, so you will see rare words that the game does not accept.',
    ],
  },
  bg: {
    tagline: 'Помощник за Spelling Bee',
    finder: 'Търсачка за думи',
    wordle: 'Помощник за Wordle',
    crossword: 'Кръстословици',
    eyebrow: 'ПОМОЩНИК ЗА SPELLING BEE',
    titleFirst: 'Седем букви.',
    titleEmphasis: 'Колко думи?',
    description: 'Въведи централната буква и шестте около нея. Започни с подсказки, които не развалят играта, и покажи думите само когато поискаш.',
    lettersTitle: 'Твоите букви',
    lettersHint: 'Централна буква и още шест',
    centreLabel: 'ЦЕНТРАЛНА БУКВА',
    outerLabel: 'ДРУГИТЕ ШЕСТ БУКВИ',
    outerPlaceholder: 'например ктрнои',
    example: 'ПРОБВАЙ',
    results: 'Резултати',
    resultsHint: `Думи от ${MIN_LENGTH}+ букви с централната буква. Буквите може да се повтарят.`,
    hints: 'Подсказки',
    answers: 'Покажи думите',
    hide: 'Скрий думите',
    words: 'думи',
    points: 'точки',
    pangrams: 'панграми',
    gridTitle: 'Думи по първа буква и дължина',
    startsTitle: 'Първи две букви',
    total: 'Σ',
    pangram: 'панграма',
    loading: 'Зареждане на речника…',
    startTitle: 'Въведи седемте букви',
    startText: 'Напиши централната буква и шестте букви около нея.',
    noneTitle: 'Няма намерени думи',
    noneText: 'Провери буквите. Централната буква трябва да е във всяка дума.',
    error: 'Нещо се обърка',
    guideTitle: 'Как работи помощникът за Spelling Bee',
    guide: [
      'Проверява се всяка дума от речника с поне четири букви: трябва да съдържа централната буква и никакви други букви освен седемте. Буквите може да се повтарят. Панграма е дума, която ползва и седемте букви.',
      'Точките са по обичайното правило: една точка за дума от четири букви, по една точка на буква за по-дългите и седем точки отгоре за панграма. Речникът има и форми като членувани съществителни и множествено число.',
    ],
  },
}

const EXAMPLES: Record<Language, { centre: string; outer: string }> = {
  en: { centre: 'a', outer: 'lpcire' },
  bg: { centre: 'а', outer: 'ктрнои' },
}

function BeeSolver({ language }: { language: Language }) {
  const text = copy[language]
  const locale = language === 'bg' ? 'bg-BG' : 'en'
  const upper = (value: string) => value.toLocaleUpperCase(locale)
  const [words, setWords] = useState<string[] | null>(null)
  const [error, setError] = useState('')
  const [centre, setCentre] = useState('')
  const [outer, setOuter] = useState('')
  const [reveal, setReveal] = useState(false)
  const [openMeaning, setOpenMeaning] = useState<OpenMeaning | null>(null)
  const closeMeaning = useCallback(() => setOpenMeaning(null), [])
  const [tracked, setTracked] = useState(false)

  useEffect(() => {
    document.documentElement.lang = language
    document.title = beeMetadata[language].title
  }, [language])

  useEffect(() => {
    let active = true
    getDictionary(language)
      .then((loaded) => { if (active) setWords(loaded) })
      .catch((loadError: unknown) => { if (active) setError(loadError instanceof Error ? loadError.message : text.error) })
    return () => { active = false }
  }, [language, text.error])

  const query = useDeferredValue({ centre, outer: [...outer].filter((char) => char !== centre).join('') })
  const ready = query.centre.length === 1 && query.outer.length === 6
  const found = useMemo(() => (words && ready ? findBeeWords(words, query.centre, query.outer) : []), [words, ready, query])
  const hints = useMemo(() => beeHints(found), [found])
  const byLength = useMemo(() => {
    const groups = new Map<number, typeof found>()
    for (const item of found) groups.set(item.word.length, [...(groups.get(item.word.length) ?? []), item])
    return [...groups]
  }, [found])

  function changed() {
    setReveal(false)
    setOpenMeaning(null)
    if (!tracked) {
      setTracked(true)
      // Only that the tool was used, never the letters.
      track('bee_search', { language })
    }
  }

  const honeycomb = [query.centre, ...query.outer.padEnd(6, ' ')]

  return (
    <div className="app-shell wordle-page bee-page">
      <header className="topbar">
        <a className="brand" href={pagePath('finder', language)} aria-label="Letterwell">
          <span className="brand-mark"><Sparkles size={18} strokeWidth={2.2} /></span>
          <span>letterwell</span>
        </a>
        <div className="topbar-actions">
          <div className="topbar-note"><span className="status-dot" />{text.tagline}</div>
          <ToolLinks language={language} current="bee" />
          <label className="language-picker">
            <span className="sr-only">{language === 'bg' ? 'Език' : 'Language'}</span>
            <select value={language} onChange={(event) => window.location.assign(pagePath('bee', event.target.value as Language))} aria-label={language === 'bg' ? 'Език' : 'Language'}>
              <option value="en">EN</option>
              <option value="bg">БГ</option>
            </select>
          </label>
        </div>
      </header>

      <main id="top">
        <section className="wordle-intro" aria-labelledby="page-title">
          <HeroDecor variant="bee" language={language} />
          <p className="eyebrow"><span className="eyebrow-line" />{text.eyebrow}<span className="eyebrow-line" /></p>
          <h1 id="page-title">{text.titleFirst} <em>{text.titleEmphasis}</em></h1>
          <p className="intro-description">{text.description}</p>
        </section>

        <section className="workspace" aria-label={text.tagline}>
          <div className="controls">
            <div className="control-heading">
              <span className="step-number">01</span>
              <div><h2>{text.lettersTitle}</h2><p>{text.lettersHint}</p></div>
            </div>

            <form className="guess-entry bee-form" onSubmit={(event) => event.preventDefault()}>
              <div className="bee-inputs">
                <label>
                  <span className="field-label">{text.centreLabel}</span>
                  <input className="letters-input bee-centre-input" autoComplete="off" autoCapitalize="none" spellCheck={false} maxLength={1}
                    value={centre} onChange={(event) => { setCentre(cleanBeeLetters(event.target.value, language, 1)); changed() }} />
                </label>
                <label>
                  <span className="field-label">{text.outerLabel}</span>
                  <input className="letters-input" autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder={text.outerPlaceholder}
                    value={outer} onChange={(event) => { setOuter(cleanBeeLetters(event.target.value, language, 7)); changed() }} />
                </label>
              </div>
              <div className="honeycomb" aria-hidden="true">
                {honeycomb.map((char, index) => (
                  <span key={index} className={`hex hex-${index}${index === 0 ? ' is-centre' : ''}${char.trim() ? '' : ' is-empty'}`}>{upper(char.trim())}</span>
                ))}
              </div>
            </form>

            <div className="examples openers">
              <span>{text.example}</span>
              <button className="example-button zy-key" type="button" onClick={() => { setCentre(EXAMPLES[language].centre); setOuter(EXAMPLES[language].outer); changed() }}>
                {upper(EXAMPLES[language].centre)} + {upper(EXAMPLES[language].outer)}
              </button>
            </div>
          </div>

          <section className="results" aria-live="polite" aria-busy={!words && !error}>
            <div className="control-heading">
              <span className="step-number">02</span>
              <div><h2>{text.results}</h2><p>{text.resultsHint}</p></div>
            </div>

            {error ? (
              <div className="empty-state error-state"><span className="empty-spark">!</span><h3>{text.error}</h3><p>{error}</p></div>
            ) : !words ? (
              <div className="empty-state"><span className="loading-orbit"><span /></span><h3>{text.loading}</h3></div>
            ) : !ready ? (
              <div className="empty-state"><EmptyArt variant="bee" language={language} /><h3>{text.startTitle}</h3><p>{text.startText}</p></div>
            ) : found.length === 0 ? (
              <div className="empty-state"><span className="empty-spark">?</span><h3>{text.noneTitle}</h3><p>{text.noneText}</p></div>
            ) : (
              <>
                <div className="bee-stats">
                  <span><strong>{hints.total.toLocaleString(locale)}</strong> {text.words}</span>
                  <span><strong>{hints.points.toLocaleString(locale)}</strong> {text.points}</span>
                  <span><strong>{hints.pangrams}</strong> {text.pangrams}</span>
                </div>

                <h3 className="bee-subtitle">{text.gridTitle}</h3>
                <div className="bee-grid-wrap">
                  <table className="bee-grid">
                    <thead><tr><th scope="col" />{hints.lengths.map((length) => <th scope="col" key={length}>{length}</th>)}<th scope="col">{text.total}</th></tr></thead>
                    <tbody>
                      {[...hints.grid].map(([letter, row]) => (
                        <tr key={letter}>
                          <th scope="row">{upper(letter)}</th>
                          {hints.lengths.map((length) => <td key={length}>{row.get(length) ?? '–'}</td>)}
                          <td className="bee-sum">{[...row.values()].reduce((sum, count) => sum + count, 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 className="bee-subtitle">{text.startsTitle}</h3>
                <p className="bee-starts">{hints.starts.map(([start, count]) => <span key={start}>{upper(start)}-{count}</span>)}</p>

                <button type="button" className="text-action bee-reveal" aria-expanded={reveal} onClick={() => { setReveal((value) => !value); setOpenMeaning(null) }}>
                  {reveal ? <EyeOff size={15} /> : <Eye size={15} />} {reveal ? text.hide : text.answers}
                </button>

                {reveal && byLength.map(([length, items]) => (
                  <div className="bee-group" key={length}>
                    <h3 className="bee-subtitle">{length} · {items.length}</h3>
                    <div className="answer-list">
                      {items.map((item) => (
                        <span className={`answer-word${item.pangram ? ' is-pangram' : ''}`} key={item.word} title={item.pangram ? text.pangram : undefined}>
                          {item.pangram && <span aria-hidden="true">★ </span>}{item.word}
                          <MeaningButton word={item.word} language={language} available onOpen={setOpenMeaning} />
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </section>
        </section>

        {openMeaning && <MeaningPopover key={openMeaning.word} open={openMeaning} language={language} onClose={closeMeaning} linksOnly />}

        <section className="tool-guide" aria-labelledby="tool-guide-title">
          <h2 id="tool-guide-title">{text.guideTitle}</h2>
          {text.guide.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
        <MoreWordTools language={language} current="bee" />
      </main>
    </div>
  )
}

export default BeeSolver
