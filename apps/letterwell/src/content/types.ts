// Written guidance shown below each Letterwell tool: how to use it, worked examples, the word list,
// the rules, a short strategy note, questions and related links. It is plain data so that
// content.spec.ts can recompute every number quoted in the examples from the real tool code.
// Inline markup in any string: `code` and [label](/path/).
import type { Language } from '../seo'

export interface Example {
  title: string
  /** Paragraphs: what to type, then what the tool shows. */
  text: string[]
}

export interface Section {
  title: string
  paragraphs?: string[]
  steps?: string[]
  bullets?: string[]
  examples?: Example[]
  faq?: { q: string; a: string }[]
  links?: { href: string; label: string; note?: string }[]
}

export type PageContent = Record<Language, Section[]>
