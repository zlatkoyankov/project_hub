import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ArrowRight, Lightbulb, RotateCcw, Sparkles, X } from 'lucide-react'
import { track } from '@zyankov/design-system/analytics'
import './App.css'
import './wordle.css'
import { pagePath, wordleMetadata, type Language } from './seo'
import { filterWords, loadWordleList, OPENERS, suggestGuess, WORD_LENGTH, type GuessRow, type Tile, type WordleList } from './wordle'

const MAX_ROWS = 6
const SHOWN_WORDS = 120

const copy = {
  en: {
    tagline: 'Wordle helper',
    finder: 'Word finder',
    eyebrow: 'WORDLE HELPER',
    titleFirst: 'Stuck on Wordle?',
    titleEmphasis: 'Narrow it down.',
    description: 'Type each guess, tap the tiles to match the colours from your game, and see which words are still possible.',
    guesses: 'Your guesses',
    guessesHint: 'Up to six five-letter guesses',
    enterGuess: 'TYPE A GUESS',
    placeholder: 'e.g. raise',
    add: 'Add guess',
    tapHint: 'Tap a tile to switch grey → yellow → green.',
    clear: 'Start over',
    remove: 'Remove guess',
    tileLabel: (letter: string, position: number, colour: string) => `${letter.toUpperCase()}, letter ${position}: ${colour}. Tap to change.`,
    colours: ['grey', 'yellow', 'green'],
    notInList: 'Not in our word list, but it still counts as a clue.',
    needFive: 'A guess needs five letters.',
    full: 'That is all six guesses.',
    openersTitle: 'GOOD FIRST GUESSES',
    possible: 'Possible answers',
    possibleHint: 'Everyday words first; less common words below.',
    loading: 'Loading the word list…',
    startTitle: 'Add your first guess',
    startText: 'Your possible answers will appear here. Not sure where to start? Try one of the first guesses on the left.',
    noneTitle: 'No word fits these colours',
    noneText: 'Check that each tile matches your game. A yellow letter in one guess can be grey in another only if the word has fewer copies of it.',
    suggestion: 'TRY NEXT',
    suggestionText: (left: string) => `Leaves about ${left} possible answers on average.`,
    suggestionAnswer: 'It could also be the answer.',
    suggestionFound: 'This should be the answer.',
    use: 'Use this guess',
    likely: 'LIKELY ANSWERS',
    rare: 'Less common words',
    showRare: 'Show less common words',
    hideRare: 'Hide less common words',
    more: (count: number) => `and ${count} more`,
    error: 'Something went wrong',
    guideTitle: 'How the Wordle helper works',
    guide: [
      'Every guess you add is compared with every five-letter word in the list. A word stays only if it would have given you exactly the same green, yellow and grey tiles, so repeated letters are handled the way the game handles them.',
      'The suggested next guess is the everyday word that splits the remaining answers into the smallest groups, so whatever colours you get back, fewer words are left. The list is not the official Wordle list, so treat it as help, not a guarantee.',
    ],
    readMore: 'Read more',
    articles: [
      { href: '/blog/best-wordle-starting-words/', label: 'The best Wordle starting words, tested' },
      { href: '/blog/how-to-solve-wordle-in-fewer-guesses/', label: 'How to solve Wordle in fewer guesses' },
    ],
  },
  bg: {
    tagline: 'Помощник за Wordle',
    finder: 'Търсачка за думи',
    eyebrow: 'ПОМОЩНИК ЗА WORDLE',
    titleFirst: 'Заседна на Wordle?',
    titleEmphasis: 'Стесни избора.',
    description: 'Въведи всеки опит, оцвети плочките като в играта и виж кои думи все още са възможни.',
    guesses: 'Твоите опити',
    guessesHint: 'До шест опита с по пет букви',
    enterGuess: 'ВЪВЕДИ ОПИТ',
    placeholder: 'например ролка',
    add: 'Добави опит',
    tapHint: 'Натисни плочка: сиво → жълто → зелено.',
    clear: 'Започни отначало',
    remove: 'Премахни опита',
    tileLabel: (letter: string, position: number, colour: string) => `${letter.toUpperCase()}, буква ${position}: ${colour}. Натисни за смяна.`,
    colours: ['сиво', 'жълто', 'зелено'],
    notInList: 'Думата я няма в нашия списък, но пак се брои като подсказка.',
    needFive: 'Опитът трябва да е с пет букви.',
    full: 'Това са всичките шест опита.',
    openersTitle: 'ДОБРИ ПЪРВИ ДУМИ',
    possible: 'Възможни думи',
    possibleHint: 'Първо често срещаните думи, по-редките са отдолу.',
    loading: 'Зареждане на списъка с думи…',
    startTitle: 'Добави първия си опит',
    startText: 'Тук ще се появят възможните думи. Не знаеш с какво да започнеш? Пробвай някоя от първите думи вляво.',
    noneTitle: 'Никоя дума не пасва на тези цветове',
    noneText: 'Провери дали плочките съвпадат с играта. Буква може да е жълта в един опит и сива в друг само ако думата я съдържа по-малко пъти.',
    suggestion: 'ПРОБВАЙ',
    suggestionText: (left: string) => `Оставя средно около ${left} възможни думи.`,
    suggestionAnswer: 'Може да е и самият отговор.',
    suggestionFound: 'Това би трябвало да е отговорът.',
    use: 'Използвай тази дума',
    likely: 'НАЙ-ВЕРОЯТНИ',
    rare: 'По-редки думи',
    showRare: 'Покажи по-редките думи',
    hideRare: 'Скрий по-редките думи',
    more: (count: number) => `и още ${count}`,
    error: 'Нещо се обърка',
    guideTitle: 'Как работи помощникът за Wordle',
    guide: [
      'Всеки опит се сравнява с всяка дума от пет букви в списъка. Остават само думите, които биха дали точно същите зелени, жълти и сиви плочки, така че повтарящите се букви се отчитат като в играта.',
      'Предложеният следващ опит е често срещаната дума, която разделя останалите възможности на най-малки групи. Каквито и цветове да получиш, ще останат по-малко думи. Списъкът не е официалният на играта, затова го приемай като помощ, а не като гаранция.',
    ],
    readMore: 'Прочети още',
    articles: [{ href: '/bg/blog/kak-da-reshavash-wordle-na-balgarski/', label: 'Как да решаваш Wordle на български' }],
  },
}

const tileClass = ['clue-absent', 'clue-present', 'clue-correct']

function WordleSolver({ language }: { language: Language }) {
  const text = copy[language]
  const [list, setList] = useState<WordleList | null>(null)
  const [error, setError] = useState('')
  const [rows, setRows] = useState<GuessRow[]>([])
  const [draft, setDraft] = useState('')
  const [note, setNote] = useState('')
  const [showRare, setShowRare] = useState(false)
  const locale = language === 'bg' ? 'bg-BG' : 'en'

  useEffect(() => {
    document.documentElement.lang = language
    document.title = wordleMetadata[language].title
  }, [language])

  useEffect(() => {
    let active = true
    loadWordleList(language)
      .then((loaded) => { if (active) setList(loaded) })
      .catch((loadError: unknown) => { if (active) setError(loadError instanceof Error ? loadError.message : text.error) })
    return () => { active = false }
  }, [language, text.error])

  const common = useMemo(() => (list ? filterWords(list.common, rows) : []), [list, rows])
  const rare = useMemo(() => (list ? filterWords(list.rare, rows) : []), [list, rows])
  const suggestion = useMemo(() => {
    if (!list || rows.length === 0 || rows.length >= MAX_ROWS) return null
    const pool = common.length > 0 ? common : rare
    return suggestGuess(pool, list.common)
  }, [list, rows.length, common, rare])

  const cleanWord = (value: string) =>
    value.toLocaleLowerCase(locale).replace(language === 'bg' ? /[^а-я]/g : /[^a-z]/g, '').slice(0, WORD_LENGTH)

  function addGuess(word: string) {
    const guess = cleanWord(word)
    if (guess.length !== WORD_LENGTH) return setNote(text.needFive)
    if (rows.length >= MAX_ROWS) return setNote(text.full)
    const known = !list || list.common.includes(guess) || list.rare.includes(guess)
    setNote(known ? '' : text.notInList)
    setRows((current) => [...current, { word: guess, tiles: [0, 0, 0, 0, 0] }])
    setDraft('')
    setShowRare(false)
    // Only counts leave the browser, never the words.
    track('wordle_guess', { language, guess: rows.length + 1 })
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    addGuess(draft)
  }

  function cycleTile(rowIndex: number, tileIndex: number) {
    setRows((current) => current.map((row, index) => index !== rowIndex ? row : {
      ...row,
      tiles: row.tiles.map((tile, position) => position === tileIndex ? (((tile + 1) % 3) as Tile) : tile),
    }))
  }

  const removeRow = (rowIndex: number) => setRows((current) => current.filter((_, index) => index !== rowIndex))
  const formatLeft = (value: number) => value < 10 ? value.toLocaleString(locale, { maximumFractionDigits: 1 }) : Math.round(value).toLocaleString(locale)
  const total = common.length + rare.length

  return (
    <div className="app-shell wordle-page">
      <header className="topbar">
        <a className="brand" href={pagePath('finder', language)} aria-label="Letterwell">
          <span className="brand-mark"><Sparkles size={18} strokeWidth={2.2} /></span>
          <span>letterwell</span>
        </a>
        <div className="topbar-actions">
          <div className="topbar-note"><span className="status-dot" />{text.tagline}</div>
          <a className="topbar-link" href={pagePath('finder', language)}>{text.finder}</a>
          <label className="language-picker">
            <span className="sr-only">{language === 'bg' ? 'Език' : 'Language'}</span>
            <select
              value={language}
              onChange={(event) => window.location.assign(pagePath('wordle', event.target.value as Language))}
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
              <div><h2>{text.guesses}</h2><p>{text.guessesHint}</p></div>
            </div>

            <form className="guess-entry" onSubmit={onSubmit}>
              <label className="field-label" htmlFor="guess-input">{text.enterGuess}</label>
              <div className="guess-entry-row">
                <input
                  id="guess-input"
                  className="letters-input"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  maxLength={WORD_LENGTH}
                  placeholder={text.placeholder}
                  value={draft}
                  onChange={(event) => { setDraft(cleanWord(event.target.value)); setNote('') }}
                  disabled={rows.length >= MAX_ROWS}
                />
                <button className="guess-add" type="submit" disabled={draft.length !== WORD_LENGTH || rows.length >= MAX_ROWS}>
                  {text.add} <ArrowRight size={16} />
                </button>
              </div>
              {note && <p className="guess-note" role="status">{note}</p>}
            </form>

            {rows.length > 0 ? (
              <div className="guess-board">
                <p className="guess-hint">{text.tapHint}</p>
                {rows.map((row, rowIndex) => (
                  <div className="guess-row" key={rowIndex}>
                    {row.tiles.map((tile, tileIndex) => (
                      <button
                        type="button"
                        key={tileIndex}
                        className={`guess-tile ${tileClass[tile]}`}
                        aria-label={text.tileLabel(row.word[tileIndex], tileIndex + 1, text.colours[tile])}
                        onClick={() => cycleTile(rowIndex, tileIndex)}
                      >{row.word[tileIndex].toLocaleUpperCase(locale)}</button>
                    ))}
                    <button type="button" className="guess-remove" aria-label={text.remove} title={text.remove} onClick={() => removeRow(rowIndex)}><X size={16} /></button>
                  </div>
                ))}
                <button type="button" className="text-action" onClick={() => { setRows([]); setNote('') }}><RotateCcw size={14} /> {text.clear}</button>
              </div>
            ) : (
              <div className="examples openers">
                <span>{text.openersTitle}</span>
                {OPENERS[language].map((word) => (
                  <button className="example-button" type="button" key={word} onClick={() => addGuess(word)}>{word}</button>
                ))}
              </div>
            )}
          </div>

          <section className="results" aria-live="polite" aria-busy={!list && !error}>
            <div className="control-heading">
              <span className="step-number">02</span>
              <div><h2>{text.possible}{list && rows.length > 0 ? <span className="result-count"> {total.toLocaleString(locale)}</span> : null}</h2><p>{text.possibleHint}</p></div>
            </div>

            {error ? (
              <div className="empty-state error-state"><span className="empty-spark">!</span><h3>{text.error}</h3><p>{error}</p></div>
            ) : !list ? (
              <div className="empty-state"><span className="loading-orbit"><span /></span><h3>{text.loading}</h3></div>
            ) : rows.length === 0 ? (
              <div className="empty-state"><span className="empty-spark"><Sparkles size={22} /></span><h3>{text.startTitle}</h3><p>{text.startText}</p></div>
            ) : total === 0 ? (
              <div className="empty-state"><span className="empty-spark">?</span><h3>{text.noneTitle}</h3><p>{text.noneText}</p></div>
            ) : (
              <>
                {suggestion && (
                  <div className="suggestion-card">
                    <Lightbulb size={20} aria-hidden="true" />
                    <div>
                      <span className="result-meta">{text.suggestion}</span>
                      <strong className="suggestion-word">{suggestion.word.toLocaleUpperCase(locale)}</strong>
                      <p>{total === 1 ? text.suggestionFound : `${text.suggestionText(formatLeft(suggestion.expectedLeft))}${suggestion.possibleAnswer ? ` ${text.suggestionAnswer}` : ''}`}</p>
                    </div>
                    {total > 1 && rows.length < MAX_ROWS && <button type="button" className="example-button" onClick={() => addGuess(suggestion.word)}>{text.use}</button>}
                  </div>
                )}
                {common.length > 0 && (
                  <>
                    <div className="result-meta"><span>{text.likely}</span><span>{common.length.toLocaleString(locale)}</span></div>
                    <div className="answer-list">
                      {common.slice(0, SHOWN_WORDS).map((word) => <span className="answer-word" key={word}>{word}</span>)}
                      {common.length > SHOWN_WORDS && <span className="answer-more">{text.more(common.length - SHOWN_WORDS)}</span>}
                    </div>
                  </>
                )}
                {rare.length > 0 && (
                  <div className="rare-words">
                    <button type="button" className="text-action" aria-expanded={showRare} onClick={() => setShowRare((open) => !open)}>
                      {showRare ? text.hideRare : text.showRare} ({rare.length.toLocaleString(locale)})
                    </button>
                    {showRare && (
                      <div className="answer-list rare">
                        {rare.slice(0, SHOWN_WORDS).map((word) => <span className="answer-word" key={word}>{word}</span>)}
                        {rare.length > SHOWN_WORDS && <span className="answer-more">{text.more(rare.length - SHOWN_WORDS)}</span>}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </section>
        </section>

        <section className="tool-guide" aria-labelledby="tool-guide-title">
          <h2 id="tool-guide-title">{text.guideTitle}</h2>
          {text.guide.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <p className="guide-links">
            <strong>{text.readMore}:</strong>{' '}
            {text.articles.map((article, index) => (
              <span key={article.href}>{index > 0 && ' · '}<a href={article.href}>{article.label}</a></span>
            ))}
          </p>
        </section>
      </main>
    </div>
  )
}

export default WordleSolver
