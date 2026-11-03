// Sends an anonymous event to the analytics provider configured in site.config.json.
// Never pass user input (letters, measurements); only names and categories. SSR-safe; a no-op
// when no provider script is loaded.
export function track(event, data) {
  if (typeof window === 'undefined') return
  try {
    if (window.umami && typeof window.umami.track === 'function') window.umami.track(event, data)
    else if (typeof window.plausible === 'function') window.plausible(event, { props: data })
  } catch {
    // Analytics must never break the page.
  }
}
