// Amounts in words in Bulgarian ("сума словом"), for invoices, contracts and receipts.
//
// Rules, with sources (shown on /bg/suma-slovom/):
// - Compound numerals are built from the largest unit down, and the conjunction "и" goes before the
//   last component: "сто и петдесет", "хиляда и двеста", "тридесет и пет"
//   (European Commission, Bulgarian style guide; ezik.bg, "Числително име").
// - "евро" has no plural: "едно евро", "двайсет евро" (Institute for Bulgarian Language, BAS, 2026).
//   The names used in normative texts are "евро", "цент", "евроцент" and "стотинка".
// - After a numeral, masculine nouns take the count form: "два цента", "двайсет и един цента",
//   "два милиона", "два лева".
// - Gender of "един/една/едно" and "два/две" follows the noun: евро is neuter, цент, евроцент, лев,
//   милион and милиард are masculine, хиляда and стотинка are feminine.

export type Gender = 'm' | 'f' | 'n'

const ONES: Record<Gender, string[]> = {
  m: ['', 'един', 'два', 'три', 'четири', 'пет', 'шест', 'седем', 'осем', 'девет'],
  f: ['', 'една', 'две', 'три', 'четири', 'пет', 'шест', 'седем', 'осем', 'девет'],
  n: ['', 'едно', 'две', 'три', 'четири', 'пет', 'шест', 'седем', 'осем', 'девет'],
}
const TEENS = ['десет', 'единадесет', 'дванадесет', 'тринадесет', 'четиринадесет', 'петнадесет', 'шестнадесет', 'седемнадесет', 'осемнадесет', 'деветнадесет']
const TENS = ['', '', 'двадесет', 'тридесет', 'четиридесет', 'петдесет', 'шестдесет', 'седемдесет', 'осемдесет', 'деветдесет']
const HUNDREDS = ['', 'сто', 'двеста', 'триста', 'четиристотин', 'петстотин', 'шестстотин', 'седемстотин', 'осемстотин', 'деветстотин']

/** The components of 1–999 ("сто", "двадесет", "пет"), without any "и". */
function triadParts(n: number, gender: Gender): string[] {
  const parts: string[] = []
  const h = Math.floor(n / 100)
  const rest = n % 100
  if (h) parts.push(HUNDREDS[h])
  if (rest >= 10 && rest < 20) parts.push(TEENS[rest - 10])
  else {
    if (rest >= 20) parts.push(TENS[Math.floor(rest / 10)])
    if (rest % 10) parts.push(ONES[gender][rest % 10])
  }
  return parts
}

/** Joins components with "и" before the last one: ["сто", "пет"] → "сто и пет". */
const withAnd = (parts: string[]) => (parts.length < 2 ? parts.join('') : `${parts.slice(0, -1).join(' ')} и ${parts[parts.length - 1]}`)

interface Scale {
  value: number
  gender: Gender
  one: string
  many: string
}

const SCALES: Scale[] = [
  { value: 1e9, gender: 'm', one: 'милиард', many: 'милиарда' },
  { value: 1e6, gender: 'm', one: 'милион', many: 'милиона' },
  { value: 1e3, gender: 'f', one: 'хиляда', many: 'хиляди' },
]

/**
 * A whole number from 0 to 999 999 999 999 in words, agreeing with a noun of the given gender:
 * numberToWords(1234, 'n') → "хиляда двеста тридесет и четири"; numberToWords(1200, 'n') → "хиляда и двеста".
 */
export function numberToWords(value: number, gender: Gender = 'm'): string {
  if (!Number.isInteger(value) || value < 0 || value >= 1e12) throw new RangeError('Use a whole number from 0 to 999 999 999 999')
  if (value === 0) return 'нула'
  // Each group is one phrase ("двеста тридесет и пет хиляди"); simple = it has no "и" of its own.
  const groups: { text: string; simple: boolean }[] = []
  let rest = value
  for (const scale of SCALES) {
    const count = Math.floor(rest / scale.value)
    rest %= scale.value
    if (!count) continue
    if (count === 1) {
      groups.push({ text: scale.value === 1e3 ? 'хиляда' : `един ${scale.one}`, simple: true })
      continue
    }
    const parts = triadParts(count, scale.gender)
    groups.push({ text: `${withAnd(parts)} ${scale.many}`, simple: parts.length === 1 })
  }
  if (rest) {
    const parts = triadParts(rest, gender)
    groups.push({ text: withAnd(parts), simple: parts.length === 1 })
  }
  // The "и" before the last component of the whole number: added between the last two groups
  // only when the last group has none of its own ("хиляда и двеста", but "хиляда двеста и пет").
  const last = groups[groups.length - 1]
  if (groups.length > 1 && last.simple) {
    return `${groups.slice(0, -1).map((g) => g.text).join(' ')} и ${last.text}`
  }
  return groups.map((g) => g.text).join(' ')
}

export type Currency = 'eur' | 'bgn'
export type CentsStyle = 'words' | 'digits'

const CURRENCIES = {
  eur: { gender: 'n' as Gender, one: 'евро', many: 'евро', cent: { gender: 'm' as Gender, one: 'цент', many: 'цента' } },
  bgn: { gender: 'm' as Gender, one: 'лев', many: 'лева', cent: { gender: 'f' as Gender, one: 'стотинка', many: 'стотинки' } },
}

export interface AmountOptions {
  currency?: Currency
  cents?: CentsStyle
  /** Use "евроцент" instead of "цент" (both are used in normative texts). */
  euroCent?: boolean
  /** Write "и 0 цента" when there are no cents. */
  zeroCents?: boolean
}

/** Splits an amount into whole units and cents, rounding to the cent. */
export function splitAmount(amount: number): { whole: number; cents: number } {
  const total = Math.round(amount * 100)
  return { whole: Math.floor(total / 100), cents: total % 100 }
}

const capitalise = (text: string) => text.charAt(0).toLocaleUpperCase('bg-BG') + text.slice(1)

/** "Хиляда двеста тридесет и четири евро и петдесет и шест цента" for 1234.56. */
export function amountToWords(amount: number, options: AmountOptions = {}): string {
  const { currency = 'eur', cents: style = 'words', euroCent = false, zeroCents = false } = options
  if (!Number.isFinite(amount) || amount < 0) throw new RangeError('Use an amount of zero or more')
  const c = CURRENCIES[currency]
  const { whole, cents } = splitAmount(amount)
  let text = `${numberToWords(whole, c.gender)} ${whole === 1 ? c.one : c.many}`
  if (cents || zeroCents) {
    const centOne = currency === 'eur' && euroCent ? 'евроцент' : c.cent.one
    const centMany = currency === 'eur' && euroCent ? 'евроцента' : c.cent.many
    const count = style === 'digits' ? String(cents).padStart(2, '0') : numberToWords(cents, c.cent.gender)
    text += ` и ${count} ${cents === 1 ? centOne : centMany}`
  }
  return capitalise(text)
}
