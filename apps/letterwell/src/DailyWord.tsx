// "Дума на деня": the daily Bulgarian five-letter word game at /letterwell/bg/duma-na-denya/.
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { BarChart3, CircleHelp, Delete, Share2, Sparkles, X } from 'lucide-react'
import { track } from '@zyankov/design-system/analytics'
import { HeroDecor } from './Playful'
import { MoreWordTools, ToolLinks } from './ToolNav'
import { pagePath, type Language } from './seo'
import { loadWordleList, WORD_LENGTH } from './wordle'
import { dictionaryLinks } from './meanings'
import {
  answerFor, currentStreak, DAILY_WORDS, emptyStats, KEYBOARD_ROWS, keyMarks, LATIN_TO_CYRILLIC, markGuess, MAX_GUESSES,
  msUntilNext, puzzleNumber, recordResult, shareText, type Mark, type Stats,
} from './daily'
import './wordle.css'
import './daily.css'

const GAME_KEY = 'zy-daily-game-v1'
const STATS_KEY = 'zy-daily-stats-v1'
const SHARE_URL = 'zyankov.eu/duma'
const BG_LETTERS = /^[а-ъьюя]$/

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

const upper = (text: string) => text.toLocaleUpperCase('bg-BG')

function formatCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`
}

export default function DailyWord({ language = 'bg' }: { language?: Language }) {
  void language
  const [puzzle, setPuzzle] = useState<number | null>(null)
  const [guesses, setGuesses] = useState<string[]>([])
  const [current, setCurrent] = useState('')
  const [valid, setValid] = useState<Set<string> | null>(null)
  const [stats, setStats] = useState<Stats>(emptyStats)
  const [message, setMessage] = useState('')
  const [shake, setShake] = useState(false)
  const [revealRow, setRevealRow] = useState(-1)
  const [modal, setModal] = useState<'none' | 'help' | 'stats'>('none')
  const [countdown, setCountdown] = useState('')
  const messageTimer = useRef<number | undefined>(undefined)
  // Latest typed word and guesses, so fast typing never submits a stale word.
  const currentRef = useRef('')
  const guessesRef = useRef<string[]>([])
  const setTyped = (value: string) => { currentRef.current = value; setCurrent(value) }
  const closeButton = useRef<HTMLButtonElement>(null)

  const answer = puzzle ? answerFor(puzzle) : ''
  const won = guesses.length > 0 && guesses[guesses.length - 1] === answer
  const finished = won || guesses.length >= MAX_GUESSES
  const keys = useMemo(() => keyMarks(guesses, answer), [guesses, answer])

  // Today's puzzle, the saved game and stats (client only: the page is prerendered without a date).
  useEffect(() => {
    const today = puzzleNumber()
    setPuzzle(today)
    const saved = readJson<{ puzzle: number; guesses: string[] }>(GAME_KEY)
    if (saved?.puzzle === today && Array.isArray(saved.guesses)) {
      guessesRef.current = saved.guesses.slice(0, MAX_GUESSES)
      setGuesses(guessesRef.current)
    }
    const savedStats = readJson<Stats>(STATS_KEY)
    if (savedStats) setStats({ ...emptyStats(), ...savedStats })
    if (!saved && !savedStats) setModal('help')
    let active = true
    loadWordleList('bg')
      .then((list) => { if (active) setValid(new Set([...list.common, ...list.rare, ...DAILY_WORDS])) })
      .catch(() => { if (active) setValid(new Set(DAILY_WORDS)) })
    return () => { active = false }
  }, [])

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
    const current = currentRef.current
    const guesses = guessesRef.current
    if (!puzzle || guesses.includes(answer) || guesses.length >= MAX_GUESSES) return
    if (current.length < WORD_LENGTH) return flash('Трябват 5 букви', true)
    if (valid && !valid.has(current)) return flash('Няма такава дума в речника', true)
    const next = [...guesses, current]
    guessesRef.current = next
    setGuesses(next)
    setTyped('')
    setRevealRow(next.length - 1)
    writeJson(GAME_KEY, { puzzle, guesses: next })
    const isWin = current === answer
    if (isWin || next.length >= MAX_GUESSES) {
      const updated = recordResult(stats, puzzle, isWin, next.length)
      setStats(updated)
      writeJson(STATS_KEY, updated)
      track('daily_finish', { result: isWin ? 'win' : 'loss', guesses: next.length })
      window.setTimeout(() => {
        flash(isWin ? ['Гениално!', 'Великолепно!', 'Браво!', 'Много добре!', 'Добре!', 'На косъм!'][next.length - 1] : upper(answer))
        setModal('stats')
      }, 1700)
    } else if (next.length === 1) {
      track('daily_start', {})
    }
  }, [answer, flash, puzzle, stats, valid])

  const press = useCallback((key: string) => {
    if (finished || !puzzle) return
    if (key === 'enter') return submit()
    if (key === 'back') return setTyped(currentRef.current.slice(0, -1))
    if (BG_LETTERS.test(key) && currentRef.current.length < WORD_LENGTH) setTyped(currentRef.current + key)
  }, [finished, puzzle, submit])

  // Physical keyboard: Cyrillic, or Latin keys mapped to the phonetic layout.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || modal !== 'none') return
      const target = event.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      if (event.key === 'Enter') { event.preventDefault(); press('enter'); return }
      if (event.key === 'Backspace') { press('back'); return }
      const key = event.key.toLocaleLowerCase('bg-BG')
      const letter = BG_LETTERS.test(key) ? key : LATIN_TO_CYRILLIC[key]
      if (letter) press(letter)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modal, press])

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
    if (!puzzle) return
    const text = shareText(puzzle, guesses, answer, won, SHARE_URL)
    track('daily_share', {})
    try {
      if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
        await navigator.share({ text })
        return
      }
      await navigator.clipboard.writeText(text)
      flash('Резултатът е копиран. Постави го в чата.')
    } catch {
      // The user closed the share sheet.
    }
  }

  const rows = Array.from({ length: MAX_GUESSES }, (_, row) => {
    if (row < guesses.length) {
      const marks = markGuess(guesses[row], answer)
      return { letters: [...guesses[row]], marks: marks as (Mark | null)[], state: 'done' as const }
    }
    if (row === guesses.length && !finished) return { letters: [...current.padEnd(WORD_LENGTH, ' ')], marks: Array(WORD_LENGTH).fill(null), state: 'current' as const }
    return { letters: Array(WORD_LENGTH).fill(' '), marks: Array(WORD_LENGTH).fill(null), state: 'empty' as const }
  })

  const streak = puzzle ? currentStreak(stats, puzzle) : 0
  const maxDist = Math.max(1, ...stats.distribution)
  const winRate = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0

  return (
    <div className="app-shell wordle-page daily-page">
      <header className="topbar">
        <a className="brand" href={pagePath('finder', 'bg')} aria-label="Letterwell">
          <span className="brand-mark"><Sparkles size={18} strokeWidth={2.2} /></span>
          <span>letterwell</span>
        </a>
        <div className="topbar-actions">
          <div className="topbar-note"><span className="status-dot" />Нова дума всеки ден</div>
          <ToolLinks language="bg" current="daily" />
        </div>
      </header>

      <main id="top">
        <section className="wordle-intro daily-intro" aria-labelledby="page-title">
          <HeroDecor variant="wordle" language="bg" />
          <p className="eyebrow"><span className="eyebrow-line" />{puzzle ? `№ ${puzzle}` : 'Игра на думи'}<span className="eyebrow-line" /></p>
          <h1 id="page-title">Дума на <em>деня</em></h1>
          <p className="intro-description">Познай думата от 5 букви с 6 опита. Една и съща дума за всички, нова всеки ден в полунощ.</p>
        </section>

        <section className="daily-game" aria-label="Игра">
          <div className="daily-toolbar">
            <button type="button" className="daily-icon" onClick={() => setModal('help')} aria-label="Как се играе"><CircleHelp size={20} /></button>
            <span className="daily-streak">{streak > 0 ? `Серия: ${streak} ${streak === 1 ? 'ден' : 'дни'}` : 'Започни серия днес'}</span>
            <button type="button" className="daily-icon" onClick={() => setModal('stats')} aria-label="Статистика"><BarChart3 size={20} /></button>
          </div>

          <div className="daily-message" role="status" aria-live="polite">{message}</div>

          <div className="daily-board" aria-label="Опити">
            {rows.map((row, r) => (
              <div key={r} className={`daily-row${row.state === 'current' && shake ? ' is-shaking' : ''}`} role="group" aria-label={`Опит ${r + 1}`}>
                {row.letters.map((letter, i) => {
                  const mark = row.marks[i]
                  const label = letter.trim() ? `${upper(letter)}${mark ? `, ${mark === 'correct' ? 'на място' : mark === 'present' ? 'на друго място' : 'няма я'}` : ''}` : 'празно'
                  return (
                    <span key={i} aria-label={label}
                      className={`daily-tile${letter.trim() ? ' is-filled' : ''}${mark ? ` is-${mark}` : ''}${r === revealRow ? ' is-revealing' : ''}`}
                      style={{ '--i': i } as CSSProperties}>{upper(letter.trim())}</span>
                  )
                })}
              </div>
            ))}
          </div>

          {finished && (
            <div className="daily-after">
              <p>{won ? `Позна от ${guesses.length} ${guesses.length === 1 ? 'опит' : 'опита'}!` : <>Думата беше <strong>{upper(answer)}</strong>.</>}</p>
              <div className="daily-after__actions">
                <button type="button" className="daily-share" onClick={share}><Share2 size={18} /> Сподели</button>
                <button type="button" className="daily-link-button" onClick={() => setModal('stats')}>Статистика</button>
              </div>
            </div>
          )}

          <div className="daily-keyboard" aria-label="Клавиатура">
            {KEYBOARD_ROWS.map((row, r) => (
              <div key={r} className="daily-keys">
                {r === 2 && <button type="button" className="daily-key is-wide" onClick={() => press('enter')}>Готово</button>}
                {[...row].map((key) => {
                  const mark = keys.get(key)
                  return (
                    <button type="button" key={key} className={`daily-key${mark ? ` is-${mark}` : ''}`} onClick={() => press(key)} aria-label={`${upper(key)}${mark ? `, ${mark === 'correct' ? 'на място' : mark === 'present' ? 'на друго място' : 'няма я'}` : ''}`}>{upper(key)}</button>
                  )
                })}
                {r === 2 && <button type="button" className="daily-key is-wide" onClick={() => press('back')} aria-label="Изтрий"><Delete size={20} /></button>}
              </div>
            ))}
          </div>
        </section>

        <section className="daily-notes">
          <article>
            <h2>Как се играе</h2>
            <p>Напиши дума от 5 букви и натисни „Готово“. Плочките сменят цвета си:</p>
            <ul className="daily-legend">
              <li><span className="daily-tile is-filled is-correct">К</span> буквата е в думата и на точното място;</li>
              <li><span className="daily-tile is-filled is-present">Н</span> буквата е в думата, но на друго място;</li>
              <li><span className="daily-tile is-filled is-absent">П</span> буквата я няма в думата.</li>
            </ul>
            <p>Имаш 6 опита. Думата е една и съща за всички и се сменя всеки ден в полунощ българско време. Може да пишеш и от клавиатурата, на кирилица или с латинските клавиши по фонетичната подредба.</p>
          </article>
          <article>
            <h2>Въпроси</h2>
            <h3>Какви думи има?</h3>
            <p>Познати съществителни и прилагателни в основна форма, без имена, съкращения и ругатни. Опитите може да са всяка дума от 5 букви от речника ни.</p>
            <h3>Как се пази серията?</h3>
            <p>Серията са дните подред, в които си познал думата. Пази се в този браузър, без регистрация. Ако пропуснеш ден, започва отначало.</p>
            <h3>Заседнал съм.</h3>
            <p><a href={pagePath('wordle', 'bg')}>Помощникът за Wordle</a> показва кои думи още пасват на цветовете ти. Ползвай го, ако искаш, но серията е по-сладка без него.</p>
          </article>
        </section>

        <MoreWordTools language="bg" current="daily" />
      </main>

      {modal !== 'none' && (
        <div className="daily-overlay" onClick={(event) => { if (event.target === event.currentTarget) setModal('none') }}>
          <div className="daily-modal" role="dialog" aria-modal="true" aria-labelledby="daily-modal-title">
            <button ref={closeButton} type="button" className="daily-close" onClick={() => setModal('none')} aria-label="Затвори"><X size={20} /></button>
            {modal === 'help' ? (
              <>
                <h2 id="daily-modal-title">Как се играе</h2>
                <p>Познай думата от 5 букви с 6 опита. След всеки опит плочките показват колко си близо.</p>
                <div className="daily-example" aria-hidden="true">
                  {['к', 'н', 'и', 'г', 'а'].map((letter, i) => <span key={i} className={`daily-tile is-filled${i === 0 ? ' is-correct' : i === 1 ? ' is-present' : ''}`}>{upper(letter)}</span>)}
                </div>
                <p><strong>К</strong> е на точното място, <strong>Н</strong> е в думата, но на друго място, а сивите букви ги няма.</p>
                <p>Нова дума всеки ден в полунощ. Сподели резултата с приятели, без да издаваш думата.</p>
                <button type="button" className="daily-share" onClick={() => setModal('none')}>Да играем</button>
              </>
            ) : (
              <>
                <h2 id="daily-modal-title">{finished ? (won ? 'Браво!' : 'Този път не') : 'Статистика'}</h2>
                {finished && (
                  <div className="daily-answer">
                    <div className="daily-example" aria-label={`Думата: ${upper(answer)}`}>
                      {[...answer].map((letter, i) => <span key={i} className="daily-tile is-filled is-correct">{upper(letter)}</span>)}
                    </div>
                    <p>Какво значи: {dictionaryLinks(answer, 'bg').map((link, i) => <span key={link.href}>{i > 0 && ' · '}<a href={link.href} target="_blank" rel="noopener">{link.label}</a></span>)}</p>
                  </div>
                )}
                <dl className="daily-stats">
                  <div><dt>изиграни</dt><dd>{stats.played}</dd></div>
                  <div><dt>победи</dt><dd>{winRate}%</dd></div>
                  <div><dt>серия</dt><dd>{streak}</dd></div>
                  <div><dt>най-дълга серия</dt><dd>{stats.maxStreak}</dd></div>
                </dl>
                <h3>Разпределение на опитите</h3>
                <ol className="daily-dist">
                  {stats.distribution.map((count, i) => (
                    <li key={i}>
                      <span>{i + 1}</span>
                      <span className={`daily-bar${finished && won && guesses.length === i + 1 ? ' is-today' : ''}`} style={{ width: `${Math.max(8, (count / maxDist) * 100)}%` }}>{count}</span>
                    </li>
                  ))}
                </ol>
                {finished ? (
                  <div className="daily-next">
                    <div><span>Следваща дума след</span><strong>{countdown}</strong></div>
                    <button type="button" className="daily-share" onClick={share}><Share2 size={18} /> Сподели</button>
                  </div>
                ) : (
                  <p className="daily-hint">Довърши днешната дума, за да я добавиш към статистиката.</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
