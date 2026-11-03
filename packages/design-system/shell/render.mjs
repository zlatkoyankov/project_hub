// Renders the shared page shell (head snippet, top bar, footer) as plain HTML strings.
// The output sits outside each app's framework root, so it works for React, Angular and
// static pages alike and is present in the HTML before any JavaScript runs.
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
const projects = JSON.parse(read('../projects.json'))
const themeScript = read('./theme-inline.js')

const escape = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

const monogram = (className) =>
  `<svg class="${className}" viewBox="0 0 46 36" aria-hidden="true" focusable="false"><path class="zy-mark__main" d="M3 8h15L4 28h16M15 8l8 9 9-9m-9 9v11m5-20h14M30 17h11M30 28h11m-11-20v20"/><path class="zy-mark__accent" d="M5 32h12"/></svg>`

const moon = `<svg class="zy-icon zy-icon--moon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"/></svg>`
const sun = `<svg class="zy-icon zy-icon--sun" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`

const current = (active) => (active ? ' aria-current="page"' : '')

/** Inline head snippet: theme before first paint. Later phases add consent, ads and analytics here. */
export function renderHead() {
  return `<script>${themeScript}</script>`
}

/** Top bar shown on every page. `project` is the slug of the current app ('hub' for the homepage). */
export function renderBar({ project = 'hub', main = 'main' } = {}) {
  const links = projects
    .map((p) => `<a class="zy-bar__link" href="${escape(p.href)}"${current(p.slug === project)}>${escape(p.name)}</a>`)
    .join('')
  return `<a class="zy-skip" href="#${escape(main)}">Skip to content</a>
<div class="zy-bar" data-zy-shell="bar">
  <div class="zy-bar__inner">
    <a class="zy-bar__brand" href="/"${current(project === 'hub')}>${monogram('zy-mark')}<span>zyankov.eu</span></a>
    <nav class="zy-bar__nav" aria-label="zyankov.eu">${links}<a class="zy-bar__link zy-bar__link--secondary" href="/#blog">Blog</a><a class="zy-bar__link zy-bar__link--secondary" href="/#about">About</a></nav>
    <button class="zy-bar__theme" type="button" data-zy-theme-toggle aria-label="Switch to dark theme" aria-pressed="false">${moon}${sun}</button>
  </div>
</div>`
}

/** Shared footer: every project, the site pages and the legal links. */
export function renderFooter({ project = 'hub', year = new Date().getFullYear() } = {}) {
  const tools = projects
    .map((p) => `<li><a href="${escape(p.href)}"${current(p.slug === project)}>${escape(p.name)}</a> <span>${escape(p.tagline)}</span></li>`)
    .join('')
  return `<footer class="zy-footer" data-zy-shell="footer">
  <div class="zy-footer__inner">
    <div class="zy-footer__brand">
      <a class="zy-footer__home" href="/">${monogram('zy-mark zy-mark--footer')}<span>zyankov.eu</span></a>
      <p>Independent projects and practical browser tools by Zlatko Yankov. No account needed.</p>
    </div>
    <nav class="zy-footer__col" aria-label="Tools"><h2>Tools</h2><ul>${tools}</ul></nav>
    <nav class="zy-footer__col" aria-label="Site"><h2>Site</h2><ul><li><a href="/">Home</a></li><li><a href="/#blog">Blog</a></li><li><a href="/#about">About</a></li><li><a href="/#faq">FAQ</a></li></ul></nav>
    <nav class="zy-footer__col" aria-label="Legal"><h2>Legal</h2><ul><li><a href="/privacy/">Privacy</a></li><li><a href="/terms/">Terms</a></li><li><a href="mailto:hello@zyankov.eu">Contact</a></li></ul></nav>
  </div>
  <div class="zy-footer__bottom"><span>© ${escape(year)} Zlatko Yankov · zyankov.eu</span><span>Searches and calculations run in your browser.</span></div>
</footer>`
}
