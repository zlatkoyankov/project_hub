import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { RotateCcw, Sparkles } from 'lucide-react'
import { track } from '@zyankov/design-system/analytics'
import './App.css'
import './wordle.css'
import { cleanLetters, cleanPattern, findMatches, MAX_PATTERN } from './crossword'
import { getDictionary } from './dictionary'
import { crosswordMetadata, pagePath, type Language } from './seo'
import { MeaningButton, MeaningPopover, type OpenMeaning } from './WordMeaning'

const PAGE_SIZE = 200

const copy = {
  en: {
    tagline: 'Crossword helper',
    finder: 'Word finder',
    wordle: 'Wordle helper',
    eyebrow: 'CROSSWORD HELPER',
    titleFirst: 'Missing a few letters?',
    titleEmphasis: 'Fill the gaps.',
    description: 'Type the letters you know and a ? for each empty square. See every word that fits, then look up its meaning.',
    patternTitle: 'Your pattern',
    patternHint: 'One character per square',
    patternLabel: 'LETTERS AND GAPS',
    placeholder: 'e.g. c?o?s',
    gapsHint: 'Use ? or _ for an unknown letter.',
    includeLabel: 'MUST CONTAIN',
    includePlaceholder: 'letters anywhere',
    excludeLabel: 'LEAVE OUT',
    excludePlaceholder: 'letters already ruled out',
    clear: 'Clear',
    examples: 'TRY',
    letters: (count: number) => `${count} letters`,
    results: 'Matching words',
    resultsHint: 'Alphabetical. Tap ⓘ to look a word up in a dictionary.',
    loading: 'Loading the dictionary…',
    startTitle: 'Type a pattern',
    startText: 'For a five-letter word that starts with C and has O in the middle, type c?o??.',
    noneTitle: 'No word fits this pattern',
    noneText: 'Check the letters and the number of squares, or remove a letter from “Must contain”.',
    more: (count: number) => `Show ${count} more`,
    error: 'Something went wrong',
    guideTitle: 'How the crossword helper works',
    guide: [
      'Every word in the dictionary with the same number of letters is checked against your pattern. A word stays only if it has your letters in exactly those squares, contains every letter from “Must contain” and none of the letters from “Leave out”.',
      'The dictionary has about 274,000 English words, so you will also see rare words and plurals. Crossword answers can be phrases or names that are not in it.',
    ],
  },
  bg: {
    tagline: 'Помощник за кръстословици',
    finder: 'Търсачка за думи',
    wordle: 'Помощник за Wordle',
    eyebrow: 'ПОМОЩНИК ЗА КРЪСТОСЛОВИЦИ',
    titleFirst: 'Липсват ти букви?',
    titleEmphasis: 'Попълни празните.',
    description: 'Въведи буквите, които знаеш, и ? за всяко празно квадратче. Виж всички думи, които пасват, и значението им в речника.',
    patternTitle: 'Твоят шаблон',
    patternHint: 'По един знак за квадратче',
    patternLabel: 'БУКВИ И ПРАЗНИ',
    placeholder: 'например к?л??а',
    gapsHint: 'Сложи ? или _ за непозната буква.',
    includeLabel: 'ТРЯБВА ДА ИМА',
    includePlaceholder: 'букви на произволно място',
    excludeLabel: 'БЕЗ БУКВИТЕ',
    excludePlaceholder: 'букви, които отпадат',
    clear: 'Изчисти',
    examples: 'ПРОБВАЙ',
    letters: (count: number) => `${count} букви`,
    results: 'Подходящи думи',
    resultsHint: 'По азбучен ред. Натисни ⓘ, за да видиш думата в речник.',
    loading: 'Зареждане на речника…',
    startTitle: 'Въведи шаблон',
    startText: 'За дума от пет букви, която започва с К и има Л на третото място, въведи к?л??.',
    noneTitle: 'Никоя дума не пасва на шаблона',
    noneText: 'Провери буквите и броя на квадратчетата или махни някоя буква от „Трябва да има“.',
    more: (count: number) => `Покажи още ${count}`,
    error: 'Нещо се обърка',
    guideTitle: 'Как работи помощникът за кръстословици',
    guide: [
      'Всяка дума от речника със същия брой букви се сравнява с шаблона. Остават само думите, които имат твоите букви точно на тези места, съдържат всички букви от „Трябва да има“ и нямат нито една от „Без буквите“.',
      'Речникът има около 126 000 български думи, включително форми като членувани съществителни и множествено число. Отговорите в кръстословиците понякога са имена или изрази, които ги няма в него.',
    ],
  },
}

const EXAMPLES: Record<Language, string[]> = {
  en: ['c?o?s', '??ple', 'p?z?le', '_a_e_'],
  bg: ['к?л??а', '?ода', 'м?р?', 'пр??ет'],
}

function CrosswordSolver({ language }: { language: Language }) {
  const text = copy[language]
  const locale = language === 'bg' ? 'bg-BG' : 'en'
  const [words, setWords] = useState<string[] | null>(null)
  const [error, setError] = useState('')
  const [pattern, setPattern] = useState('')
  const [include, setInclude] = useState('')
  const [exclude, setExclude] = useState('')
  const [shown, setShown] = useState(PAGE_SIZE)
  const [openMeaning, setOpenMeaning] = useState<OpenMeaning | null>(null)
  const closeMeaning = useCallback(() => setOpenMeaning(null), [])
  const [tracked, setTracked] = useState(false)

  useEffect(() => {
    document.documentElement.lang = language
    document.title = crosswordMetadata[language].title
  }, [language])

  useEffect(() => {
    let active = true
    getDictionary(language)
      .then((loaded) => { if (active) setWords(loaded) })
      .catch((loadError: unknown) => { if (active) setError(loadError instanceof Error ? loadError.message : text.error) })
    return () => { active = false }
  }, [language, text.error])

  const query = useDeferredValue({ pattern, include, exclude })
  const matches = useMemo(() => (words && query.pattern.length > 1 ? findMatches(words, query) : []), [words, query])

  function update(setter: (value: string) => void, value: string) {
    setter(value)
    setShown(PAGE_SIZE)
    setOpenMeaning(null)
    if (!tracked) {
      setTracked(true)
      // Only that the tool was used, never the pattern.
      track('crossword_search', { language })
    }
  }

  const ready = pattern.length > 1

  return (
    <div className="app-shell wordle-page crossword-page">
      <header className="topbar">
        <a className="brand" href={pagePath('finder', language)} aria-label="Letterwell">
          <span className="brand-mark"><Sparkles size={18} strokeWidth={2.2} /></span>
          <span>letterwell</span>
        </a>
        <div className="topbar-actions">
          <div className="topbar-note"><span className="status-dot" />{text.tagline}</div>
          <a className="topbar-link" href={pagePath('finder', language)}>{text.finder}</a>
          <a className="topbar-link" href={pagePath('wordle', language)}>{text.wordle}</a>
          <label className="language-picker">
            <span className="sr-only">{language === 'bg' ? 'Език' : 'Language'}</span>
            <select
              value={language}
              onChange={(event) => window.location.assign(pagePath('crossword', event.target.value as Language))}
              aria-label={language === 'bg' ? 'Език' : 'Language'}
            >
              <option value="en">EN</option>
              <option value="bg">БГ</option>
            </select>
          </label>
        </div>
      </header>

      <main id="top">
        <section className="wordle-intro" aria-labelledby="page-title">
          <p className="eyebrow"><span className="eyebrow-line" />{text.eyebrow}<span className="eyebrow-line" /></p>
          <h1 id="page-title">{text.titleFirst} <em>{text.titleEmphasis}</em></h1>
          <p className="intro-description">{text.description}</p>
        </section>

        <section className="workspace" aria-label={text.tagline}>
          <div className="controls">
            <div className="control-heading">
              <span className="step-number">01</span>
              <div><h2>{text.patternTitle}</h2><p>{text.patternHint}</p></div>
            </div>

            <form className="guess-entry" onSubmit={(event) => event.preventDefault()}>
              <label className="field-label" htmlFor="pattern-input">{text.patternLabel}</label>
              <input
                id="pattern-input"
                className="letters-input"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                maxLength={MAX_PATTERN}
                placeholder={text.placeholder}
                value={pattern}
                onChange={(event) => update(setPattern, cleanPattern(event.target.value, language))}
                aria-describedby="pattern-hint"
              />
              <p className="guess-hint" id="pattern-hint">{text.gapsHint}</p>

              {pattern && (
                <div className="pattern-preview" aria-label={text.letters(pattern.length)}>
                  {[...pattern].map((char, index) => (
                    <span key={index} className={`pattern-square${char === '?' ? ' is-gap' : ''}`} aria-hidden="true">{char === '?' ? '' : char.toLocaleUpperCase(locale)}</span>
                  ))}
                  <span className="pattern-count">{text.letters(pattern.length)}</span>
                </div>
              )}

              <div className="crossword-filters">
                <label>
                  <span className="field-label">{text.includeLabel}</span>
                  <input className="letters-input filter-input" autoComplete="off" spellCheck={false} placeholder={text.includePlaceholder}
                    value={include} onChange={(event) => update(setInclude, cleanLetters(event.target.value, language))} />
                </label>
                <label>
                  <span className="field-label">{text.excludeLabel}</span>
                  <input className="letters-input filter-input" autoComplete="off" spellCheck={false} placeholder={text.excludePlaceholder}
                    value={exclude} onChange={(event) => update(setExclude, cleanLetters(event.target.value, language))} />
                </label>
              </div>

              {(pattern || include || exclude) && (
                <button type="button" className="text-action" onClick={() => { setPattern(''); setInclude(''); setExclude(''); setOpenMeaning(null) }}>
                  <RotateCcw size={14} /> {text.clear}
                </button>
              )}
            </form>

            <div className="examples openers">
              <span>{text.examples}</span>
              {EXAMPLES[language].map((example) => (
                <button className="example-button zy-key" type="button" key={example} onClick={() => update(setPattern, example)}>{example}</button>
              ))}
            </div>
          </div>

          <section className="results" aria-live="polite" aria-busy={!words && !error}>
            <div className="control-heading">
              <span className="step-number">02</span>
              <div>
                <h2>{text.results}{words && ready ? <span className="result-count"> {matches.length.toLocaleString(locale)}</span> : null}</h2>
                <p>{text.resultsHint}</p>
              </div>
            </div>

            {error ? (
              <div className="empty-state error-state"><span className="empty-spark">!</span><h3>{text.error}</h3><p>{error}</p></div>
            ) : !words ? (
              <div className="empty-state"><span className="loading-orbit"><span /></span><h3>{text.loading}</h3></div>
            ) : !ready ? (
              <div className="empty-state"><span className="empty-spark"><Sparkles size={22} /></span><h3>{text.startTitle}</h3><p>{text.startText}</p></div>
            ) : matches.length === 0 ? (
              <div className="empty-state"><span className="empty-spark">?</span><h3>{text.noneTitle}</h3><p>{text.noneText}</p></div>
            ) : (
              <>
                <div className="answer-list">
                  {matches.slice(0, shown).map((word) => (
                    <span className="answer-word" key={word}>
                      {word}
                      <MeaningButton word={word} language={language} available onOpen={setOpenMeaning} />
                    </span>
                  ))}
                </div>
                {matches.length > shown && (
                  <button type="button" className="text-action show-more" onClick={() => setShown((count) => count + PAGE_SIZE)}>
                    {text.more(Math.min(PAGE_SIZE, matches.length - shown))}
                  </button>
                )}
              </>
            )}
          </section>
        </section>

        {openMeaning && <MeaningPopover key={openMeaning.word} open={openMeaning} language={language} onClose={closeMeaning} linksOnly />}

        <section className="tool-guide" aria-labelledby="tool-guide-title">
          <h2 id="tool-guide-title">{text.guideTitle}</h2>
          {text.guide.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
      </main>
    </div>
  )
}

export default CrosswordSolver
