// One place for "share my result", used by the daily word and the anagram.
// Phones get the native share sheet; everything else copies. It never fails silently:
// in-app browsers (Facebook, Messenger) often have no share sheet or block the clipboard,
// so the last resort is a text box the player can copy from by hand.

export type ShareOutcome = 'shared' | 'copied' | 'manual' | 'cancelled'

function legacyCopy(text: string): boolean {
  try {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.top = '0'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    area.setSelectionRange(0, text.length)
    const ok = document.execCommand('copy')
    document.body.removeChild(area)
    return ok
  } catch {
    return false
  }
}

export async function shareResult(text: string): Promise<ShareOutcome> {
  const touch = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches
  if (touch && typeof navigator.share === 'function') {
    try {
      await navigator.share({ text })
      return 'shared'
    } catch (error) {
      // Closing the sheet is not an error; anything else falls through to copying.
      if (error instanceof Error && error.name === 'AbortError') return 'cancelled'
    }
  }
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return 'copied'
    }
  } catch {
    // Blocked clipboard: try the old way next.
  }
  return legacyCopy(text) ? 'copied' : 'manual'
}
