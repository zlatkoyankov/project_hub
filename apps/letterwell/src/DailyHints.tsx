// Hints for the daily word on a page of their own: /letterwell/bg/duma-na-denya/podskazki/ and
// /letterwell/daily/hints/. The page is prerendered without a date; today's puzzle, its hints and
// yesterday's word are worked out in the browser. Opened hints are shared with the game
// (the same `${storage}-hints-v1` key), so the game shows the ones opened here.
import { useEffect, useState } from 'react'
import { ArrowRight, Eye, Lightbulb, Sparkles } from 'lucide-react'
import { track } from '@zyankov/design-system/analytics'
import { HeroDecor } from './Playful'
import { MoreWordTools, ToolLinks } from './ToolNav'
import { pagePath, type Language } from './seo'
import { dictionaryLinks } from './meanings'
import { answerFor, EPOCH, hintsFor, msUntilNext, puzzleNumber } from './daily'
import './wordle.css'
import './daily.css'

const DAY_MS = 24 * 60 * 60 * 1000

const TEXT = {
  bg: {
    titleFirst: 'Подсказки за', titleEmphasis: 'Дума на деня', note: 'Нови всеки ден в полунощ', eyebrow: 'Подсказки',
    intro: 'Подсказки за днешната дума от 5 букви, една по една. Отвори само толкова, колкото ти трябват: думата се показва само ако я поискаш.',
    storage: 'zy-daily', locale: 'bg-BG',
    today: (n: number, date: string) => `Дума на деня № ${n} · ${date}`,
    loading: 'Зареждаме днешните подсказки…',
    hintNext: 'Покажи подсказка', hintsDone: 'Това бяха всички подсказки.',
    reveal: 'Покажи думата', revealSure: 'Сигурен ли си? Покажи думата', wordIs: 'Думата е',
    play: 'Играй днешната дума', next: (time: string) => `Нови подсказки след ${time}`,
    yesterday: (n: number) => `Вчерашната дума (№ ${n})`, showYesterday: 'Покажи вчерашната дума', meaning: 'Значение:',
  },
  en: {
    titleFirst: 'Letterwell Daily', titleEmphasis: 'hints', note: 'New every day', eyebrow: 'Hints',
    intro: 'Hints for today’s five-letter word, one at a time. Open only as many as you need: the word is shown only if you ask for it.',
    storage: 'zy-daily-en', locale: 'en-GB',
    today: (n: number, date: string) => `Letterwell Daily #${n} · ${date}`,
    loading: 'Loading today’s hints…',
    hintNext: 'Show a hint', hintsDone: 'That is every hint.',
    reveal: 'Show the word', revealSure: 'Sure? Show the word', wordIs: 'The word is',
    play: 'Play today’s word', next: (time: string) => `New hints in ${time}`,
    yesterday: (n: number) => `Yesterday’s word (#${n})`, showYesterday: 'Show yesterday’s word', meaning: 'Meaning:',
  },
} as const

/** The worked example in "How the hints work": a word the game also uses in its help. */
const EXAMPLE = { bg: 'книга', en: 'bread' } as const

function Notes({ language }: { language: Language }) {
  const example = EXAMPLE[language]
  const hints = hintsFor(example, language)
  const upper = example.toLocaleUpperCase(language === 'bg' ? 'bg-BG' : 'en-GB')
  if (language === 'bg') return (
    <>
      <article>
        <h2>Как работят подсказките</h2>
        <p>Подсказките са четири и вървят от най-общата към най-конкретната. Всяка стеснява възможните думи, но никоя не издава думата сама.</p>
        <ol>
          <li><strong>Колко гласни има.</strong> В българския гласните са А, Е, И, О, У, Ъ, както и Ю и Я.</li>
          <li><strong>Дали има повтаряща се буква.</strong> Ако има, пробвай думи с една буква два пъти.</li>
          <li><strong>Първата буква.</strong></li>
          <li><strong>Последната буква.</strong></li>
        </ol>
        <p>Пример с думата {upper}: „{hints[0]}“ → „{hints[1]}“ → „{hints[2]}“ → „{hints[3]}“ След третата подсказка още пасват думи като кабел, кадър и книга; четвъртата оставя само тези, които завършват на А.</p>
      </article>
      <article>
        <h2>Как да познаеш по-бързо</h2>
        <ul>
          <li>Започни с дума с няколко различни гласни, за да разбереш бързо кои ги има.</li>
          <li>Не ползвай отново сивите букви: всеки опит с тях губи място за нова информация.</li>
          <li>Кораловата плочка е заключена на мястото си. Синьото кръгче казва, че буквата е в думата, но трябва да се премести.</li>
          <li>Ако след четири опита не можеш да се сетиш, отвори първата подсказка, а не всички наведнъж.</li>
          <li>Упражнявай се в режим „Неограничено“ на <a href={pagePath('daily', 'bg')}>страницата на играта</a>: там думите са случайни и не пипат серията.</li>
        </ul>
      </article>
      <article>
        <h2>Въпроси</h2>
        <h3>Кога се сменят подсказките?</h3>
        <p>Заедно с думата, в полунощ българско време. Думата е една и съща за всички играчи.</p>
        <h3>Подсказките тук и в играта едни и същи ли са?</h3>
        <p>Да. Отворените тук подсказки се виждат и под крушката в играта, в този браузър. Нищо не се изпраща към сървър.</p>
        <h3>Мога ли да видя предишни думи?</h3>
        <p>Вчерашната дума е по-горе, с връзка към тълковния речник. За повече игра има режим „Неограничено“.</p>
        <h3>Искам да видя всички думи, които пасват.</h3>
        <p><a href={pagePath('wordle', 'bg')}>Помощникът за Wordle</a> показва думите, които още пасват на опитите ти.</p>
      </article>
    </>
  )
  return (
    <>
      <article>
        <h2>How the hints work</h2>
        <p>There are four hints, from the vaguest to the most specific. Each one narrows the possible words, but none gives the word away on its own.</p>
        <ol>
          <li><strong>How many vowels it has</strong> (A, E, I, O, U; Y is not counted).</li>
          <li><strong>Whether a letter repeats.</strong> If one does, try words with a double letter.</li>
          <li><strong>The first letter.</strong></li>
          <li><strong>The last letter.</strong></li>
        </ol>
        <p>An example with {upper}: “{hints[0]}” → “{hints[1]}” → “{hints[2]}” → “{hints[3]}” After the third hint, words like bacon, blade and board still fit; the fourth leaves only those ending in D, such as board and bread.</p>
      </article>
      <article>
        <h2>How to solve it faster</h2>
        <ul>
          <li>Open with a word that has several different vowels, so you learn quickly which ones are in.</li>
          <li>Do not reuse grey letters: every guess that includes them wastes room for new information.</li>
          <li>A coral tile is locked in place. A blue circle means the letter is in the word but has to move.</li>
          <li>If you are stuck after four guesses, open the first hint, not all of them at once.</li>
          <li>Practise in Unlimited mode on the <a href={pagePath('daily', 'en')}>game page</a>: the words are random and your streak is not affected.</li>
        </ul>
      </article>
      <article>
        <h2>Questions</h2>
        <h3>When do the hints change?</h3>
        <p>With the word, at midnight Sofia time (late evening in the UK and the Americas). Everyone gets the same word.</p>
        <h3>Are these the same hints as in the game?</h3>
        <p>Yes. Hints you open here also show under the light bulb in the game, in this browser. Nothing is sent to a server.</p>
        <h3>Can I see earlier words?</h3>
        <p>Yesterday’s word is above, with links to a dictionary. For more games, try Unlimited mode.</p>
        <h3>I want to see every word that still fits.</h3>
        <p>The <a href={pagePath('wordle', 'en')}>Wordle helper</a> lists the words that still match your guesses.</p>
      </article>
    </>
  )
}

function formatCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}`
}

export default function DailyHints({ language = 'bg' }: { language?: Language }) {
  const t = TEXT[language]
  const hintsKey = `${t.storage}-hints-v1`
  const upper = (text: string) => text.toLocaleUpperCase(t.locale)
  const [puzzle, setPuzzle] = useState<number | null>(null)
  const [shown, setShown] = useState(0)
  const [reveal, setReveal] = useState<'no' | 'ask' | 'yes'>('no')
  const [yesterdayOpen, setYesterdayOpen] = useState(false)
  const [countdown, setCountdown] = useState('')

  // Client only: the prerendered page has no date.
  useEffect(() => {
    const today = puzzleNumber()
    setPuzzle(today)
    try {
      const saved = JSON.parse(localStorage.getItem(hintsKey) || 'null') as { puzzle: number; shown: number } | null
      if (saved && saved.puzzle === today) setShown(saved.shown)
    } catch { /* nothing saved */ }
    const tick = () => setCountdown(formatCountdown(msUntilNext()))
    tick()
    const timer = window.setInterval(tick, 30_000)
    return () => window.clearInterval(timer)
  }, [hintsKey])

  const answer = puzzle ? answerFor(puzzle, language) : ''
  const hints = answer ? hintsFor(answer, language) : []
  const date = puzzle ? new Date(EPOCH + (puzzle - 1) * DAY_MS).toLocaleDateString(t.locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : ''
  const yesterday = puzzle && puzzle > 1 ? answerFor(puzzle - 1, language) : ''

  const showHint = () => {
    if (!puzzle) return
    const next = Math.min(hints.length, shown + 1)
    setShown(next)
    try { localStorage.setItem(hintsKey, JSON.stringify({ puzzle, shown: next })) } catch { /* storage unavailable */ }
    track('daily_hint', { level: next, mode: 'daily', language, source: 'hints_page' })
  }
  const revealWord = () => {
    if (reveal === 'no') return setReveal('ask')
    setReveal('yes')
    track('daily_hint_reveal', { language })
  }

  return (
    <div className="app-shell wordle-page daily-page hints-page">
      <header className="topbar">
        <a className="brand" href={pagePath('finder', language)} aria-label="Letterwell">
          <span className="brand-mark"><Sparkles size={18} strokeWidth={2.2} /></span>
          <span>letterwell</span>
        </a>
        <div className="topbar-actions">
          <div className="topbar-note"><span className="status-dot" />{t.note}</div>
          <ToolLinks language={language} current="hints" />
          <label className="language-picker">
            <span className="sr-only">{language === 'bg' ? 'Език' : 'Language'}</span>
            <select value={language} onChange={(event) => window.location.assign(pagePath('hints', event.target.value as Language))} aria-label={language === 'bg' ? 'Език' : 'Language'}>
              <option value="en">EN</option>
              <option value="bg">БГ</option>
            </select>
          </label>
        </div>
      </header>
      <main id="top">
        <section className="wordle-intro daily-intro" aria-labelledby="page-title">
          <HeroDecor variant="daily" language={language} />
          <p className="eyebrow"><span className="eyebrow-line" />{puzzle ? `№ ${puzzle}` : t.eyebrow}<span className="eyebrow-line" /></p>
          <h1 id="page-title">{t.titleFirst} <em>{t.titleEmphasis}</em></h1>
          <p className="intro-description">{t.intro}</p>
        </section>

        <section className="hints-today" aria-live="polite">
          {!puzzle ? <p className="daily-hints__empty">{t.loading}</p> : (
            <>
              <h2>{t.today(puzzle, date)}</h2>
              {shown > 0 && <ol>{hints.slice(0, shown).map((hint) => <li key={hint}>{hint}</li>)}</ol>}
              {shown < hints.length
                ? <button type="button" className="daily-share" onClick={showHint}><Lightbulb size={18} /> {t.hintNext} ({shown + 1}/{hints.length})</button>
                : (
                  <>
                    <p className="daily-hints__empty">{t.hintsDone}</p>
                    {reveal === 'yes'
                      ? <p className="hints-word">{t.wordIs} <strong>{upper(answer)}</strong>.</p>
                      : <button type="button" className="daily-link-button" onClick={revealWord}><Eye size={16} /> {reveal === 'ask' ? t.revealSure : t.reveal}</button>}
                  </>
                )}
              <p className="hints-actions">
                <a className="daily-link-button" href={`${pagePath('daily', language)}#hints`}>{t.play} <ArrowRight size={16} /></a>
                <span>{t.next(countdown)}</span>
              </p>
              {yesterday && (
                <div className="hints-yesterday">
                  <h3>{t.yesterday(puzzle - 1)}</h3>
                  {yesterdayOpen ? (
                    <p><strong>{upper(yesterday)}</strong>. {t.meaning} {dictionaryLinks(yesterday, language).map((link, i) => <span key={link.href}>{i > 0 && ' · '}<a href={link.href} target="_blank" rel="noopener">{link.label}</a></span>)}</p>
                  ) : <button type="button" className="daily-link-button" onClick={() => setYesterdayOpen(true)}><Eye size={16} /> {t.showYesterday}</button>}
                </div>
              )}
            </>
          )}
        </section>

        <section className="daily-notes"><Notes language={language} /></section>
        <MoreWordTools language={language} current="hints" />
      </main>
    </div>
  )
}
