import { afterEach, describe, expect, it, vi } from 'vitest'
import { shareResult } from './share'

function setup(options: { coarse?: boolean; share?: () => Promise<void>; clipboard?: () => Promise<void>; legacy?: boolean }) {
  vi.stubGlobal('window', { matchMedia: () => ({ matches: options.coarse ?? false }) })
  vi.stubGlobal('navigator', {
    share: options.share,
    clipboard: options.clipboard ? { writeText: options.clipboard } : undefined,
  })
  const area = { value: '', setAttribute: () => {}, style: {}, select: () => {}, setSelectionRange: () => {} }
  vi.stubGlobal('document', {
    createElement: () => area,
    body: { appendChild: () => {}, removeChild: () => {} },
    execCommand: () => options.legacy ?? false,
  })
}

afterEach(() => vi.unstubAllGlobals())

describe('shareResult', () => {
  it('uses the share sheet on a phone', async () => {
    const share = vi.fn(async () => {})
    setup({ coarse: true, share })
    expect(await shareResult('hi')).toBe('shared')
    expect(share).toHaveBeenCalledWith({ text: 'hi' })
  })

  it('treats a closed share sheet as cancelled, not as a failure', async () => {
    setup({ coarse: true, share: async () => { throw Object.assign(new Error('x'), { name: 'AbortError' }) }, clipboard: async () => {} })
    expect(await shareResult('hi')).toBe('cancelled')
  })

  it('copies when the share sheet fails, as in in-app browsers', async () => {
    const clipboard = vi.fn(async () => {})
    setup({ coarse: true, share: async () => { throw new Error('blocked') }, clipboard })
    expect(await shareResult('hi')).toBe('copied')
    expect(clipboard).toHaveBeenCalledWith('hi')
  })

  it('copies on a computer', async () => {
    const clipboard = vi.fn(async () => {})
    setup({ coarse: false, share: async () => {}, clipboard })
    expect(await shareResult('hi')).toBe('copied')
  })

  it('falls back to the old copy command when the clipboard is blocked', async () => {
    setup({ clipboard: async () => { throw new Error('denied') }, legacy: true })
    expect(await shareResult('hi')).toBe('copied')
  })

  it('asks the player to copy by hand when nothing works', async () => {
    setup({ legacy: false })
    expect(await shareResult('hi')).toBe('manual')
  })
})
