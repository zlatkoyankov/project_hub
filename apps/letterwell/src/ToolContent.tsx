// Written guide shown below a Letterwell tool: steps, worked examples, word list notes, rules,
// strategy, questions and related links. The text lives in ./content (plain data, checked against
// the real tool code by content.spec.ts). It renders in the prerendered HTML as ordinary text.
import { Fragment } from 'react'
import './tool-content.css'
import { CONTENT, type Section } from './content'
import type { Language } from './seo'

type ContentPage = keyof typeof CONTENT

const TOKEN = /(`[^`]+`|\[[^\]]+\]\([^)]+\))/g

/** `code` and [label](href) inside a string. */
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(TOKEN).map((part, index) => {
        if (part.startsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part)
        if (!link) return <Fragment key={index}>{part}</Fragment>
        const external = /^https?:/.test(link[2])
        return <a key={index} href={link[2]} {...(external ? { target: '_blank', rel: 'noopener' } : {})}>{link[1]}</a>
      })}
    </>
  )
}

function SectionView({ section, id }: { section: Section; id: string }) {
  return (
    <section className="tool-content__section" aria-labelledby={id}>
      <h2 id={id}>{section.title}</h2>
      {section.paragraphs?.map((paragraph) => <p key={paragraph}><Inline text={paragraph} /></p>)}
      {section.steps && <ol>{section.steps.map((step) => <li key={step}><Inline text={step} /></li>)}</ol>}
      {section.bullets && <ul>{section.bullets.map((item) => <li key={item}><Inline text={item} /></li>)}</ul>}
      {section.examples?.map((example) => (
        <article className="tool-content__example" key={example.title}>
          <h3>{example.title}</h3>
          {example.text.map((paragraph) => <p key={paragraph}><Inline text={paragraph} /></p>)}
        </article>
      ))}
      {section.faq?.map((item) => (
        <div className="tool-content__faq" key={item.q}>
          <h3>{item.q}</h3>
          <p><Inline text={item.a} /></p>
        </div>
      ))}
      {section.links && (
        <ul className="tool-content__links">
          {section.links.map((link) => (
            <li key={link.href}><a href={link.href}>{link.label}</a>{link.note && <span> · {link.note}</span>}</li>
          ))}
        </ul>
      )}
    </section>
  )
}

export function ToolContent({ page, language }: { page: ContentPage; language: Language }) {
  return (
    <div className="tool-content" lang={language}>
      {CONTENT[page][language].map((section, index) => (
        <SectionView key={section.title} section={section} id={`tool-content-${page}-${index}`} />
      ))}
    </div>
  )
}
