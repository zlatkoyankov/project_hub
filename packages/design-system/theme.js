// Theme helpers for app code. The theme itself is applied by the shell's inline head script
// (shell/theme-inline.js); apps only read it or react to changes. Safe to import during SSR.
export const THEME_KEY = 'zyankov-theme'
export const THEME_EVENT = 'zyankov-theme-change'

export function getTheme() {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
}

export function setTheme(theme) {
  if (typeof window === 'undefined') return
  if (window.zyTheme) window.zyTheme.set(theme)
  else document.documentElement.setAttribute('data-theme', theme)
}

export function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark')
}

export function subscribeTheme(listener) {
  if (typeof window === 'undefined') return () => {}
  const handler = () => listener(getTheme())
  window.addEventListener(THEME_EVENT, handler)
  return () => window.removeEventListener(THEME_EVENT, handler)
}
