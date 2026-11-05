import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Info, X } from 'lucide-react'
import { track } from '@zyankov/design-system/analytics'
import type { Language } from './seo'
import { dictionaryLinks, loadMeaning, partLabel, wiktionaryUrl, type Meaning } from './meanings'

const copy = {
  en: {
    show: (word: string) => `Meaning of ${word}`,
    none: (word: string) => `No meaning found for ${word}`,
    loading: 'Looking it up…',
    failed: 'The meaning could not be loaded. Try again in a moment.',
    missing: 'No meaning found for this word.',
    formOf: 'form of',
    close: 'Close',
    source: 'Source: Wiktionary (CC BY-SA)',
    lookUp: 'Look up this word in:',
  },
  bg: {
    show: (word: string) => `Значение на ${word}`,
    none: (word: string) => `Няма намерено значение за ${word}`,
    loading: '',
    failed: '',
    missing: '',
    formOf: '',
    close: 'Затвори',
    source: '',
    lookUp: 'Виж значението на думата в:',
  },
}

export interface OpenMeaning {
  word: string
  anchor: HTMLElement
}

/** Small ⓘ button next to a word; greyed out when we have no meaning for it. */
export function MeaningButton({ word, language, available, onOpen }: {
  word: string
  language: Language
  available: boolean
  onOpen: (open: OpenMeaning) => void
}) {
  const text = copy[language]
  const label = available ? text.show(word) : text.none(word)
  return (
    <button
      type="button"
      className="meaning-button"
      aria-label={label}
      title={label}
      aria-haspopup="dialog"
      disabled={!available}
      onClick={(event) => { event.stopPropagation(); onOpen({ word, anchor: event.currentTarget }) }}
    ><Info size={13} strokeWidth={2.4} aria-hidden="true" /></button>
  )
}

type State = { status: 'loading' } | { status: 'error' } | { status: 'done'; meaning: Meaning | null }

/** The balloon with the meaning: under the word on wide screens, a sheet at the bottom on phones. */
export function MeaningPopover({ open, language, onClose, linksOnly = false }: {
  open: OpenMeaning
  language: Language
  onClose: () => void
  /** Only links to online dictionaries (Bulgarian words, the crossword helper). */
  linksOnly?: boolean
}) {
  const text = copy[language]
  const bulgarian = linksOnly || language === 'bg'
  const [state, setState] = useState<State>({ status: 'loading' })
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const panel = useRef<HTMLDivElement>(null)
  const locale = language === 'bg' ? 'bg-BG' : 'en'

  useEffect(() => {
    track('wordle_meaning', { language })
    if (bulgarian) return
    let active = true
    loadMeaning(language, open.word)
      .then((meaning) => { if (active) setState({ status: 'done', meaning }) })
      .catch(() => { if (active) setState({ status: 'error' }) })
    return () => { active = false }
  }, [language, bulgarian, open.word])

  useLayoutEffect(() => {
    const place = () => {
      const rect = open.anchor.getBoundingClientRect()
      const width = Math.min(340, window.innerWidth - 24)
      const left = Math.max(12, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 12))
      setPosition({ top: rect.bottom + window.scrollY + 8, left: left + window.scrollX })
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [open.anchor])

  useEffect(() => {
    panel.current?.focus()
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node
      if (!panel.current?.contains(target) && !open.anchor.contains(target)) onClose()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
      open.anchor.focus({ preventScroll: true })
    }
  }, [open.anchor, onClose])

  const meaning = state.status === 'done' ? state.meaning : null
  const title = open.word.toLocaleUpperCase(locale)

  // Rendered into <body> so the page's own layout never clips or offsets it.
  return createPortal(
    <div
      ref={panel}
      className="meaning-popover"
      role="dialog"
      aria-label={text.show(title)}
      tabIndex={-1}
      style={position ? { top: position.top, left: position.left } : { visibility: 'hidden' }}
    >
      <div className="meaning-head">
        <strong>{title}</strong>
        {meaning?.headword && <span className="meaning-form">{text.formOf} <b>{meaning.headword}</b></span>}
        <button type="button" className="meaning-close" aria-label={text.close} onClick={onClose}><X size={16} /></button>
      </div>
      {bulgarian && (
        <div className="meaning-links">
          <p>{text.lookUp}</p>
          <ul>
            {dictionaryLinks(open.word, language).map((link) => (
              <li key={link.href}><a href={link.href} target="_blank" rel="noopener">{link.label} <span aria-hidden="true">↗</span></a></li>
            ))}
          </ul>
        </div>
      )}
      {!bulgarian && state.status === 'loading' && <p className="meaning-status">{text.loading}</p>}
      {!bulgarian && state.status === 'error' && <p className="meaning-status">{text.failed}</p>}
      {!bulgarian && state.status === 'done' && !meaning && <p className="meaning-status">{text.missing}</p>}
      {meaning && (
        <>
          {meaning.parts.map(([part, senses], index) => (
            <div className="meaning-part" key={`${part}-${index}`}>
              <span className="meaning-pos">{partLabel(part)}</span>
              <ol>{senses.map((sense) => <li key={sense}>{sense}</li>)}</ol>
            </div>
          ))}
          <p className="meaning-source">
            <a href={wiktionaryUrl(meaning.headword ?? meaning.word)} target="_blank" rel="noopener">{text.source}</a>
          </p>
        </>
      )}
    </div>,
    document.body,
  )
}
