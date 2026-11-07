// Letterwell's daily five-letter word game: "Дума на деня" in Bulgarian, "Letterwell Daily" in
// English. Everyone gets the same word each day (by the date in Europe/Sofia); the answers are
// everyday nouns and adjectives from the five-letter lists, shuffled once. Guesses are checked
// against the full five-letter list. There is also an unlimited mode with random words.
import type { Language } from './seo'
import { WORD_LENGTH } from './wordle'

export const MAX_GUESSES = 6

/** Day number 1 is this date (in Sofia). */
export const EPOCH = Date.UTC(2026, 10, 9)

export const DAILY_WORDS_BG: readonly string[] = [
  'ръжда', 'мокър', 'топка', 'помощ', 'чакъл', 'захар', 'лебед', 'дънер', 'солен', 'котва', 'колеж', 'патка',
  'приют', 'сълза', 'банка', 'печка', 'тиган', 'музей', 'чирак', 'шепот', 'крило', 'храст', 'запас', 'шаран',
  'пепел', 'склад', 'място', 'шунка', 'стена', 'ездач', 'копие', 'обмен', 'букет', 'рамка', 'смяна', 'болка',
  'комик', 'литър', 'мечта', 'парад', 'липса', 'катер', 'ивица', 'дъска', 'радар', 'момче', 'такса', 'отбор',
  'овчар', 'запис', 'парти', 'изпит', 'порой', 'храна', 'чорап', 'пръст', 'порив', 'шорти', 'восък', 'писмо',
  'глава', 'вълна', 'зодия', 'скейт', 'отдих', 'маска', 'мляко', 'книга', 'клоун', 'метод', 'навес', 'каюта',
  'тесто', 'склон', 'кебап', 'закон', 'слива', 'говор', 'кокос', 'зърно', 'кабел', 'сянка', 'песен', 'канал',
  'умора', 'метро', 'замък', 'памет', 'брояч', 'атлас', 'струя', 'рибар', 'излет', 'модел', 'наука', 'товар',
  'кораб', 'фокус', 'яхния', 'такси', 'гений', 'бучка', 'бронз', 'следа', 'нежен', 'залив', 'кисел', 'гъска',
  'вежда', 'паста', 'адрес', 'дънки', 'обица', 'видра', 'зефир', 'хиена', 'пейка', 'капан', 'памук', 'дреха',
  'здрач', 'тълпа', 'лимон', 'кубче', 'зебра', 'нишка', 'шахта', 'екран', 'полюс', 'жажда', 'сюжет', 'дюшек',
  'мамут', 'карта', 'колие', 'ковач', 'число', 'блуза', 'кънки', 'блюдо', 'тигър', 'класа', 'ягуар', 'група',
  'дъвка', 'внуче', 'папая', 'остър', 'пипер', 'пиеса', 'буква', 'израз', 'време', 'лотос', 'прост', 'пъзел',
  'страх', 'конец', 'лилия', 'април', 'полет', 'мощен', 'вагон', 'чушка', 'факла', 'крава', 'билка', 'чанта',
  'чадър', 'вятър', 'омлет', 'навик', 'долар', 'мащаб', 'писта', 'здрав', 'никел', 'пясък', 'сцена', 'магия',
  'кожен', 'пъпеш', 'молба', 'ферма', 'нюанс', 'шатра', 'тояга', 'епоха', 'облак', 'летен', 'ранчо', 'кюфте',
  'ръгби', 'схема', 'лакът', 'перце', 'жираф', 'терен', 'масаж', 'казан', 'беден', 'акорд', 'видео', 'лесен',
  'гараж', 'клюка', 'какао', 'тръба', 'лилав', 'клещи', 'полза', 'петък', 'юноша', 'ролка', 'пилот', 'камък',
  'опера', 'мисъл', 'масло', 'знаме', 'локва', 'табло', 'купол', 'цикъл', 'съдия', 'сезон', 'мента', 'север',
  'бъчва', 'пекар', 'арена', 'корал', 'лазер', 'джудо', 'покой', 'круша', 'физик', 'ботуш', 'разум', 'пуйка',
  'перон', 'кокал', 'мумия', 'кутия', 'охлюв', 'устав', 'кафяв', 'косъм', 'рицар', 'бюфет', 'медал', 'банан',
  'преса', 'лампа', 'чайка', 'норма', 'хумус', 'кърпа', 'щраус', 'тюлен', 'плато', 'избор', 'дизел', 'хлапе',
  'скара', 'порта', 'среда', 'прасе', 'диван', 'акула', 'комин', 'рокля', 'грижа', 'копче', 'съсед', 'чиния',
  'сироп', 'равен', 'бутон', 'ангел', 'кашон', 'текст', 'титла', 'слава', 'хокей', 'рибка', 'гумен', 'молив',
  'бобър', 'салон', 'искра', 'врата', 'поука', 'радио', 'улица', 'изток', 'люлка', 'кълбо', 'питие', 'линия',
  'драма', 'сфера', 'шивач', 'певец', 'обръч', 'форма', 'шейна', 'номер', 'скаут', 'тухла', 'галоп', 'лекар',
  'фирма', 'волан', 'пудел', 'зубър', 'повод', 'фазан', 'белег', 'бегач', 'жътва', 'хотел', 'зелен', 'гущер',
  'меден', 'чорба', 'панда', 'скала', 'автор', 'идеал', 'пазар', 'сонар', 'билет', 'начин', 'девиз', 'скица',
  'вихър', 'цифра', 'тайна', 'извор', 'архив', 'топче', 'ребро', 'булка', 'палма', 'капка', 'дърво', 'мечка',
  'хитър', 'нокът', 'зимен', 'манго', 'мишка', 'герой', 'висок', 'марка', 'тесен', 'ръкав', 'скоба', 'брада',
  'лидер', 'лента', 'корем', 'залез', 'диета', 'евтин', 'изход', 'ястие', 'фраза', 'мотив', 'сокол', 'котка',
  'метал', 'базар', 'капак', 'кесия', 'модул', 'юрист', 'живот', 'тенис', 'мрежа', 'балет', 'риган', 'шапка',
  'пелин', 'мотел', 'бетон', 'почва', 'котел', 'мивка', 'сауна', 'водач', 'химия', 'помпа', 'кошер', 'гадже',
  'шифър', 'куфар', 'ретро', 'смола', 'сряда', 'робот', 'атлет', 'серия', 'топъл', 'чесън', 'племе', 'мебел',
  'домат', 'перла', 'корен', 'злато', 'стадо', 'пожар', 'среща', 'гърло', 'бизон', 'успех', 'утрин', 'опора',
  'широк', 'палец', 'кичур', 'дебел', 'финал', 'отвор', 'кадър', 'месец', 'цитат', 'етика', 'борса', 'койот',
  'пешка', 'греда', 'вечер', 'завод', 'аванс', 'режим', 'рубин', 'круиз', 'принц', 'земен', 'коала', 'жител',
  'конче', 'доход', 'мюсли', 'визия', 'торба', 'салам', 'метър', 'роман', 'леден', 'будка', 'таван', 'силен',
  'глина', 'рампа', 'щурец', 'проба', 'бълха', 'плоча', 'ягода', 'точка', 'оазис', 'пчела', 'китка', 'океан',
  'мираж', 'сатен', 'тиква', 'мотор', 'хапка', 'декор', 'петел', 'отдел', 'човек', 'дузпа', 'вечен', 'ефект',
  'хумор', 'химик', 'върба', 'влага', 'кошче', 'сапун', 'метла', 'килим', 'трева', 'блато', 'очила', 'страж',
  'панел', 'торта', 'обект', 'майка', 'татко', 'спорт', 'месар', 'образ', 'питон', 'сърна', 'седло', 'морал',
  'гълъб', 'пудра', 'старт', 'пирон', 'езеро', 'врана', 'номад', 'любов', 'птица', 'печат', 'макет', 'легло',
  'цвете', 'бонус', 'чехли', 'венец', 'народ', 'ведро', 'варел', 'мозък', 'пакет', 'кукла', 'пиано', 'слама',
  'парче', 'винил', 'черен', 'моряк', 'строг', 'кедър', 'бивол', 'лагер', 'сърце', 'шрифт', 'ритъм', 'звено',
  'стълб', 'албум', 'лихва', 'дарба', 'папка', 'борба', 'кифла', 'балон', 'тунел', 'лодка', 'халка', 'богат',
  'школа', 'поход', 'фенер', 'кухня', 'съвет', 'фасул', 'фурна',
]

export const DAILY_WORDS_EN: readonly string[] = [
  'eager', 'wheel', 'shine', 'straw', 'boots', 'wrist', 'cream', 'ocean', 'brush', 'mercy', 'nerve', 'comet',
  'dress', 'heavy', 'spoon', 'grill', 'candy', 'quick', 'voice', 'purse', 'click', 'float', 'model', 'bloom',
  'daily', 'opera', 'flute', 'ankle', 'sharp', 'chess', 'stamp', 'field', 'album', 'scarf', 'swing', 'pasta',
  'bliss', 'bunny', 'focus', 'logic', 'stage', 'brown', 'jelly', 'radio', 'style', 'novel', 'fluid', 'scene',
  'stone', 'salad', 'giant', 'sugar', 'comic', 'charm', 'crowd', 'badge', 'fairy', 'image', 'alarm', 'sheet',
  'bonus', 'thumb', 'tower', 'handy', 'motel', 'frame', 'beach', 'shirt', 'flash', 'queen', 'spice', 'layer',
  'waltz', 'angel', 'paint', 'slide', 'panda', 'tribe', 'ranch', 'clerk', 'flour', 'delta', 'crane', 'fever',
  'cloth', 'music', 'diary', 'guide', 'bride', 'couch', 'organ', 'bench', 'porch', 'steam', 'plane', 'baker',
  'topic', 'towel', 'sight', 'lodge', 'clown', 'owner', 'angle', 'marsh', 'moose', 'cheap', 'raven', 'thick',
  'glove', 'beard', 'sword', 'shade', 'tasty', 'eagle', 'solid', 'pitch', 'sound', 'cards', 'brand', 'globe',
  'cheer', 'attic', 'sushi', 'video', 'cabin', 'photo', 'grain', 'juice', 'meter', 'dusty', 'beans', 'royal',
  'choir', 'solar', 'wagon', 'green', 'gravy', 'skill', 'radar', 'robin', 'hobby', 'elbow', 'fence', 'peace',
  'smell', 'grade', 'lobby', 'lunch', 'tight', 'award', 'space', 'shaft', 'guard', 'alpha', 'cloud', 'roots',
  'visit', 'frost', 'ferry', 'adult', 'shape', 'score', 'shelf', 'diner', 'empty', 'bread', 'daisy', 'audio',
  'mouse', 'metal', 'stove', 'urban', 'orbit', 'twins', 'jeans', 'craft', 'speed', 'yacht', 'price', 'chair',
  'coast', 'goose', 'title', 'blade', 'trees', 'feast', 'label', 'skirt', 'quiet', 'birth', 'habit', 'climb',
  'proud', 'arena', 'ridge', 'chaos', 'theme', 'shell', 'trail', 'woods', 'twist', 'curve', 'prize', 'piece',
  'paper', 'wheat', 'pilot', 'color', 'glory', 'light', 'brick', 'guest', 'crown', 'chart', 'youth', 'trade',
  'plant', 'apple', 'floor', 'spicy', 'laugh', 'camel', 'staff', 'chest', 'medal', 'inner', 'swamp', 'sauce',
  'table', 'slice', 'coach', 'aisle', 'scout', 'shiny', 'smart', 'robot', 'cliff', 'lucky', 'fresh', 'plate',
  'faith', 'dizzy', 'token', 'drill', 'cargo', 'steps', 'whale', 'canal', 'quote', 'brave', 'storm', 'ghost',
  'jewel', 'grass', 'bacon', 'sweet', 'upper', 'glass', 'entry', 'dream', 'amber', 'shift', 'beast', 'board',
  'essay', 'pizza', 'clean', 'drama', 'puppy', 'sport', 'broad', 'tiger', 'smile', 'crash', 'store', 'shark',
  'torch', 'equal', 'vault', 'range', 'value', 'creek', 'fruit', 'world', 'brief', 'ideal', 'large', 'olive',
  'arrow', 'email', 'super', 'trunk', 'cycle', 'sheep', 'birds', 'rapid', 'alley', 'armor', 'coins', 'water',
  'horse', 'piano', 'cable', 'actor', 'study', 'lemon', 'champ', 'chain', 'heart', 'noise', 'finch', 'dozen',
  'brain', 'scale', 'grand', 'match', 'laser', 'polar', 'depth', 'truck', 'sweep', 'pearl', 'vocal', 'taste',
  'blank', 'tooth', 'power', 'clock', 'villa', 'shore', 'fleet', 'chase', 'loyal', 'panel', 'onion', 'metro',
  'verse', 'poppy', 'stock', 'river', 'error', 'socks', 'scoop', 'syrup', 'moral', 'house', 'level', 'tutor',
  'magic', 'patch', 'timer', 'seeds', 'earth', 'draft', 'elder', 'civil', 'toast', 'sunny', 'basic',
]

export const DAILY_WORDS: Record<Language, readonly string[]> = { bg: DAILY_WORDS_BG, en: DAILY_WORDS_EN }

export type Mark = 'correct' | 'present' | 'absent'

/** Today's date in Sofia as a UTC midnight timestamp, so days change at midnight Bulgarian time. */
export function sofiaToday(now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Sofia', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now)
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value)
  return Date.UTC(get('year'), get('month') - 1, get('day'))
}

/** Puzzle number for a date: 1 on the launch day, then one more every day. */
export function puzzleNumber(now: Date = new Date()): number {
  return Math.max(1, Math.round((sofiaToday(now) - EPOCH) / 86_400_000) + 1)
}

export function answerFor(puzzle: number, language: Language = 'bg'): string {
  const words = DAILY_WORDS[language]
  const count = words.length
  return words[(((puzzle - 1) % count) + count) % count]
}

/** A random answer for the unlimited mode, never the same as the one before. */
export function randomAnswer(language: Language, avoid = ''): string {
  const words = DAILY_WORDS[language]
  let word = avoid
  while (word === avoid) word = words[Math.floor(Math.random() * words.length)]
  return word
}

/** Milliseconds until the next word (midnight in Sofia). */
export function msUntilNext(now: Date = new Date()): number {
  const today = sofiaToday(now)
  // Sofia is UTC+2 or +3: find the next instant whose Sofia date is tomorrow.
  let low = now.getTime()
  let high = low + 26 * 3_600_000
  while (high - low > 1000) {
    const mid = Math.floor((low + high) / 2)
    if (sofiaToday(new Date(mid)) > today) high = mid
    else low = mid
  }
  return high - now.getTime()
}

/** Wordle colours for a guess; repeated letters only count as often as they are in the answer. */
export function markGuess(guess: string, answer: string): Mark[] {
  const marks: Mark[] = Array(WORD_LENGTH).fill('absent')
  const left = new Map<string, number>()
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === answer[i]) marks[i] = 'correct'
    else left.set(answer[i], (left.get(answer[i]) ?? 0) + 1)
  }
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (marks[i] === 'correct') continue
    const count = left.get(guess[i]) ?? 0
    if (count > 0) {
      marks[i] = 'present'
      left.set(guess[i], count - 1)
    }
  }
  return marks
}

/** Best known mark for each letter, for colouring the keyboard. */
export function keyMarks(guesses: string[], answer: string): Map<string, Mark> {
  const rank: Record<Mark, number> = { absent: 0, present: 1, correct: 2 }
  const keys = new Map<string, Mark>()
  for (const guess of guesses) {
    markGuess(guess, answer).forEach((mark, i) => {
      const before = keys.get(guess[i])
      if (!before || rank[mark] > rank[before]) keys.set(guess[i], mark)
    })
  }
  return keys
}

/** On-screen keyboards: phonetic Bulgarian (as on most phones here) and QWERTY. */
export const KEYBOARD_ROWS: Record<Language, string[]> = {
  bg: ['явертъуиопч', 'асдфгхйклшщ', 'зьцжбнмю'],
  en: ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'],
}

/** Letters a word can contain in each language. */
export const LETTERS: Record<Language, RegExp> = { bg: /^[а-ъьюя]$/, en: /^[a-z]$/ }

/** Latin keys to Cyrillic, for people typing on a Latin keyboard (phonetic layout). */
export const LATIN_TO_CYRILLIC: Record<string, string> = {
  q: 'я', w: 'в', e: 'е', r: 'р', t: 'т', y: 'ъ', u: 'у', i: 'и', o: 'о', p: 'п', '[': 'ш', ']': 'щ', '`': 'ч',
  a: 'а', s: 'с', d: 'д', f: 'ф', g: 'г', h: 'х', j: 'й', k: 'к', l: 'л', z: 'з', x: 'ь', c: 'ц', v: 'ж',
  b: 'б', n: 'н', m: 'м', '\\': 'ю',
}

export interface Stats {
  played: number
  wins: number
  streak: number
  maxStreak: number
  /** wins by number of guesses, index 0 = first guess */
  distribution: number[]
  /** last puzzle that was finished (won or lost) */
  lastPuzzle: number
  /** last puzzle that was won, for the streak */
  lastWon: number
}

export const emptyStats = (): Stats => ({ played: 0, wins: 0, streak: 0, maxStreak: 0, distribution: [0, 0, 0, 0, 0, 0], lastPuzzle: 0, lastWon: 0 })

/** Stats after finishing a puzzle; finishing the same puzzle twice changes nothing. */
export function recordResult(stats: Stats, puzzle: number, won: boolean, guesses: number): Stats {
  if (stats.lastPuzzle >= puzzle) return stats
  const next = { ...stats, distribution: [...stats.distribution], played: stats.played + 1, lastPuzzle: puzzle }
  if (won) {
    next.wins += 1
    next.streak = stats.lastWon === puzzle - 1 ? stats.streak + 1 : 1
    next.maxStreak = Math.max(next.maxStreak, next.streak)
    next.distribution[guesses - 1] += 1
    next.lastWon = puzzle
  } else {
    next.streak = 0
  }
  return next
}

/** The streak as it stands today: it is broken once a day is missed. */
export function currentStreak(stats: Stats, puzzle: number): number {
  return stats.lastWon >= puzzle - 1 ? stats.streak : 0
}

// Our own colours: orange for the right place, blue for elsewhere in the word.
const SQUARES: Record<Mark, string> = { correct: '🟧', present: '🔵', absent: '⬜' }

/** Text to share: the squares without the letters, so it does not give the word away.
 *  `heading` is e.g. "Дума на деня № 12" or "Letterwell Daily #12". */
export function shareText(heading: string, guesses: string[], answer: string, won: boolean, url: string): string {
  const rows = guesses.map((guess) => markGuess(guess, answer).map((mark) => SQUARES[mark]).join(''))
  return `${heading} · ${won ? guesses.length : 'X'}/${MAX_GUESSES}\n${rows.join('\n')}\n${url}`
}

const VOWELS: Record<Language, string> = { bg: 'аеиоуъюя', en: 'aeiou' }

/** Spoiler-light hints for an answer, from vaguest to the word itself. */
export function hintsFor(answer: string, language: Language): string[] {
  const letters = [...answer]
  const vowels = letters.filter((letter) => VOWELS[language].includes(letter)).length
  const repeated = new Set(letters).size < letters.length
  const upper = (letter: string) => letter.toLocaleUpperCase(language === 'bg' ? 'bg-BG' : 'en-US')
  return language === 'bg'
    ? [
        `Думата има ${vowels} ${vowels === 1 ? 'гласна' : 'гласни'}.`,
        repeated ? 'Една буква се среща два пъти.' : 'Всички букви са различни.',
        `Първата буква е ${upper(letters[0])}.`,
        `Последната буква е ${upper(letters[letters.length - 1])}.`,
      ]
    : [
        `The word has ${vowels} ${vowels === 1 ? 'vowel' : 'vowels'} (A, E, I, O, U).`,
        repeated ? 'One letter appears twice.' : 'All the letters are different.',
        `It starts with ${upper(letters[0])}.`,
        `It ends with ${upper(letters[letters.length - 1])}.`,
      ]
}
