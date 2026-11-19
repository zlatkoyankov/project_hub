import type { Language } from './seo'

// Last resort when neither the share sheet nor the clipboard works (some in-app browsers):
// show the result in a box that is selected on tap, so the player can copy it by hand.
export function ManualCopy({ text, language }: { text: string; language: Language }) {
  return (
    <div className="daily-manual">
      <p>{language === 'bg' ? 'Не успяхме да копираме сами. Задръж върху текста, копирай го и го постави в чата.' : 'We could not copy it for you. Press and hold the text, copy it and paste it into your chat.'}</p>
      <textarea readOnly rows={4} value={text} onFocus={(event) => event.currentTarget.select()} aria-label={language === 'bg' ? 'Резултат за копиране' : 'Result to copy'} />
    </div>
  )
}
