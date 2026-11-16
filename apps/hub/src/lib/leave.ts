// Compensation for unused paid annual leave when an employment contract ends (КТ чл. 224),
// for the Bulgarian page /bg/obezshtetenie-neizpolzvan-otpusk/.
//
// SCOPE. One clear case only: a fixed monthly gross salary (or a known average daily gross), the number of unused
// days from earlier years that are not time-barred, and the proportional leave for the year of termination.
// It is a GROSS estimate. It does not compute tax or net pay, and it does not decide whether leave is time-barred.
// What the tool does not cover is listed on the page ("Какво не смята") and in LEAVE_NOT_COVERED below.
//
// Rules used and where they come from. Sources were opened on 15 November 2026. The official texts on lex.bg,
// nap.bg and mlsp.government.bg could NOT be opened from the build environment (blocked), so the rules below are
// checked against published commentary that quotes the provisions, and the wording must be re-checked against the
// consolidated texts before relying on the page:
//  - КТ чл. 224, ал. 1: on termination the employee is entitled to money for unused paid annual leave, if the right
//    is not time-barred (Труд и право, Innovires, strategy.bg consultation 5044 on НРВПО чл. 42).
//  - КТ чл. 177, ал. 1: the base is the average daily gross pay of the last calendar month in which at least
//    10 working days were worked (Труд и право, Innovires).
//  - НСОРЗ чл. 18, ал. 1: that month's gross pay is divided by the days worked in it (kik-info text of the Наредба).
//  - НРВПО чл. 42, ал. 3 и 4: right to leave compensation needs at least one full month of service; the last month
//    counts as full if at least half of its working days were worked; the amount for the year of termination is
//    proportional to the service recognised (strategy.bg consultation 5044, Труд и право, kik-info).
//  - КТ чл. 176а: leave not used within two years after the end of the year it is due for is time-barred (Труд и право).
//
// OUR OWN SIMPLIFICATIONS (shown on the page as "наша оценка"):
//  1. Monthly pay case: the base month was worked in full, so daily gross = monthly gross ÷ working days of that month.
//  2. Proportional days for the year of termination = days for a full year × full months of service ÷ 12 (the
//     months/12 pro-rating is how the commentary, Innovires, works its example; the rules do not give a rounding rule).
//  3. The daily rate is rounded to cents first, then multiplied by the days, and the total is rounded to cents.
//     Days are not rounded: they are shown to two decimals. Payroll practice can differ by a few cents.

export const LEAVE_CHECKED = '15 ноември 2026'

export interface LeaveSource {
  label: string
  href: string
}

export const LEAVE_SOURCES: LeaveSource[] = [
  { label: 'Кодекс на труда, чл. 176, 176а, 177 и 224 (lex.bg): текстът на закона', href: 'https://www.lex.bg/laws/ldoc/1594373121' },
  { label: 'Наредба за структурата и организацията на работната заплата, чл. 17 и 18: брутното възнаграждение за месеца, разделено на отработените дни (текст в kik-info)', href: 'https://kik-info.com/normativna-baza/naredbi/nsorz/' },
  { label: 'Правителствен портал за обществени консултации (strategy.bg), проект на промени в Наредбата за работното време, почивките и отпуските: чл. 42, ал. 4, обезщетението по чл. 224, ал. 1 КТ е пропорционално на признатия трудов стаж', href: 'https://www.strategy.bg/bg/public-consultations/5044/export' },
  { label: 'Труд и право: „Обезщетението за неизползван платен годишен отпуск – изчисляване и изплащане“ (месецът с поне 10 работни дни, пропорционалност, един пълен месец стаж, давност по чл. 176а)', href: 'https://trudipravo.bg/izbrani-statii/obezshtetenieto-za-neizpolzvan-platen-godishen-otpusk-izchislyavane-i-izplashtane/' },
  { label: 'Труд и право: „Видове обезщетения при прекратяване на трудовото правоотношение“ (чл. 224 КТ: данъчно облагане по ЗДДФЛ, без осигурителни вноски по Наредбата за елементите на възнагражденията)', href: 'https://trudipravo.bg/izbrani-statii/izbrani-statii-ot-epi-trud-i-sotsialno-osiguryavane/vidove-obezshteteniya-pri-prekratyavane-na-trudovoto-pravootnoshenie/' },
  { label: 'Становище на НАП (по копие в kik-info): обезщетението по чл. 224 КТ е облагаем доход от трудови правоотношения по чл. 24, ал. 1 ЗДДФЛ', href: 'https://kik-info.com/stanovishta-na-nap/a2e444fd56f1dbcb123b91b503fa19a2' },
  { label: 'Труд и право: „Право и ред за ползване на платения годишен отпуск“ (чл. 176 и 176а КТ: пренасяне и двегодишна давност)', href: 'https://trudipravo.bg/izbrani-statii/pravo-i-red-za-polzvane-na-plateniya-godishen-otpusk/' },
  { label: 'Innovires: „Обезщетение за неизползван платен отпуск“ (2026): формула, пример с пропорционални дни и бележка за практиката на СЕС (дела C-684/16 и C-120/21)', href: 'https://www.innovires.com/blog/obezshtetenie-neizpolzvan-otpusk.html' },
]

/** What the tool deliberately does not compute. Shown on the page. */
export const LEAVE_NOT_COVERED: string[] = [
  'Нето сума. Обезщетението е облагаем доход по ЗДДФЛ; калкулаторът показва само брутната сума и не смята данък.',
  'Променливо възнаграждение. Само постоянна месечна заплата или известно среднодневно брутно. Бонуси, допълнителни периодични възнаграждения (НСОРЗ чл. 17, ал. 2), работа на смени и сумирано отчитане на работното време (НСОРЗ чл. 18, ал. 3) не са смятани.',
  'Корекцията на дневното възнаграждение с коефициент по НСОРЗ чл. 18, ал. 2 и долната граница (не по-малко от минималната работна заплата, според коментарите на Труд и право и Innovires). Не сме намерили в официален текст как се прилагат при прекратяване, затова не ги смятаме.',
  'Кои дни са погасени по давност. Ти въвеждаш само дните, които още не са погасени (чл. 176а КТ: две години след края на годината, за която се полага отпускът). Коментарите на Innovires отбелязват практика на СЕС (C-684/16, C-120/21), според която правото не се губи автоматично, ако работодателят не е дал възможност за ползване; това не е смятано.',
  'Правото на отпуск в годината на наемане, преди да е навършена година при работодателя, стаж от предишни работодатели и особени отпуски. Месеците стаж в годината на прекратяване ги въвеждаш ти.',
  'Допълнителен платен отпуск. Ако имаш такъв и не е погасен, добави дните му сам към дните от предходни години или към годишните дни.',
  'Ползвани повече дни от полагащите се пропорционално за годината. Калкулаторът не смята удръжка или връщане.',
  'Други обезщетения при прекратяване (за предизвестие, за неспазено предизвестие, при пенсиониране, при незаконно уволнение и др.), лихви и съдебни спорове.',
  'Смърт на работника и обезщетение за наследниците, преминаване на предприятие към нов работодател (чл. 123 КТ), както и срока и начина на плащане.',
]

export interface LeaveInput {
  /** Monthly gross pay of the base month (the last calendar month with at least 10 working days worked). */
  gross?: number
  /** Working days in that month; the whole month is taken as worked (our simplification). */
  workdays?: number
  /** Or the average daily gross pay if you already know it; used instead of gross and workdays when above 0. */
  dailyGross?: number
  /** Unused days from earlier years that are not time-barred. */
  carriedDays: number
  /** Leave days for a full year under the contract. */
  annualDays: number
  /** Full months of service in the year of termination (0 to 12). */
  months: number
  /** Days of this year's leave already taken. */
  usedDays: number
}

export interface LeaveResult {
  /** Average daily gross pay, rounded to cents. */
  daily: number
  carriedDays: number
  /** Proportional leave for the year of termination before subtracting the used days. */
  proportionalDays: number
  /** Days of the current year still unused; never below 0. */
  currentDays: number
  /** More days were taken than the proportional leave: not covered, shown as a warning. */
  overUsed: boolean
  totalDays: number
  amount: number
}

const cents = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100
const days = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100

/** Gross compensation for unused leave in one clear case; null while the daily rate cannot be worked out. */
export function unusedLeaveCompensation(input: LeaveInput): LeaveResult | null {
  const rawDaily = input.dailyGross && input.dailyGross > 0
    ? input.dailyGross
    : input.gross && input.gross > 0 && input.workdays && input.workdays > 0
      ? input.gross / input.workdays
      : 0
  if (!(rawDaily > 0)) return null
  const daily = cents(rawDaily)
  const carriedDays = Math.max(0, input.carriedDays || 0)
  const months = Math.min(12, Math.max(0, input.months || 0))
  const proportionalDays = days(Math.max(0, input.annualDays || 0) * months / 12)
  const usedDays = Math.max(0, input.usedDays || 0)
  const currentDays = Math.max(0, days(proportionalDays - usedDays))
  const totalDays = days(carriedDays + currentDays)
  return {
    daily,
    carriedDays,
    proportionalDays,
    currentDays,
    overUsed: usedDays > proportionalDays,
    totalDays,
    amount: cents(daily * totalDays),
  }
}
