import { useEffect, useSyncExternalStore } from 'react'
import projects from '../projects.json'
import './App.css'

const themePreferenceEvent = 'zyankov-theme-preference-change'
let themePreferenceFallback: boolean | undefined

function getThemePreference() {
  try {
    const preference = window.localStorage.getItem('zyankov-theme')
    if (preference === 'dark') return true
    if (preference === 'light') return false
  } catch {
    return themePreferenceFallback ?? false
  }
  return themePreferenceFallback ?? false
}

function subscribeToThemePreference(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === 'zyankov-theme' || event.key === null) {
      themePreferenceFallback = undefined
      listener()
    }
  }
  const onPreferenceChange = () => listener()
  window.addEventListener('storage', onStorage)
  window.addEventListener(themePreferenceEvent, onPreferenceChange)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener(themePreferenceEvent, onPreferenceChange)
  }
}

function getServerThemePreference() {
  return false
}

function setThemePreference(isDark: boolean) {
  themePreferenceFallback = isDark
  try {
    window.localStorage.setItem('zyankov-theme', isDark ? 'dark' : 'light')
  } catch (error) {
    console.warn('Could not save the theme preference in this browser.', error)
  }
  window.dispatchEvent(new Event(themePreferenceEvent))
}

function App() {
  const isDark = useSyncExternalStore(
    subscribeToThemePreference,
    getThemePreference,
    getServerThemePreference,
  )

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      isDark ? '#24372d' : '#f1f5ef',
    )
  }, [isDark])

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Zyankov.eu home">
          <svg className="wordmark-mark" viewBox="0 0 46 36" aria-hidden="true">
            <path
              className="monogram-main"
              d="M3 8h15L4 28h16M15 8l8 9 9-9m-9 9v11m5-20h14M30 17h11M30 28h11m-11-20v20"
            />
            <path className="monogram-accent" d="M5 32h12" />
          </svg>
          <span>zyankov.eu</span>
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#projects">Projects</a>
          <a href="#blog">Blog</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="header-actions">
          <span className="header-note">Independent projects &amp; tools</span>
          <button
            className="theme-toggle"
            type="button"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={() => setThemePreference(!isDark)}
          >
            <span aria-hidden="true">{isDark ? '☀' : '☾'}</span>
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="page-title">
          <p className="eyebrow"><span>WELCOME TO ZYANKOV.EU</span><span /></p>
          <h1 id="page-title">Small tools.<br /><em>Made with care.</em></h1>
          <p className="hero-copy">
            A home for useful web projects, built to make everyday tasks a little easier.
          </p>
        </section>

        <section className="projects" id="projects" aria-labelledby="projects-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">PROJECT DIRECTORY</p>
              <h2 id="projects-title">Explore the projects.</h2>
            </div>
            <span className="project-count">
              {String(projects.length).padStart(2, '0')} {projects.length === 1 ? 'PROJECT' : 'PROJECTS'}
            </span>
          </div>

          <ul className="project-grid" aria-label="Available projects">
            {projects.map((project) => (
              <li key={project.name}>
                <a className="project-card" href={project.href}>
                  <img
                    className="project-art"
                    src={project.image}
                    alt={project.imageAlt}
                    width="720"
                    height="360"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="project-card-content">
                    <div className="project-topline">
                      <span className="project-symbol">{project.symbol}</span>
                      <span className="status">{project.category}</span>
                    </div>
                    <div className="project-copy">
                      <p className="project-eyebrow">{project.eyebrow}</p>
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                    </div>
                    <span className="project-link">
                      {project.linkLabel} <b aria-hidden="true">→</b>
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="editorial-grid" aria-label="More about Zyankov.eu">
          <section className="about" id="about" aria-labelledby="about-title">
            <div>
              <p className="section-kicker">ABOUT ZYANKOV.EU</p>
              <h2 id="about-title">Useful ideas, built one project at a time.</h2>
            </div>
            <div className="about-details">
              <p>
                Zyankov.eu is an independent collection of practical browser-based projects,
                created and maintained by Zlatko Yankov in Bulgaria. Letterwell helps people find
                words from English or Bulgarian letters. BuildCalc estimates common home
                improvement materials. Each project is designed to work without an account.
              </p>
              <p>
                Calculations and word searches run in your browser. I build the tools around
                explicit assumptions and welcome feedback about errors, accessibility, and ideas
                for improvement.
              </p>
              <a href="mailto:hello@zyankov.eu">Get in touch <span aria-hidden="true">→</span></a>
            </div>
          </section>

          <section className="blog" id="blog" aria-labelledby="blog-title">
            <div>
              <p className="section-kicker">FROM THE BLOG</p>
              <h2 id="blog-title">Why small web projects?</h2>
              <p className="blog-date">
                <time dateTime="2026-10-09">October 9, 2026</time>
                <span aria-hidden="true"> · </span>
                A short note
              </p>
            </div>
            <p className="blog-copy">
              A small tool should make one task feel simple. No long setup, no extra noise—just a
              clear idea, carefully made, that helps you get on with your day.
            </p>
          </section>
        </section>

        <section className="faq" id="faq" aria-labelledby="faq-title">
          <div className="faq-heading">
            <p className="section-kicker">GOOD TO KNOW</p>
            <h2 id="faq-title">Frequently asked questions</h2>
          </div>
          <div className="faq-list">
            <details>
              <summary>Does Letterwell send my letters to a server?</summary>
              <p>
                No. Letterwell searches the dictionary in your browser. The letters you enter are
                not sent to Zyankov.eu.
              </p>
            </details>
            <details>
              <summary>Does Zyankov.eu use advertising or analytics?</summary>
              <p>
                The Google AdSense publisher script is loaded on the homepage and Letterwell.
                Whether ads are shown depends on the advertising configuration. We do not use a
                separate analytics service.
              </p>
            </details>
            <details>
              <summary>Can I use the projects on my phone?</summary>
              <p>
                Yes. The project pages are designed to work on mobile, tablet, and desktop screens.
              </p>
            </details>
            <details>
              <summary>How can I suggest a project or report a problem?</summary>
              <p>
                Email <a href="mailto:hello@zyankov.eu">hello@zyankov.eu</a>. Please include the
                project name and a short description.
              </p>
            </details>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>zyankov.eu</span>
        <span>Independent projects, thoughtfully made.</span>
        <nav aria-label="Footer navigation">
          <a href="#about">About</a>
          <a href="#blog">Blog</a>
          <a href="#faq">FAQ</a>
          <a href="/privacy/">Privacy</a>
          <a href="/terms/">Terms</a>
          <a href="mailto:hello@zyankov.eu">Contact</a>
        </nav>
      </footer>
    </div>
  )
}

export default App
