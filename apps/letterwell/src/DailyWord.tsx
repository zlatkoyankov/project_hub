// Letterwell's daily word game: "Дума на деня" (/letterwell/bg/duma-na-denya/) and
// "Letterwell Daily" (/letterwell/daily/), each with a daily word and an unlimited mode.
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { BarChart3, CircleHelp, Delete, Lightbulb, RefreshCw, Share2, Sparkles, X } from 'lucide-react'
import { track } from '@zyankov/design-system/analytics'
import { HeroDecor } from './Playful'
import { MoreWordTools, ToolLinks } from './ToolNav'
import { TryNext } from './TryNext'
import { pagePath, type Language } from './seo'
import { loadWordleList, WORD_LENGTH } from './wordle'
import { dictionaryLinks } from './meanings'
import {
  answerFor, currentStreak, DAILY_WORDS, emptyStats, hintsFor, KEYBOARD_ROWS, keyMarks, LATIN_TO_CYRILLIC, LETTERS, markGuess, MAX_GUESSES,
  msUntilNext, puzzleNumber, randomAnswer, recordResult, shareText, type Mark, type Stats,
} from './daily'
import './wordle.css'
import './daily.css'

type Mode = 'daily' | 'unlimited'

const TEXT = {
  bg: {
    titleFirst: 'Дума на', titleEmphasis: 'деня', game: 'Дума на деня', note: 'Нова дума всеки ден', eyebrow: 'Игра на думи',
    intro: 'Познай думата от 5 букви с 6 опита. Една и съща дума за всички, нова всеки ден в полунощ.',
    shareUrl: 'zyankov.eu/duma', storage: 'zy-daily', locale: 'bg-BG',
    daily: 'Днешната', unlimited: 'Неограничено', modes: 'Режим на игра',
    help: 'Как се играе', stats: 'Статистика', close: 'Затвори', board: 'Опити', keyboard: 'Клавиатура', guess: 'Опит', empty: 'празно',
    hit: 'на място', near: 'на друго място', miss: 'няма я',
    enter: 'Готово', del: 'Изтрий', tooShort: 'Трябват 5 букви', notWord: 'Няма такава дума в речника',
    praise: ['Гениално!', 'Великолепно!', 'Браво!', 'Много добре!', 'Добре!', 'На косъм!'],
    copied: 'Резултатът е копиран. Постави го в чата.',
    streak: (n: number) => (n > 0 ? `Серия: ${n} ${n === 1 ? 'ден' : 'дни'}` : 'Започни серия днес'),
    unlimitedNote: 'Случайна дума, колкото пъти искаш',
    wonIn: (n: number) => `Позна от ${n} ${n === 1 ? 'опит' : 'опита'}!`, wasWord: 'Думата беше',
    share: 'Сподели', newWord: 'Нова дума', shareHeading: (n: number) => `Дума на деня № ${n}`, shareUnlimited: 'Дума на деня · неограничено',
    won: 'Браво!', lost: 'Този път не', meaning: 'Какво значи:',
    played: 'изиграни', winRate: 'победи', current: 'серия', best: 'най-дълга серия', distribution: 'Разпределение на опитите',
    next: 'Следваща дума след', finishFirst: 'Довърши днешната дума, за да я добавиш към статистиката.', play: 'Да играем',
    unlimitedStats: 'Неограничено: статистиката тук е само за днешните думи.',
    hints: 'Подсказки', hintsTitle: 'Подсказки без да издаваме думата', hintNext: 'Покажи подсказка', hintNone: 'Още не си отворил подсказка. Започни с най-лесната.', hintsDone: 'Това бяха всички подсказки. Остава само думата.',
    helpText: 'Познай думата от 5 букви с 6 опита. След всеки опит плочките показват колко си близо.',
    helpLegend: <>Кораловото <strong>К</strong> е на точното място, синьото кръгче <strong>Н</strong> е в думата, но на друго място, а сивите букви ги няма.</>,
    helpModes: 'Днешната дума е една за всички и се сменя в полунощ. В „Неограничено“ играеш със случайни думи колкото искаш.',
    example: 'книга', exampleNear: 1,
  },
  en: {
    titleFirst: 'Letterwell', titleEmphasis: 'Daily', game: 'Letterwell Daily', note: 'A new word every day', eyebrow: 'Word game',
    intro: 'Find the five-letter word in six tries. Everyone gets the same word, and a new one arrives every day.',
    shareUrl: 'zyankov.eu/daily', storage: 'zy-daily-en', locale: 'en-GB',
    daily: 'Today', unlimited: 'Unlimited', modes: 'Game mode',
    help: 'How to play', stats: 'Statistics', close: 'Close', board: 'Guesses', keyboard: 'Keyboard', guess: 'Guess', empty: 'empty',
    hit: 'right place', near: 'elsewhere in the word', miss: 'not in the word',
    enter: 'Enter', del: 'Delete', tooShort: 'Five letters, please', notWord: 'Not in our word list',
    praise: ['Genius!', 'Brilliant!', 'Splendid!', 'Nice one!', 'Good!', 'Phew!'],
    copied: 'Result copied. Paste it into your chat.',
    streak: (n: number) => (n > 0 ? `Streak: ${n} ${n === 1 ? 'day' : 'days'}` : 'Start a streak today'),
    unlimitedNote: 'Random words, as many as you like',
    wonIn: (n: number) => `Solved in ${n} ${n === 1 ? 'guess' : 'guesses'}!`, wasWord: 'The word was',
    share: 'Share', newWord: 'New word', shareHeading: (n: number) => `Letterwell Daily #${n}`, shareUnlimited: 'Letterwell Daily · unlimited',
    won: 'Well done!', lost: 'Not this time', meaning: 'What it means:',
    played: 'played', winRate: 'won', current: 'streak', best: 'best streak', distribution: 'Guess distribution',
    next: 'Next word in', finishFirst: 'Finish today’s word to add it to your statistics.', play: 'Let’s play',
    unlimitedStats: 'Unlimited mode: these statistics count the daily words only.',
    hints: 'Hints', hintsTitle: 'Hints without giving the word away', hintNext: 'Show a hint', hintNone: 'No hints opened yet. Start with the gentlest one.', hintsDone: 'That is every hint. Only the word is left.',
    helpText: 'Find the five-letter word in six tries. After each guess the tiles show how close you are.',
    helpLegend: <>The coral <strong>B</strong> is in the right place, the blue circle <strong>R</strong> is in the word but elsewhere, and grey letters are not in it.</>,
    helpModes: 'Today’s word is the same for everyone and changes at midnight (Sofia time). In Unlimited you play random words as often as you like.',
    example: 'bread', exampleNear: 1,
  },
} as const

const NOTES = {
  bg: (
    <>
      <article>
        <h2>Как се играе</h2>
        <p>Напиши дума от 5 букви и натисни „Готово“. Плочките показват:</p>
        <ul className="daily-legend">
          <li><span className="daily-tile is-filled is-correct">К</span> коралова плочка: буквата е в думата и на точното място;</li>
          <li><span className="daily-tile is-filled is-present">Н</span> синьо кръгче: буквата е в думата, но на друго място;</li>
          <li><span className="daily-tile is-filled is-absent">П</span> сива плочка: буквата я няма в думата.</li>
        </ul>
        <p>Имаш 6 опита. Днешната дума е една и съща за всички и се сменя в полунощ българско време. В „Неограничено“ играеш със случайни думи. Може да пишеш и от клавиатурата, на кирилица или с латинските клавиши по фонетичната подредба.</p>
      </article>
      <article>
        <h2>Въпроси</h2>
        <h3>Какви думи има?</h3>
        <p>Познати съществителни и прилагателни в основна форма, без имена, съкращения и ругатни. Опитите може да са всяка дума от 5 букви от речника ни.</p>
        <h3>Как се пази серията?</h3>
        <p>Серията са дните подред, в които си познал днешната дума. Пази се в този браузър, без регистрация. Ако пропуснеш ден, започва отначало.</p>
        <h3>Има ли подсказки за думата на деня?</h3>
        <p>Да. Натисни крушката над дъската. Подсказките се отварят една по една: колко гласни има думата, дали има повтаряща се буква, първата и последната буква. Самата дума не се показва. Има и <a href={pagePath('hints', 'bg')}>отделна страница с подсказките</a>, с вчерашната дума и съвети.</p>
        <h3>Заседнал съм.</h3>
        <p><a href={pagePath('wordle', 'bg')}>Помощникът за Wordle</a> показва кои думи още пасват на буквите ти. Ползвай го, ако искаш, но серията е по-сладка без него.</p>
      </article>
    </>
  ),
  en: (
    <>
      <article>
        <h2>How to play</h2>
        <p>Type a five-letter word and press Enter. The tiles tell you:</p>
        <ul className="daily-legend">
          <li><span className="daily-tile is-filled is-correct">B</span> coral tile: the letter is in the word, in the right place;</li>
          <li><span className="daily-tile is-filled is-present">R</span> blue circle: the letter is in the word, somewhere else;</li>
          <li><span className="daily-tile is-filled is-absent">E</span> grey tile: the letter is not in the word.</li>
        </ul>
        <p>You have six tries. Today’s word is the same for everyone and changes at midnight Sofia time (late evening in the UK and Americas). In Unlimited you get a random word every time.</p>
      </article>
      <article>
        <h2>Questions</h2>
        <h3>What words are used?</h3>
        <p>Everyday nouns and adjectives, with no names, abbreviations or rude words. Your guesses can be any five-letter word from our dictionary.</p>
        <h3>How does the streak work?</h3>
        <p>Your streak counts the days in a row you solved today’s word. It is kept in this browser, with no sign-up. Miss a day and it starts again.</p>
        <h3>Are there hints for today’s word?</h3>
        <p>Yes. Tap the light bulb above the board. Hints open one at a time: how many vowels the word has, whether a letter repeats, the first letter and the last letter. The word itself is never shown. They also have <a href={pagePath('hints', 'en')}>a page of their own</a>, with yesterday’s word and tips.</p>
        <h3>I’m stuck.</h3>
        <p>The <a href={pagePath('finder', 'en')}>word finder</a> lists every word you can make from a set of letters. Use it if you must, but a streak tastes better without it.</p>
      </article>
    </>
  ),
}

function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Private mode or storage full: the game still works, it just forgets on reload.
  }
}

function formatCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`
}

export default function DailyWord({ language = 'bg' }: { language?: Language }) {
  const t = TEXT[language]
  const gameKey = `${t.storage}-game-v1`
  const statsKey = `${t.storage}-stats-v1`
  const unlimitedKey = `${t.storage}-unlimited-v1`
  const letters = LETTERS[language]
  const upper = useCallback((text: string) => text.toLocaleUpperCase(t.locale), [t.locale])

  const [mode, setMode] = useState<Mode>('daily')
  const [puzzle, setPuzzle] = useState<number | null>(null)
  const [answer, setAnswer] = useState('')
  const [guesses, setGuesses] = useState<string[]>([])
  const [current, setCurrent] = useState('')
  const [valid, setValid] = useState<Set<string> | null>(null)
  const [stats, setStats] = useState<Stats>(emptyStats)
  const [message, setMessage] = useState('')
  const [shake, setShake] = useState(false)
  const [revealRow, setRevealRow] = useState(-1)
  const [modal, setModal] = useState<'none' | 'help' | 'stats'>('none')
  const [countdown, setCountdown] = useState('')
  // Hints: how many are open; for the daily word this is kept per puzzle, so a reload keeps them.
  const hintsKey = `${t.storage}-hints-v1`
  const [hintsOpen, setHintsOpen] = useState(false)
  const [hintCount, setHintCount] = useState(0)
  const messageTimer = useRef<number | undefined>(undefined)
  const closeButton = useRef<HTMLButtonElement>(null)
  // Latest typed word and guesses, so fast typing never submits a stale word.
  const currentRef = useRef('')
  const guessesRef = useRef<string[]>([])
  const setTyped = (value: string) => { currentRef.current = value; setCurrent(value) }
  const setPlayed = (value: string[]) => { guessesRef.current = value; setGuesses(value) }

  const won = guesses.length > 0 && guesses[guesses.length - 1] === answer
  const finished = won || guesses.length >= MAX_GUESSES
  const keys = useMemo(() => keyMarks(guesses, answer), [guesses, answer])

  /** Switch to a mode and restore its saved game (client only: the page is prerendered without a date). */
  const startMode = useCallback((next: Mode, fresh = false) => {
    setMode(next)
    setTyped('')
    setRevealRow(-1)
    if (next === 'daily') {
      const today = puzzleNumber()
      setPuzzle(today)
      setAnswer(answerFor(today, language))
      const saved = readJson<{ puzzle: number; guesses: string[] }>(gameKey)
      setPlayed(saved?.puzzle === today && Array.isArray(saved.guesses) ? saved.guesses.slice(0, MAX_GUESSES) : [])
    } else {
      const saved = fresh ? null : readJson<{ answer: string; guesses: string[] }>(unlimitedKey)
      const word = saved && DAILY_WORDS[language].includes(saved.answer) ? saved.answer : randomAnswer(language, readJson<{ answer: string }>(unlimitedKey)?.answer)
      const played = saved && Array.isArray(saved.guesses) ? saved.guesses.slice(0, MAX_GUESSES) : []
      setAnswer(word)
      setPlayed(played)
      writeJson(unlimitedKey, { answer: word, guesses: played })
    }
  }, [gameKey, language, unlimitedKey])

  useEffect(() => {
    startMode('daily')
    const savedStats = readJson<Stats>(statsKey)
    if (savedStats) setStats({ ...emptyStats(), ...savedStats })
    if (!readJson(gameKey) && !savedStats) setModal('help')
    let active = true
    loadWordleList(language)
      .then((list) => { if (active) setValid(new Set([...list.common, ...list.rare, ...DAILY_WORDS[language]])) })
      .catch(() => { if (active) setValid(new Set(DAILY_WORDS[language])) })
    return () => { active = false }
  }, [gameKey, language, startMode, statsKey])

  const flash = useCallback((text: string, wrong = false) => {
    setMessage(text)
    if (wrong) {
      setShake(true)
      window.setTimeout(() => setShake(false), 450)
    }
    window.clearTimeout(messageTimer.current)
    messageTimer.current = window.setTimeout(() => setMessage(''), 1800)
  }, [])

  const submit = useCallback(() => {
    const word = currentRef.current
    const played = guessesRef.current
    if (!answer || played.includes(answer) || played.length >= MAX_GUESSES) return
    if (word.length < WORD_LENGTH) return flash(t.tooShort, true)
    if (valid && !valid.has(word)) return flash(t.notWord, true)
    const next = [...played, word]
    setPlayed(next)
    setTyped('')
    setRevealRow(next.length - 1)
    if (mode === 'daily') writeJson(gameKey, { puzzle, guesses: next })
    else writeJson(unlimitedKey, { answer, guesses: next })
    const isWin = word === answer
    if (isWin || next.length >= MAX_GUESSES) {
      if (mode === 'daily' && puzzle) {
        const updated = recordResult(stats, puzzle, isWin, next.length)
        setStats(updated)
        writeJson(statsKey, updated)
      }
      track('daily_finish', { result: isWin ? 'win' : 'loss', guesses: next.length, mode, language })
      window.setTimeout(() => {
        flash(isWin ? t.praise[next.length - 1] : upper(answer))
        if (mode === 'daily') setModal('stats')
      }, 1700)
    } else if (next.length === 1) {
      track('daily_start', { mode, language })
    }
  }, [answer, flash, gameKey, language, mode, puzzle, stats, statsKey, t, unlimitedKey, upper, valid])

  const press = useCallback((key: string) => {
    if (finished || !answer) return
    if (key === 'enter') return submit()
    if (key === 'back') return setTyped(currentRef.current.slice(0, -1))
    if (letters.test(key) && currentRef.current.length < WORD_LENGTH) setTyped(currentRef.current + key)
  }, [answer, finished, letters, submit])

  // Physical keyboard; in Bulgarian, Latin keys are mapped to the phonetic layout.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || modal !== 'none') return
      const target = event.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      if (event.key === 'Enter') { event.preventDefault(); press('enter'); return }
      if (event.key === 'Backspace') { press('back'); return }
      const key = event.key.toLocaleLowerCase(t.locale)
      const letter = letters.test(key) ? key : language === 'bg' ? LATIN_TO_CYRILLIC[key] : undefined
      if (letter) press(letter)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [language, letters, modal, press, t.locale])

  // Countdown to the next word while the stats are open.
  useEffect(() => {
    if (modal !== 'stats') return
    const tick = () => setCountdown(formatCountdown(msUntilNext()))
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [modal])

  useEffect(() => {
    if (modal === 'none') return
    closeButton.current?.focus()
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setModal('none') }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modal])

  const share = async () => {
    if (!answer) return
    const heading = mode === 'daily' && puzzle ? t.shareHeading(puzzle) : t.shareUnlimited
    const text = shareText(heading, guesses, answer, won, t.shareUrl)
    track('daily_share', { mode, language })
    try {
      if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
        await navigator.share({ text })
        return
      }
      await navigator.clipboard.writeText(text)
      flash(t.copied)
    } catch {
      // The user closed the share sheet.
    }
  }

  useEffect(() => {
    if (!answer) return
    let shown = 0
    if (mode === 'daily' && puzzle) {
      try {
        const saved = JSON.parse(localStorage.getItem(hintsKey) || 'null') as { puzzle: number; shown: number } | null
        if (saved && saved.puzzle === puzzle) shown = saved.shown
      } catch { /* nothing saved */ }
    }
    setHintCount(shown)
    if (typeof window !== 'undefined' && window.location.hash === '#hints') setHintsOpen(true)
  }, [answer, mode, puzzle, hintsKey])

  const hints = answer ? hintsFor(answer, language) : []
  const showHint = () => {
    const next = Math.min(hints.length, hintCount + 1)
    setHintCount(next)
    if (mode === 'daily' && puzzle) {
      try { localStorage.setItem(hintsKey, JSON.stringify({ puzzle, shown: next })) } catch { /* storage unavailable */ }
    }
    track('daily_hint', { level: next, mode, language })
  }

  const markLabel = (mark: Mark | null | undefined) => (mark ? `, ${mark === 'correct' ? t.hit : mark === 'present' ? t.near : t.miss}` : '')

  const rows = Array.from({ length: MAX_GUESSES }, (_, row) => {
    if (row < guesses.length) return { letters: [...guesses[row]], marks: markGuess(guesses[row], answer) as (Mark | null)[], current: false }
    if (row === guesses.length && !finished) return { letters: [...current.padEnd(WORD_LENGTH, ' ')], marks: Array(WORD_LENGTH).fill(null), current: true }
    return { letters: Array(WORD_LENGTH).fill(' '), marks: Array(WORD_LENGTH).fill(null), current: false }
  })

  const streak = puzzle ? currentStreak(stats, puzzle) : 0
  const maxDist = Math.max(1, ...stats.distribution)
  const winRate = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0
  const dailyDone = mode === 'daily' && finished

  return (
    <div className="app-shell wordle-page daily-page">
      <header className="topbar">
        <a className="brand" href={pagePath('finder', language)} aria-label="Letterwell">
          <span className="brand-mark"><Sparkles size={18} strokeWidth={2.2} /></span>
          <span>letterwell</span>
        </a>
        <div className="topbar-actions">
          <div className="topbar-note"><span className="status-dot" />{t.note}</div>
          <ToolLinks language={language} current="daily" />
          <label className="language-picker">
            <span className="sr-only">{language === 'bg' ? 'Език' : 'Language'}</span>
            <select value={language} onChange={(event) => window.location.assign(pagePath('daily', event.target.value as Language))} aria-label={language === 'bg' ? 'Език' : 'Language'}>
              <option value="en">EN</option>
              <option value="bg">БГ</option>
            </select>
          </label>
        </div>
      </header>

      <main id="top">
        <section className="wordle-intro daily-intro" aria-labelledby="page-title">
          <HeroDecor variant="daily" language={language} />
          <p className="eyebrow"><span className="eyebrow-line" />{mode === 'daily' && puzzle ? `№ ${puzzle}` : t.eyebrow}<span className="eyebrow-line" /></p>
          <h1 id="page-title">{t.titleFirst} <em>{t.titleEmphasis}</em></h1>
          <p className="intro-description">{t.intro}</p>
        </section>

        <section className="daily-game" aria-label={t.game}>
          <div className="daily-toolbar">
            <button type="button" className="daily-icon" onClick={() => setModal('help')} aria-label={t.help}><CircleHelp size={20} /></button>
            <div className="daily-modes" role="group" aria-label={t.modes}>
              <button type="button" aria-pressed={mode === 'daily'} onClick={() => startMode('daily')}>{t.daily}</button>
              <button type="button" aria-pressed={mode === 'unlimited'} onClick={() => startMode('unlimited')}>{t.unlimited}</button>
            </div>
            <div className="daily-toolbar__end">
              <button type="button" className="daily-icon" onClick={() => setHintsOpen((open) => !open)} aria-label={t.hints} aria-expanded={hintsOpen} aria-controls="daily-hints"><Lightbulb size={20} /></button>
              <button type="button" className="daily-icon" onClick={() => setModal('stats')} aria-label={t.stats}><BarChart3 size={20} /></button>
            </div>
          </div>

          {hintsOpen && !finished && (
            <div className="daily-hints" id="daily-hints">
              <p className="daily-hints__title">{t.hintsTitle}</p>
              {hintCount === 0 ? <p className="daily-hints__empty">{t.hintNone}</p> : (
                <ol>{hints.slice(0, hintCount).map((hint) => <li key={hint}>{hint}</li>)}</ol>
              )}
              {hintCount < hints.length
                ? <button type="button" className="daily-link-button" onClick={showHint}><Lightbulb size={16} /> {t.hintNext} ({hintCount + 1}/{hints.length})</button>
                : <p className="daily-hints__empty">{t.hintsDone}</p>}
            </div>
          )}

          <p className="daily-streak">{mode === 'daily' ? t.streak(streak) : t.unlimitedNote}</p>

          <div className="daily-message" role="status" aria-live="polite">{message}</div>

          <div className="daily-board" aria-label={t.board}>
            {rows.map((row, r) => (
              <div key={r} className={`daily-row${row.current && shake ? ' is-shaking' : ''}`} role="group" aria-label={`${t.guess} ${r + 1}`}>
                {row.letters.map((letter, i) => {
                  const mark = row.marks[i]
                  return (
                    <span key={i} aria-label={letter.trim() ? `${upper(letter)}${markLabel(mark)}` : t.empty}
                      className={`daily-tile${letter.trim() ? ' is-filled' : ''}${mark ? ` is-${mark}` : ''}${r === revealRow ? ' is-revealing' : ''}`}
                      style={{ '--i': i } as CSSProperties}>{upper(letter.trim())}</span>
                  )
                })}
              </div>
            ))}
          </div>

          {finished && (
            <div className="daily-after">
              <p>{won ? t.wonIn(guesses.length) : <>{t.wasWord} <strong>{upper(answer)}</strong>.</>}</p>
              {!won || mode === 'unlimited' ? (
                <p className="daily-after__meaning">{t.meaning} {dictionaryLinks(answer, language).map((link, i) => <span key={link.href}>{i > 0 && ' · '}<a href={link.href} target="_blank" rel="noopener">{link.label}</a></span>)}</p>
              ) : null}
              <div className="daily-after__actions">
                <button type="button" className="daily-share" onClick={share}><Share2 size={18} /> {t.share}</button>
                {mode === 'unlimited'
                  ? <button type="button" className="daily-link-button" onClick={() => startMode('unlimited', true)}><RefreshCw size={16} /> {t.newWord}</button>
                  : <button type="button" className="daily-link-button" onClick={() => setModal('stats')}>{t.stats}</button>}
              </div>
              {mode !== 'unlimited' && <TryNext language={language} current="daily" />}
            </div>
          )}

          <div className="daily-keyboard" aria-label={t.keyboard}>
            {KEYBOARD_ROWS[language].map((row, r) => (
              <div key={r} className="daily-keys">
                {r === 2 && <button type="button" className="daily-key is-wide" onClick={() => press('enter')}>{t.enter}</button>}
                {[...row].map((key) => {
                  const mark = keys.get(key)
                  return <button type="button" key={key} className={`daily-key${mark ? ` is-${mark}` : ''}`} onClick={() => press(key)} aria-label={`${upper(key)}${markLabel(mark)}`}>{upper(key)}</button>
                })}
                {r === 2 && <button type="button" className="daily-key is-wide" onClick={() => press('back')} aria-label={t.del}><Delete size={20} /></button>}
              </div>
            ))}
          </div>
        </section>

        <section className="daily-notes">{NOTES[language]}</section>

        <MoreWordTools language={language} current="daily" />
      </main>

      {modal !== 'none' && (
        <div className="daily-overlay" onClick={(event) => { if (event.target === event.currentTarget) setModal('none') }}>
          <div className="daily-modal" role="dialog" aria-modal="true" aria-labelledby="daily-modal-title">
            <button ref={closeButton} type="button" className="daily-close" onClick={() => setModal('none')} aria-label={t.close}><X size={20} /></button>
            {modal === 'help' ? (
              <>
                <h2 id="daily-modal-title">{t.help}</h2>
                <p>{t.helpText}</p>
                <div className="daily-example" aria-hidden="true">
                  {[...t.example].map((letter, i) => <span key={i} className={`daily-tile is-filled${i === 0 ? ' is-correct' : i === t.exampleNear ? ' is-present' : ''}`}>{upper(letter)}</span>)}
                </div>
                <p>{t.helpLegend}</p>
                <p>{t.helpModes}</p>
                <button type="button" className="daily-share" onClick={() => setModal('none')}>{t.play}</button>
              </>
            ) : (
              <>
                <h2 id="daily-modal-title">{dailyDone ? (won ? t.won : t.lost) : t.stats}</h2>
                {dailyDone && (
                  <div className="daily-answer">
                    <div className="daily-example" aria-label={upper(answer)}>
                      {[...answer].map((letter, i) => <span key={i} className="daily-tile is-filled is-correct">{upper(letter)}</span>)}
                    </div>
                    <p>{t.meaning} {dictionaryLinks(answer, language).map((link, i) => <span key={link.href}>{i > 0 && ' · '}<a href={link.href} target="_blank" rel="noopener">{link.label}</a></span>)}</p>
                  </div>
                )}
                {mode === 'unlimited' && <p className="daily-hint">{t.unlimitedStats}</p>}
                <dl className="daily-stats">
                  <div><dt>{t.played}</dt><dd>{stats.played}</dd></div>
                  <div><dt>{t.winRate}</dt><dd>{winRate}%</dd></div>
                  <div><dt>{t.current}</dt><dd>{streak}</dd></div>
                  <div><dt>{t.best}</dt><dd>{stats.maxStreak}</dd></div>
                </dl>
                <h3>{t.distribution}</h3>
                <ol className="daily-dist">
                  {stats.distribution.map((count, i) => (
                    <li key={i}>
                      <span>{i + 1}</span>
                      <span className={`daily-bar${dailyDone && won && guesses.length === i + 1 ? ' is-today' : ''}`} style={{ width: `${Math.max(8, (count / maxDist) * 100)}%` }}>{count}</span>
                    </li>
                  ))}
                </ol>
                {dailyDone ? (
                  <div className="daily-next">
                    <div><span>{t.next}</span><strong>{countdown}</strong></div>
                    <button type="button" className="daily-share" onClick={share}><Share2 size={18} /> {t.share}</button>
                  </div>
                ) : mode === 'daily' ? (
                  <p className="daily-hint">{t.finishFirst}</p>
                ) : null}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
