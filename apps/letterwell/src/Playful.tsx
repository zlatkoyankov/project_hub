import type { CSSProperties } from 'react'
import './playful.css'
import type { Language } from './seo'

export type PlayVariant = 'finder' | 'wordle' | 'crossword' | 'bee' | 'daily'

type Tile = { ch: string; tone: string; pts?: number }

const WORDS: Record<Language, { left: string; right: string; bee: string; cross: string[] }> = {
  en: { left: 'PLAY', right: 'WORD', bee: 'HONEY', cross: ['CAT', 'A#O', 'BUS'] },
  bg: { left: 'ИГРА', right: 'ДУМА', bee: 'МЕДЕН', cross: ['КОТ', 'А#Р', 'ЛЕС'] },
}

const SCRABBLE_TONES = ['tone-yellow', 'tone-coral', 'tone-blue', 'tone-mint', 'tone-white']
const WORDLE_TONES = ['tone-correct', 'tone-absent', 'tone-present', 'tone-absent', 'tone-correct']

function tiles(word: string, variant: PlayVariant, offset = 0): Tile[] {
  return Array.from(word).map((ch, i) => ({
    ch,
    tone: variant === 'wordle' ? WORDLE_TONES[(i + offset) % WORDLE_TONES.length] : SCRABBLE_TONES[(i + offset) % SCRABBLE_TONES.length],
    pts: variant === 'finder' ? ((ch.charCodeAt(0) * 7 + i) % 9) + 1 : undefined,
  }))
}

function TileCluster({ items, side }: { items: Tile[]; side: 'left' | 'right' }) {
  return (
    <div className={`play-cluster play-cluster--${side}`}>
      {items.map((tile, i) => (
        <span key={i} className={`play-tile ${tile.tone}`} style={{ '--i': i } as CSSProperties}>
          {tile.ch}
          {tile.pts ? <small>{tile.pts}</small> : null}
        </span>
      ))}
    </div>
  )
}

function MiniCrossword({ rows, side }: { rows: string[]; side: 'left' | 'right' }) {
  return (
    <div className={`play-cluster play-cluster--${side} play-cross`}>
      {rows.flatMap((row, r) =>
        Array.from(row).map((ch, c) => (
          <span key={`${r}-${c}`} className={ch === '#' ? 'cross-cell is-block' : 'cross-cell'} style={{ '--i': r * 3 + c } as CSSProperties}>
            {ch === '#' ? '' : ch}
            {(r === 0 && c === 0) || (r === 0 && c === 2) || (r === 2 && c === 0) ? <small>{r === 2 ? 3 : c === 0 ? 1 : 2}</small> : null}
          </span>
        )),
      )}
    </div>
  )
}

export function Bee({ className = '' }: { className?: string }) {
  return (
    <svg className={`play-bee ${className}`} viewBox="0 0 64 48" aria-hidden="true" focusable="false">
      <g transform="rotate(-20 26 20)"><ellipse className="bee-wing" cx="26" cy="12" rx="8" ry="11" /></g>
      <g transform="rotate(18 38 20)"><ellipse className="bee-wing" cx="38" cy="12" rx="7" ry="10" /></g>
      <ellipse className="bee-body" cx="32" cy="30" rx="18" ry="13" />
      <path className="bee-stripe" d="M27 17.6c-2.6 3.6-2.6 21.2 0 24.8h4.6c-2.4-3.6-2.4-21.2 0-24.8z" />
      <path className="bee-stripe" d="M36.4 17.4c-2.4 3.8-2.4 21.4 0 25.2h4.4c-2-4-2-21.2 0-25.2z" />
      <path className="bee-stripe" d="M49.2 26l6.8 4-6.8 4z" />
      <circle className="bee-eye" cx="19" cy="27" r="2.2" />
      <path className="bee-smile" d="M15.5 32.5q3 2.6 6 0" />
    </svg>
  )
}

function HoneyComb({ word, side }: { word: string; side: 'left' | 'right' }) {
  return (
    <div className={`play-cluster play-cluster--${side} play-comb`}>
      {Array.from(word).slice(0, 3).map((ch, i) => (
        <span key={i} className={`comb-hex${i === 1 ? ' is-centre' : ''}`} style={{ '--i': i } as CSSProperties}>{ch}</span>
      ))}
    </div>
  )
}

/** Decorative letter tiles around a page heading. Purely visual (aria-hidden). */
export function HeroDecor({ variant, language }: { variant: PlayVariant; language: Language }) {
  const words = WORDS[language]
  return (
    <div className={`play-decor play-decor--${variant}`} aria-hidden="true">
      {variant === 'crossword' ? (
        <>
          <MiniCrossword rows={words.cross} side="left" />
          <TileCluster items={tiles(words.right, 'finder', 2).map((t) => ({ ...t, pts: undefined }))} side="right" />
        </>
      ) : variant === 'bee' ? (
        <>
          <HoneyComb word={words.bee} side="left" />
          <div className="play-cluster play-cluster--right play-bee-wrap">
            <svg className="bee-trail" viewBox="0 0 160 70" aria-hidden="true" focusable="false">
              <path d="M4 60C30 10 60 70 90 34s50-14 66-26" />
            </svg>
            <Bee />
          </div>
        </>
      ) : (
        <>
          <TileCluster items={tiles(words.left, variant)} side="left" />
          <TileCluster items={tiles(words.right, variant, 1)} side="right" />
        </>
      )}
    </div>
  )
}

/** Small themed illustration for the "nothing yet" state of each tool. */
export function EmptyArt({ variant, language }: { variant: PlayVariant; language: Language }) {
  const words = WORDS[language]
  if (variant === 'bee') {
    return (
      <span className="empty-art empty-art--bee" aria-hidden="true">
        <Bee />
      </span>
    )
  }
  if (variant === 'crossword') {
    return (
      <span className="empty-art empty-art--cross" aria-hidden="true">
        {Array.from(words.cross[0]).map((ch, i) => (
          <span key={i} className="cross-cell">{i === 1 ? '?' : ch}</span>
        ))}
      </span>
    )
  }
  const word = variant === 'wordle' ? '?????' : words.left
  return (
    <span className={`empty-art empty-art--${variant}`} aria-hidden="true">
      {tiles(word, variant).map((tile, i) => (
        <span key={i} className={`play-tile ${variant === 'wordle' ? 'tone-blank' : tile.tone}`} style={{ '--i': i } as CSSProperties}>{tile.ch}</span>
      ))}
    </span>
  )
}
