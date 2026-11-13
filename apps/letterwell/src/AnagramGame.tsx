// "Анаграма на деня" (/letterwell/bg/anagrama-na-denya/) and "Letterwell Anagram" (/letterwell/anagram/):
// one six-letter word a day with shuffled letters. Tap the letters or type them, then check.
// Logic and word lists are in anagram.ts. The page is prerendered without a date; the puzzle is
// worked out in the browser, like the daily word game.
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowRight, Delete, Eye, Lightbulb, Shuffle, Sparkles } from 'lucide-react'
import { track } from '@zyankov/design-system/analytics'
import { HeroDecor } from './Playful'
import { MoreWordTools, ToolLinks } from './ToolNav'
import { pagePath, type Language } from './seo'
import { dictionaryLinks } from './meanings'
import { getDictionary } from './dictionary'
import { LATIN_TO_CYRILLIC, currentStreak, emptyStats, msUntilNext, puzzleNumber, type Stats } from './daily'
import { anagramFor, anagramHints, anagramShareText, checkGuess, currentAnagramStreak, dailyScramble, emptyAnagramStats, recordAnagram, scramble, type AnagramStats } from './anagram'
import './wordle.css'
import './daily.css'
import './anagram.css'

const TEXT = {
  bg: {
    titleFirst: 'Анаграма', titleEmphasis: 'на деня', note: 'Нова всеки ден в полунощ', eyebrow: 'Игра',
    intro: 'Шест разбъркани букви, една дума. Подреди ги и познай думата на деня. Подсказките са по желание.',
    storage: 'zy-anagram', dailyStorage: 'zy-daily', locale: 'bg-BG', share: 'zyankov.eu/letterwell/bg/anagrama-na-denya/',
    heading: (n: number) => `Анаграма на деня № ${n}`,
    loading: 'Зареждаме днешните букви…', check: 'Провери', shuffle: 'Разбъркай', clear: 'Изтрий',
    solved: 'Позна! Думата е', otherWord: (w: string) => `„${w}“ също е дума от тези букви, но днешната е друга. Опитай пак.`,
    notWord: 'Няма такава дума в речника. Опитай друга подредба.', wrongLetters: 'Ползвай точно шестте букви.',
    hint: 'Подсказка', hintsLeft: (n: number) => `остават ${n}`, giveUp: 'Покажи думата', giveUpSure: 'Сигурен ли си? Покажи думата', gaveUp: 'Думата беше',
    meaning: 'Значение:', shareBtn: 'Сподели резултата', copied: 'Копирано!', next: (time: string) => `Нова анаграма след ${time}`,
    stats: ['Решени', 'Серия', 'Най-дълга серия', 'Без подсказки'], daily: 'Дума на деня', dailyStreak: (n: number) => `серия ${n}`,
    yesterday: (n: number) => `Вчерашната анаграма (№ ${n})`, showYesterday: 'Покажи вчерашната дума',
  },
  en: {
    titleFirst: 'Letterwell', titleEmphasis: 'Anagram', note: 'New every day', eyebrow: 'Game',
    intro: 'Six shuffled letters, one word. Put them in order and find today’s word. Hints are there if you want them.',
    storage: 'zy-anagram-en', dailyStorage: 'zy-daily-en', locale: 'en-GB', share: 'zyankov.eu/letterwell/anagram/',
    heading: (n: number) => `Letterwell Anagram #${n}`,
    loading: 'Loading today’s letters…', check: 'Check', shuffle: 'Shuffle', clear: 'Clear',
    solved: 'You got it! The word is', otherWord: (w: string) => `“${w}” is also a word from these letters, but today’s is another. Try again.`,
    notWord: 'That is not in the dictionary. Try another order.', wrongLetters: 'Use exactly the six letters.',
    hint: 'Hint', hintsLeft: (n: number) => `${n} left`, giveUp: 'Show the word', giveUpSure: 'Sure? Show the word', gaveUp: 'The word was',
    meaning: 'Meaning:', shareBtn: 'Share your result', copied: 'Copied!', next: (time: string) => `New anagram in ${time}`,
    stats: ['Solved', 'Streak', 'Best streak', 'No hints'], daily: 'Letterwell Daily', dailyStreak: (n: number) => `streak ${n}`,
    yesterday: (n: number) => `Yesterday’s anagram (#${n})`, showYesterday: 'Show yesterday’s word',
  },
} as const

interface Today {
  puzzle: number
  hints: number
  guesses: number
  solved: boolean
  gaveUp: boolean
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? { ...fallback, ...(JSON.parse(raw) as T) } : fallback
  } catch {
    return fallback
  }
}
function write(key: string, value: unknown) {
  try { window.localStorage.setItem(key, JSON.stringify(value)) } catch { /* private mode: the game still works */ }
}

function countdownText(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}`
}

function Notes({ language }: { language: Language }) {
  if (language === 'bg') return (
    <>
      <article>
        <h2>Как се играе</h2>
        <p>Всеки ден има една дума от шест букви. Буквите са разбъркани. Натисни ги в правилния ред или ги напиши от клавиатурата, после „Провери“. Опитите са без ограничение.</p>
        <p>Ако от същите букви става друга истинска дума, играта ти казва, но решение е само думата на деня. Подсказките са три: първата буква, последната буква и първите три букви.</p>
      </article>
      <article>
        <h2>Как да я решиш по-бързо</h2>
        <ul>
          <li>Търси познати окончания: -ка, -ца, -ник, -ина, -ост.</li>
          <li>Пробвай гласните между съгласните и първо подреди буквите, които обикновено вървят заедно.</li>
          <li>Натисни „Разбъркай“: нов ред на буквите често показва думата.</li>
          <li>Блокирал си? <a href={pagePath('finder', 'bg')}>Търсачката за думи</a> намира всички думи от тези букви, но това вече е измама.</li>
        </ul>
      </article>
      <article>
        <h2>Въпроси</h2>
        <h3>Кога има нова анаграма?</h3>
        <p>Всеки ден в полунощ българско време, заедно с <a href={pagePath('daily', 'bg')}>Дума на деня</a>. Номерът е същият.</p>
        <h3>Пази ли се серията?</h3>
        <p>Да, в този браузър. Серията продължава, ако решиш анаграмата и на следващия ден, с или без подсказки. „Покажи думата“ я прекъсва.</p>
        <h3>Откъде са думите?</h3>
        <p>Подбрани са често срещани думи от шест букви, проверени в речника на Letterwell. Никоя от тях не е дума от „Дума на деня“.</p>
      </article>
    </>
  )
  return (
    <>
      <article>
        <h2>How to play</h2>
        <p>Every day there is one six-letter word with its letters shuffled. Tap them in the right order or type them, then press Check. There is no limit on guesses.</p>
        <p>If the letters also make another real word, the game tells you, but only the word of the day solves it. There are three hints: the first letter, the last letter and the first three letters.</p>
      </article>
      <article>
        <h2>How to solve it faster</h2>
        <ul>
          <li>Look for common endings: -er, -le, -et, -on, -ow.</li>
          <li>Put vowels between consonants and try likely pairs such as th, ch, st.</li>
          <li>Press Shuffle: a new order often shows the word.</li>
          <li>Stuck? The <a href={pagePath('finder', 'en')}>word finder</a> lists every word from these letters, but that is cheating.</li>
        </ul>
      </article>
      <article>
        <h2>Questions</h2>
        <h3>When is there a new anagram?</h3>
        <p>Every day at midnight Sofia time, together with <a href={pagePath('daily', 'en')}>Letterwell Daily</a>, with the same number.</p>
        <h3>Is my streak saved?</h3>
        <p>Yes, in this browser. Solve the next day’s anagram, with or without hints, to keep it going. Showing the word ends it.</p>
        <h3>Where do the words come from?</h3>
        <p>They are common six-letter words, checked against the Letterwell dictionary. None of them is a Letterwell Daily answer.</p>
      </article>
    </>
  )
}

export default function AnagramGame({ language = 'bg' }: { language?: Language }) {
  const t = TEXT[language]
  const todayKey = `${t.storage}-today-v1`
  const statsKey = `${t.storage}-stats-v1`
  const upper = useCallback((text: string) => text.toLocaleUpperCase(t.locale), [t.locale])
  const [puzzle, setPuzzle] = useState<number | null>(null)
  const [letters, setLetters] = useState<string[]>([])
  const [picked, setPicked] = useState<number[]>([])
  const [today, setToday] = useState<Today | null>(null)
  const [stats, setStats] = useState<AnagramStats>(emptyAnagramStats())
  const [dailyStats, setDailyStats] = useState<Stats>(emptyStats())
  const [message, setMessage] = useState('')
  const [giveUpAsk, setGiveUpAsk] = useState(false)
  const [yesterdayOpen, setYesterdayOpen] = useState(false)
  const [countdown, setCountdown] = useState('')
  const [copied, setCopied] = useState(false)

  // Client only: the prerendered page has no date.
  useEffect(() => {
    const number = puzzleNumber()
    setPuzzle(number)
    setLetters(dailyScramble(number, language))
    const saved = read<Today>(todayKey, { puzzle: number, hints: 0, guesses: 0, solved: false, gaveUp: false })
    setToday(saved.puzzle === number ? saved : { puzzle: number, hints: 0, guesses: 0, solved: false, gaveUp: false })
    setStats(read(statsKey, emptyAnagramStats()))
    setDailyStats(read(`${t.dailyStorage}-stats-v1`, emptyStats()))
    const tick = () => setCountdown(countdownText(msUntilNext()))
    tick()
    const timer = window.setInterval(tick, 30_000)
    return () => window.clearInterval(timer)
  }, [language, todayKey, statsKey, t.dailyStorage])

  const answer = puzzle ? anagramFor(puzzle, language) : ''
  const hints = useMemo(() => (answer ? anagramHints(answer, language) : []), [answer, language])
  const done = Boolean(today && (today.solved || today.gaveUp))
  const guess = picked.map((index) => letters[index]).join('')

  const save = (next: Today) => { setToday(next); write(todayKey, next) }
  const finish = (next: Today) => {
    save(next)
    const updated = recordAnagram(stats, next.puzzle, next.solved, next.hints)
    setStats(updated)
    write(statsKey, updated)
  }

  const pick = (index: number) => {
    if (done || picked.includes(index)) return
    setMessage('')
    setPicked((current) => [...current, index])
  }
  const typeLetter = useCallback((letter: string) => {
    setPicked((current) => {
      const index = letters.findIndex((l, i) => l === letter && !current.includes(i))
      return index < 0 ? current : [...current, index]
    })
    setMessage('')
  }, [letters])

  const submit = async () => {
    if (!today || done || !answer) return
    if (guess.length < answer.length) { setMessage(t.wrongLetters); return }
    let isWord = (_word: string) => false
    try {
      const words = new Set(await getDictionary(language))
      isWord = (word) => words.has(word)
    } catch { /* without the dictionary only the exact word counts */ }
    const result = checkGuess(guess, answer, isWord)
    const guesses = today.guesses + 1
    if (result === 'solved') {
      finish({ ...today, guesses, solved: true })
      setMessage('')
      track('anagram_solve', { language, hints: today.hints, guesses })
      return
    }
    save({ ...today, guesses })
    setMessage(result === 'other-word' ? t.otherWord(upper(guess)) : result === 'not-a-word' ? t.notWord : t.wrongLetters)
    setPicked([])
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (done || event.ctrlKey || event.metaKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      if (event.key === 'Enter') { event.preventDefault(); void submit(); return }
      if (event.key === 'Backspace') { setPicked((current) => current.slice(0, -1)); return }
      let key = event.key.toLowerCase()
      if (language === 'bg' && LATIN_TO_CYRILLIC[key]) key = LATIN_TO_CYRILLIC[key]
      if (letters.includes(key)) typeLetter(key)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [done, submit, language, letters, typeLetter])

  const showHint = () => {
    if (!today || done || today.hints >= hints.length) return
    save({ ...today, hints: today.hints + 1 })
    track('anagram_hint', { language, level: today.hints + 1 })
  }
  const giveUp = () => {
    if (!today || done) return
    if (!giveUpAsk) { setGiveUpAsk(true); return }
    finish({ ...today, gaveUp: true })
    track('anagram_give_up', { language })
  }
  const share = async () => {
    if (!today || !puzzle) return
    const text = anagramShareText(t.heading(puzzle), today.solved, today.hints, language, t.share)
    try {
      if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) await navigator.share({ text })
      else { await navigator.clipboard.writeText(text); setCopied(true); window.setTimeout(() => setCopied(false), 2000) }
      track('share', { tool: 'anagram', language })
    } catch { /* cancelled */ }
  }

  const yesterday = puzzle && puzzle > 1 ? anagramFor(puzzle - 1, language) : ''
  const streak = puzzle ? currentAnagramStreak(stats, puzzle) : 0
  const dailyStreak = puzzle ? currentStreak(dailyStats, puzzle) : 0

  return (
    <div className="app-shell wordle-page daily-page anagram-page">
      <header className="topbar">
        <a className="brand" href={pagePath('finder', language)} aria-label="Letterwell">
          <span className="brand-mark"><Sparkles size={18} strokeWidth={2.2} /></span>
          <span>letterwell</span>
        </a>
        <div className="topbar-actions">
          <div className="topbar-note"><span className="status-dot" />{t.note}</div>
          <ToolLinks language={language} current="anagram" />
          <label className="language-picker">
            <span className="sr-only">{language === 'bg' ? 'Език' : 'Language'}</span>
            <select value={language} onChange={(event) => window.location.assign(pagePath('anagram', event.target.value as Language))} aria-label={language === 'bg' ? 'Език' : 'Language'}>
              <option value="en">EN</option>
              <option value="bg">БГ</option>
            </select>
          </label>
        </div>
      </header>
      <main id="top">
        <section className="wordle-intro daily-intro" aria-labelledby="page-title">
          <HeroDecor variant="daily" language={language} />
          <p className="eyebrow"><span className="eyebrow-line" />{puzzle ? (language === 'bg' ? `№ ${puzzle}` : `#${puzzle}`) : t.eyebrow}<span className="eyebrow-line" /></p>
          <h1 id="page-title">{t.titleFirst} <em>{t.titleEmphasis}</em></h1>
          <p className="intro-description">{t.intro}</p>
        </section>

        <section className="daily-game anagram-game" aria-live="polite">
          {!puzzle || !today ? <p className="daily-message">{t.loading}</p> : (
            <>
              <div className="anagram-answer" aria-label={language === 'bg' ? 'Твоята дума' : 'Your word'}>
                {Array.from({ length: answer.length }, (_, i) => {
                  const letter = done ? answer[i] : guess[i]
                  return <span key={i} className={`daily-tile${letter ? ' is-filled' : ''}${today.solved ? ' is-correct' : ''}`}>{letter ? upper(letter) : ''}</span>
                })}
              </div>
              {!done && <p className="daily-message">{message}</p>}
              {!done && (
                <>
                  <div className="anagram-pool">
                    {letters.map((letter, index) => (
                      <button key={index} type="button" className="daily-key anagram-letter" disabled={picked.includes(index)} onClick={() => pick(index)}>{upper(letter)}</button>
                    ))}
                  </div>
                  <div className="anagram-actions">
                    <button type="button" className="daily-link-button" onClick={() => { setLetters(scramble(letters.join(''))); setPicked([]) }}><Shuffle size={16} /> {t.shuffle}</button>
                    <button type="button" className="daily-link-button" onClick={() => setPicked((current) => current.slice(0, -1))} disabled={!picked.length}><Delete size={16} /> {t.clear}</button>
                    <button type="button" className="daily-share" onClick={() => void submit()} disabled={guess.length < answer.length}>{t.check}</button>
                  </div>
                  <div className="anagram-hints">
                    {today.hints > 0 && <ol>{hints.slice(0, today.hints).map((hint) => <li key={hint}>{hint}</li>)}</ol>}
                    <p>
                      {today.hints < hints.length && <button type="button" className="daily-link-button" onClick={showHint}><Lightbulb size={16} /> {t.hint} ({t.hintsLeft(hints.length - today.hints)})</button>}
                      <button type="button" className="daily-link-button" onClick={giveUp}><Eye size={16} /> {giveUpAsk ? t.giveUpSure : t.giveUp}</button>
                    </p>
                  </div>
                </>
              )}
              {done && (
                <div className="daily-after">
                  <p>{today.solved ? t.solved : t.gaveUp} <strong>{upper(answer)}</strong>.</p>
                  <p className="anagram-meaning">{t.meaning} {dictionaryLinks(answer, language).map((link, i) => <span key={link.href}>{i > 0 && ' · '}<a href={link.href} target="_blank" rel="noopener">{link.label}</a></span>)}</p>
                  <div className="daily-after__actions">
                    <button type="button" className="daily-share" onClick={() => void share()}>{copied ? t.copied : t.shareBtn}</button>
                  </div>
                  <dl className="daily-stats">
                    {[stats.solved, streak, stats.maxStreak, stats.clean].map((value, i) => <div key={t.stats[i]}><dt>{t.stats[i]}</dt><dd>{value}</dd></div>)}
                  </dl>
                  <p className="anagram-next">{t.next(countdown)}</p>
                </div>
              )}
              <p className="anagram-cross">
                <a className="daily-link-button" href={pagePath('daily', language)}>{t.daily}{dailyStreak > 0 ? ` (${t.dailyStreak(dailyStreak)})` : ''} <ArrowRight size={16} /></a>
              </p>
              {yesterday && (
                <div className="anagram-yesterday">
                  <h2>{t.yesterday(puzzle - 1)}</h2>
                  {yesterdayOpen
                    ? <p><strong>{upper(yesterday)}</strong>. {t.meaning} {dictionaryLinks(yesterday, language).map((link, i) => <span key={link.href}>{i > 0 && ' · '}<a href={link.href} target="_blank" rel="noopener">{link.label}</a></span>)}</p>
                    : <button type="button" className="daily-link-button" onClick={() => setYesterdayOpen(true)}><Eye size={16} /> {t.showYesterday}</button>}
                </div>
              )}
            </>
          )}
        </section>

        <section className="daily-notes"><Notes language={language} /></section>
        <MoreWordTools language={language} current="anagram" />
      </main>
    </div>
  )
}
