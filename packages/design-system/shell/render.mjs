// Renders the shared page shell (head snippet, top bar, footer) as plain HTML strings.
// The output sits outside each app's framework root, so it works for React, Angular, Astro and
// static pages alike and is present in the HTML before any JavaScript runs.
// No file-system access here, so bundlers (Astro, Vite SSR) can include this module as is.
import projects from '../projects.json' with { type: 'json' }
import config from '../site.config.json' with { type: 'json' }
import { shellInline } from './shell-inline.js'

export { projects, config }

const shellScript = `(${shellInline.toString()})();`

const escape = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

const monogram = (className) =>
  `<svg class="${className}" viewBox="0 0 46 36" aria-hidden="true" focusable="false"><path class="zy-mark__main" d="M3 8h15L4 28h16M15 8l8 9 9-9m-9 9v11m5-20h14M30 17h11M30 28h11m-11-20v20"/><path class="zy-mark__accent" d="M5 32h12"/></svg>`

const moon = `<svg class="zy-icon zy-icon--moon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"/></svg>`
const sun = `<svg class="zy-icon zy-icon--sun" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`

const current = (active) => (active ? ' aria-current="page"' : '')

const analytics = config.analytics ?? {}
/** True when an analytics provider is configured in site.config.json. */
export const analyticsEnabled = Boolean(
  (analytics.provider === 'umami' && analytics.websiteId) ||
    (analytics.provider === 'plausible' && analytics.domain),
)

function analyticsTag() {
  if (!analyticsEnabled) return ''
  if (analytics.provider === 'umami') {
    const domains = analytics.domains ? ` data-domains="${escape(analytics.domains)}"` : ''
    return `<script defer src="${escape(analytics.src)}" data-website-id="${escape(analytics.websiteId)}"${domains}></script>`
  }
  return `<script defer src="${escape(analytics.src)}" data-domain="${escape(analytics.domain)}"></script>`
}

/** Inline head snippet: theme before first paint, then AdSense (with Google's consent
    message, configured in AdSense) and the analytics script from site.config.json.
    `ads: false` leaves AdSense out: Google asks that privacy-policy pages carry no ad tags. */
export function renderHead({ ads = true } = {}) {
  const adsense = ads && config.adsense?.client
    ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${escape(config.adsense.client)}" crossorigin="anonymous"></script>`
    : ''
  return [`<script>${shellScript}</script>`, adsense, analyticsTag()].filter(Boolean).join('\n')
}

/** Privacy-policy paragraph that matches the analytics configuration at build time. */
export function renderPrivacyAnalytics() {
  if (!analyticsEnabled) return '<p>Zyankov.eu does not use an analytics service.</p>'
  const name = analytics.provider === 'umami' ? 'Umami Cloud' : 'Plausible Analytics'
  return `<p>Zyankov.eu uses ${name} to count page views and a few anonymous events (for example, that a calculation or a word search happened, without its contents). The service does not use cookies or local storage and does not build a profile of you. It processes technical request data such as your IP address, which it uses only to derive aggregate statistics such as country and device type.</p>`
}

const STRINGS = {
  en: {
    skip: 'Skip to content',
    blog: 'Blog',
    about: 'About',
    theme: 'Switch to dark theme',
    tagline: 'Independent projects and practical browser tools by Zlatko Yankov. No account needed.',
    tools: 'Tools',
    site: 'Site',
    legal: 'Legal',
    home: 'Home',
    faq: 'FAQ',
    privacy: 'Privacy',
    terms: 'Terms',
    disclaimer: 'Disclaimer',
    contact: 'Contact',
    consent: 'Privacy settings',
    local: 'Searches and calculations run in your browser.',
    language: 'Language',
  },
  bg: {
    skip: 'Към съдържанието',
    blog: 'Блог',
    about: 'За сайта',
    theme: 'Включи тъмна тема',
    tagline: 'Независими проекти и практични инструменти в браузъра от Златко Янков. Без регистрация.',
    tools: 'Инструменти',
    site: 'Сайт',
    legal: 'Правна информация',
    home: 'Начало',
    faq: 'Въпроси',
    privacy: 'Поверителност',
    terms: 'Условия',
    disclaimer: 'Отказ от отговорност',
    contact: 'Контакт',
    consent: 'Настройки за поверителност',
    local: 'Търсенията и изчисленията се извършват в браузъра ти.',
    language: 'Език',
  },
}

const t = (lang) => STRINGS[lang] ?? STRINGS.en
/** Site links in the page language: the Bulgarian homepage and blog live under /bg/. */
const links = (lang) =>
  lang === 'bg'
    ? { home: '/bg/', blog: '/bg/blog/', faq: '/bg/#faq' }
    : { home: '/', blog: '/blog/', faq: '/#faq' }
const projectTagline = (p, lang) => (lang === 'bg' && p.tagline_bg) || p.tagline
/** Site-bar label and link of a project: its section name ("Word games") rather than the product name. */
const navLabel = (p, lang) => (lang === 'bg' && p.nav_bg) || p.nav || p.name
const navHref = (p, lang) => (lang === 'bg' && (p.nav_href_bg || p.href_bg)) || p.href

/** EN / БГ switch, shown only when the page lists the other language with hreflang. */
function languageSwitch(lang, alternates) {
  const other = lang === 'bg' ? 'en' : 'bg'
  if (!alternates?.[other]) return ''
  // Same-site link as a path, so the switch also works on localhost and in previews.
  const href = alternates[other].replace(/^https?:\/\/(www\.)?zyankov\.eu(?=\/)/, '')
  const label = other === 'bg' ? 'БГ' : 'EN'
  const name = other === 'bg' ? 'Български' : 'English'
  return `<a class="zy-bar__lang" href="${escape(href)}" hreflang="${other}" lang="${other}" title="${name}">${label}</a>`
}

/** Top bar shown on every page. `project` is the slug of the current app ('hub' for the homepage).
    `alternates` maps language → URL of the same page in that language (read from hreflang links). */
export function renderBar({ project = 'hub', main = 'main', lang = 'en', alternates = {} } = {}) {
  const s = t(lang)
  const l = links(lang)
  const projectLinks = projects
    .map((p) => `<a class="zy-bar__link" href="${escape(navHref(p, lang))}" data-zy-project="${escape(p.slug)}"${current(p.slug === project)}>${escape(navLabel(p, lang))}</a>`)
    .join('')
  return `<a class="zy-skip" href="#${escape(main)}">${s.skip}</a>
<div class="zy-bar" data-zy-shell="bar">
  <div class="zy-bar__inner">
    <a class="zy-bar__brand" href="${l.home}"${current(project === 'hub')}>${monogram('zy-mark')}<span>zyankov.eu</span></a>
    <nav class="zy-bar__nav" aria-label="zyankov.eu">${projectLinks}<a class="zy-bar__link zy-bar__link--secondary" href="${l.blog}"${current(project === 'blog')}>${s.blog}</a><a class="zy-bar__link zy-bar__link--secondary" href="/about/"${current(project === 'about')}>${s.about}</a></nav>
    ${languageSwitch(lang, alternates)}<button class="zy-bar__theme" type="button" data-zy-theme-toggle aria-label="${s.theme}" aria-pressed="false">${moon}${sun}</button>
  </div>
</div>`
}

/** Shared footer: every project, the site pages and the legal links. */
export function renderFooter({ project = 'hub', lang = 'en', year = new Date().getFullYear() } = {}) {
  const s = t(lang)
  const l = links(lang)
  const tools = projects
    .map((p) => `<li><a href="${escape(p.href)}" data-zy-project="${escape(p.slug)}"${current(p.slug === project)}>${escape(p.name)}</a> <span>${escape(projectTagline(p, lang))}</span></li>`)
    .join('')
  return `<footer class="zy-footer" data-zy-shell="footer">
  <div class="zy-footer__inner">
    <div class="zy-footer__brand">
      <a class="zy-footer__home" href="${l.home}">${monogram('zy-mark zy-mark--footer')}<span>zyankov.eu</span></a>
      <p>${s.tagline}</p>
    </div>
    <nav class="zy-footer__col" aria-label="${s.tools}"><h2>${s.tools}</h2><ul>${tools}</ul></nav>
    <nav class="zy-footer__col" aria-label="${s.site}"><h2>${s.site}</h2><ul><li><a href="${l.home}">${s.home}</a></li><li><a href="${l.blog}">${s.blog}</a></li><li><a href="/about/">${s.about}</a></li><li><a href="${l.faq}">${s.faq}</a></li></ul></nav>
    <nav class="zy-footer__col" aria-label="${s.legal}"><h2>${s.legal}</h2><ul><li><a href="/privacy/">${s.privacy}</a></li><li><a href="/terms/">${s.terms}</a></li><li><a href="/disclaimer/">${s.disclaimer}</a></li><li><a href="/about/#contact">${s.contact}</a></li><li><button class="zy-footer__button" type="button" data-zy-consent>${s.consent}</button></li></ul></nav>
  </div>
  <div class="zy-footer__bottom"><span>© ${escape(year)} Zlatko Yankov · zyankov.eu</span><span>${s.local}</span></div>
</footer>`
}
