// Every number and word list quoted in the written guides (src/content) is recomputed here from the
// real tool code and the word lists in public/, so the text cannot drift from what the tools output.
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { ANAGRAM_WORDS_BG, ANAGRAM_WORDS_EN, sameLetters } from './anagram'
import { beeHints, beePoints, findBeeWords } from './bee'
import { CONTENT } from './content'
import { findMatches } from './crossword'
import { DAILY_WORDS_BG, DAILY_WORDS_EN, markGuess } from './daily'
import { feedback, filterWords, parseWordleList, suggestGuess, OPENERS, type GuessRow, type Tile } from './wordle'

const PUBLIC = new URL('../public/', import.meta.url)
const read = (file: string) => readFileSync(new URL(file, PUBLIC), 'utf8')
const lines = (file: string) => read(file).split(/\r?\n/).filter(Boolean)
const en = lines('english-words.txt')
const bg = lines('bulgarian-words.txt')
const listEn = parseWordleList(read('wordle-en.txt'))
const listBg = parseWordleList(read('wordle-bg.txt'))

const text = (page: keyof typeof CONTENT, language: 'en' | 'bg') => JSON.stringify(CONTENT[page][language])
const expectText = (page: keyof typeof CONTENT, language: 'en' | 'bg', ...needles: (string | number)[]) => {
  const body = text(page, language)
  for (const needle of needles) expect(body, `${page}/${language} should mention ${needle}`).toContain(String(needle))
}
const tilesOf = (guess: string, answer: string): Tile[] => {
  let code = feedback(guess, answer)
  const tiles: Tile[] = [0, 0, 0, 0, 0]
  for (let i = 4; i >= 0; i--) { tiles[i] = (code % 3) as Tile; code = Math.floor(code / 3) }
  return tiles
}
const count = (words: string[], rack: string, o: { min?: number; max?: number; start?: string; all?: boolean } = {}) => {
  const canBuild = (word: string) => {
    const left = new Map<string, number>()
    for (const char of rack) left.set(char, (left.get(char) ?? 0) + 1)
    for (const char of word) { const n = (left.get(char) ?? 0) - 1; if (n < 0) return false; left.set(char, n) }
    return true
  }
  return words.filter((w) => w.length >= (o.all ? rack.length : o.min ?? 2) && w.length <= (o.all ? rack.length : o.max ?? 12) && (!o.start || w.startsWith(o.start)) && canBuild(w))
}

describe('Spelling Bee guide', () => {
  it('English example: a + lpcire', () => {
    const found = findBeeWords(en, 'a', 'lpcire')
    const hints = beeHints(found)
    expect([hints.total, hints.points, hints.pangrams]).toEqual([380, 2034, 7])
    expect(found.filter((w) => w.pangram).map((w) => w.word).sort()).toEqual(['calliper', 'caliper', 'capercaillie', 'capillaire', 'paperclip', 'pericarpial', 'replica'].sort())
    expect([...'pca'].map((l) => [...hints.grid.get(l)!.values()].reduce((s, v) => s + v, 0))).toEqual([114, 91, 71])
    const starts = new Map(hints.starts)
    expect([starts.get('pa'), starts.get('ca')]).toEqual([62, 56])
    expect(found[0].word).toBe('capercaillie')
    expect(Math.max(...found.map((w) => w.points))).toBe(19)
    expect([beePoints('pace', false), beePoints('replica', true), beePoints('capercaillie', true)]).toEqual([1, 14, 19])
    expect(found.some((w) => w.word === 'alcaiceria') && found.some((w) => w.word === 'pericarpial')).toBe(true)
    expectText('bee', 'en', '380', '2,034', '114', '91', '71', 'PA gives 62', 'CA gives 56', '118 of the 380', 'capercaillie, pericarpial, capillaire, paperclip, calliper, caliper and replica')
  })
  it('Bulgarian example: а + ктрнои', () => {
    const found = findBeeWords(bg, 'а', 'ктрнои')
    const hints = beeHints(found)
    expect([hints.total, hints.points, hints.pangrams]).toEqual([267, 1452, 8])
    expect(found.filter((w) => w.pangram).map((w) => w.word).sort()).toEqual(['арткино', 'кантарион', 'картинно', 'кинокритика', 'каротин', 'коронарит', 'наркотик', 'трикратно'].sort())
    expect(['к', 'т', 'а'].map((l) => [...hints.grid.get(l)!.values()].reduce((s, v) => s + v, 0))).toEqual([98, 57, 38])
    const starts = new Map(hints.starts)
    expect([starts.get('ка'), starts.get('ко'), starts.get('ар')]).toEqual([48, 31, 10])
    expect([beePoints('нота', false), beePoints('картинно', true), beePoints('кинокритика', true)]).toEqual([1, 15, 18])
    expect(Math.max(...found.map((w) => w.points))).toBe(18)
    expect(bg.includes('нота') && found.some((w) => w.word === 'нота')).toBe(true)
    expectText('bee', 'bg', '267', '1452', '98', '57', '38', 'КА (48)', 'КО (31)', 'АР', '15', '18', 'кинокритика, кантарион, коронарит, трикратно, картинно, наркотик, арткино и каротин')
  })
})

describe('crossword guide', () => {
  it('English examples', () => {
    const a = findMatches(en, { pattern: 'c?o?s' })
    expect(a).toEqual('chocs,chogs,chops,chows,cions,clods,clogs,clons,clops,clots,clous,clows,cloys,coofs,cooks,cools,cooms,coops,coots,crocs,crogs,crops,cross,crows'.split(','))
    expect(findMatches(en, { pattern: 'c?o?s', include: 'r' })).toEqual(['crocs', 'crogs', 'crops', 'cross', 'crows'])
    expect(findMatches(en, { pattern: 'c?o?s', exclude: 'hl' })).toEqual('cions,coofs,cooks,cooms,coops,coots,crocs,crogs,crops,cross,crows'.split(','))
    expect(findMatches(en, { pattern: '??ple' })).toEqual(['ample', 'apple', 'caple', 'duple', 'maple', 'tuple'])
    expectText('crossword', 'en', '24 words', 'chocs, chogs, chops, chows, cions, clods, clogs, clons, clops, clots, clous, clows, cloys, coofs, cooks, cools, cooms, coops, coots, crocs, crogs, crops, cross and crows', '5 words remain', 'leaves 11', 'cions, coofs, cooks, cooms, coops, coots, crocs, crogs, crops, cross and crows', '6 words: ample, apple, caple, duple, maple and tuple')
  })
  it('Bulgarian examples', () => {
    expect(findMatches(bg, { pattern: 'к?л??а' })).toEqual('калина,колега,коледа,колена,колиба,колика,колица,колода,колона,кулата,кулина,кулиса'.split(','))
    expect(findMatches(bg, { pattern: 'к?л??а', exclude: 'о' })).toEqual(['калина', 'кулата', 'кулина', 'кулиса'])
    expect(findMatches(bg, { pattern: 'к?л??а', include: 'ц' })).toEqual(['колица'])
    expect(findMatches(bg, { pattern: 'пр??ет' })).toEqual(['прелет', 'привет', 'пролет'])
    expect(findMatches(bg, { pattern: 'пр??ет', include: 'л' })).toEqual(['прелет', 'пролет'])
    expectText('crossword', 'bg', '12 думи', 'калина, колега, коледа, колена, колиба, колика, колица, колода, колона, кулата, кулина и кулиса', '4 думи: калина, кулата, кулина и кулиса', 'колица', '3 думи: прелет, привет и пролет', 'от 12 на 4')
  })
})

describe('Wordle guide', () => {
  const run = (list: typeof listEn, guesses: [string, string][]) => {
    const rows: GuessRow[] = guesses.map(([word, answer]) => ({ word, tiles: tilesOf(word, answer) }))
    const common = filterWords(list.common, rows)
    const rare = filterWords(list.rare, rows)
    return { rows, common, rare, suggestion: suggestGuess(common.length ? common : rare, list.common) }
  }
  it('English: raise against fudge, then could', () => {
    const first = run(listEn, [['raise', 'fudge']])
    expect(first.rows[0].tiles).toEqual([0, 0, 0, 0, 2])
    expect([first.common.length, first.rare.length]).toEqual([76, 214])
    expect(first.suggestion?.word).toBe('could')
    expect(first.suggestion?.expectedLeft.toFixed(1)).toBe('2.8')
    const second = run(listEn, [['raise', 'fudge'], ['could', 'fudge']])
    expect(second.rows[1].tiles).toEqual([0, 0, 1, 0, 1])
    expect(second.common).toEqual(['judge', 'fudge', 'budge', 'nudge', 'undue'])
    expect(second.rare.length).toBe(5)
    expect(DAILY_WORDS_EN.includes('fudge')).toBe(false)
    expectText('wordle', 'en', '76 likely answers and 214', 'COULD', '2.8', 'judge, fudge, budge, nudge and undue')
  })
  it('English: raise against brisk', () => {
    const r = run(listEn, [['raise', 'brisk']])
    expect(r.rows[0].tiles).toEqual([1, 0, 2, 2, 0])
    expect(r.common).toEqual(['wrist', 'crisp', 'frisk', 'prism', 'brisk', 'priss'])
    expect(r.rare.length).toBe(5)
    expect(DAILY_WORDS_EN.includes('brisk')).toBe(false)
  })
  it('English: repeated letters, geese against there', () => {
    expect(tilesOf('geese', 'there')).toEqual([0, 0, 2, 0, 2])
  })
  it('Bulgarian: ролка against писък, then тенис', () => {
    const first = run(listBg, [['ролка', 'писък']])
    expect(first.rows[0].tiles).toEqual([0, 0, 0, 1, 0])
    expect([first.common.length, first.rare.length]).toEqual([40, 85])
    expect(first.suggestion?.word).toBe('тенис')
    expect(first.suggestion?.expectedLeft.toLocaleString('bg-BG', { maximumFractionDigits: 1 })).toBe('1,8')
    const second = run(listBg, [['ролка', 'писък'], ['тенис', 'писък']])
    expect(second.rows[1].tiles).toEqual([0, 0, 0, 1, 1])
    expect(second.common).toEqual(['писък', 'скуби'])
    expect(second.rare).toEqual([])
    expect(DAILY_WORDS_BG.includes('писък')).toBe(false)
    expectText('wordle', 'bg', '40 най-вероятни думи и 85', 'ТЕНИС', '1,8', 'писък и скуби')
  })
  it('Bulgarian: ролка against малко, and repeated letters', () => {
    const r = run(listBg, [['ролка', 'малко']])
    expect(r.rows[0].tiles).toEqual([0, 1, 2, 2, 1])
    expect(r.common).toEqual(['малко', 'жалко'])
    expect(r.rare).toEqual([])
    expect(tilesOf('тетка', 'ласти')).toEqual([1, 0, 0, 0, 1])
    expect(listBg.common.concat(listBg.rare).includes('писък') && listBg.common.includes('пясък')).toBe(true)
    expectText('wordle', 'bg', 'малко и жалко')
  })
  it('lists and openers', () => {
    expect(OPENERS.en.slice(0, 5)).toEqual(['raise', 'arise', 'irate', 'arose', 'later'])
    expect(OPENERS.bg.slice(0, 5)).toEqual(['ролка', 'норма', 'корал', 'катер', 'нотка'])
    expect(Math.round((listEn.common.length + listEn.rare.length) / 100) * 100).toBe(12600)
    expect(Math.round(listEn.common.length / 1000) * 1000).toBe(4000)
    expect(Math.round((listBg.common.length + listBg.rare.length) / 100) * 100).toBe(6300)
    expect(Math.round(listBg.common.length / 100) * 100).toBe(2100)
    expectText('wordle', 'en', '12,600', '4,000', 'RAISE, ARISE, IRATE, AROSE and LATER')
    expectText('wordle', 'bg', '6300', '2100', 'РОЛКА, НОРМА, КОРАЛ, КАТЕР и НОТКА')
  })
})

describe('anagram guide', () => {
  const group = (words: string[], key: string) => words.filter((w) => sameLetters(w, key))
  it('English groups', () => {
    expect(group(en.filter((w) => w.length === 6), 'stable')).toEqual('ablest,ablets,bastle,blaest,bleats,stable,tables'.split(','))
    expect(group(en.filter((w) => w.length === 6), 'listen').sort()).toEqual('elints,enlist,inlets,intels,listen,silent,tinsel'.split(','))
    for (const w of [...group(en, 'stable'), ...group(en, 'listen')]) expect(ANAGRAM_WORDS_EN.includes(w)).toBe(false)
    expectText('anagram', 'en', '7 six-letter words', 'ablest, ablets, bastle, blaest, bleats, stable and tables', 'elints, enlist, inlets, intels, listen, silent and tinsel')
  })
  it('Bulgarian groups', () => {
    expect(group(bg.filter((w) => w.length === 6), 'талант').sort()).toEqual(['атлант', 'талант', 'тантал'])
    expect(group(bg.filter((w) => w.length === 6), 'болест').sort()).toEqual(['болест', 'сетбол', 'стебло'])
    for (const w of ['атлант', 'талант', 'тантал', 'болест', 'сетбол', 'стебло']) expect(ANAGRAM_WORDS_BG.includes(w)).toBe(false)
    expectText('anagram', 'bg', 'атлант, талант и тантал', 'болест, сетбол и стебло')
  })
  it('list sizes quoted in the text', () => {
    expect(ANAGRAM_WORDS_EN.length).toBe(154)
    expect(ANAGRAM_WORDS_BG.length).toBe(143)
    expectText('anagram', 'en', '154')
    expectText('anagram', 'bg', '143')
  })
})

describe('word finder guide', () => {
  const by = (words: string[]) => {
    const lengths = new Map<number, number>()
    for (const w of words) lengths.set(w.length, (lengths.get(w.length) ?? 0) + 1)
    return [...lengths].sort((a, b) => a[0] - b[0])
  }
  it('English examples', () => {
    const all = count(en, 'triangle')
    expect(all.length).toBe(455)
    expect(by(all)).toEqual([[2, 23], [3, 81], [4, 144], [5, 102], [6, 69], [7, 29], [8, 7]])
    expect(all.includes('tingle') && !all.includes('tinning')).toBe(true)
    expect(count(en, 'triangle', { all: true }).sort()).toEqual(['alerting', 'altering', 'integral', 'relating', 'tanglier', 'teraglin', 'triangle'])
    expect(count(en, 'stream', { min: 5, start: 's' }).sort()).toEqual(['satem', 'smart', 'smear', 'stare', 'steam', 'stear', 'strae', 'stream'])
    expect(count(en, 'stream').length).toBe(154)
    expectText('finder', 'en', '455', '23 words of two letters, 81 of three, 144 of four, 102 of five, 69 of six, 29 of seven and 7 of eight', 'alerting, altering, integral, relating, tanglier, teraglin', 'stream, satem, smart, smear, stare, steam, stear and strae', '154')
  })
  it('Bulgarian examples', () => {
    expect(by(count(bg, 'слушам'))).toEqual([[2, 7], [3, 9], [4, 5], [5, 2], [6, 1]])
    expect(count(bg, 'слушам', { min: 5 }).sort()).toEqual(['слуша', 'слушам', 'смуша'])
    expect(count(bg, 'слушам').includes('муша') && count(bg, 'слушам').includes('аум')).toBe(true)
    expect(count(bg, 'триъгълник', { all: true })).toEqual(['триъгълник'])
    expect(by(count(bg, 'триъгълник'))).toEqual([[2, 6], [3, 18], [4, 24], [5, 10], [6, 8], [7, 3], [10, 1]])
    expect(count(bg, 'триъгълник', { min: 6 }).sort()).toEqual('триъгълник,клиринг,кърлинг,ъгълник,кръгъл,кънтри,лигнит,рингит,ритник,трилик,тринки,търлък'.split(',').sort())
    expectText('finder', 'bg', '24 думи', '7 думи от две букви, 9 от три, 5 от четири, 2 от пет и 1 от шест', '6 от две букви, 18 от три, 24 от четири, 10 от пет, 8 от шест, 3 от седем и 1 от десет', 'триъгълник, клиринг, кърлинг, ъгълник, кръгъл, кънтри, лигнит, рингит, ритник, трилик, тринки и търлък')
  })
})

describe('daily game guide', () => {
  it('colouring examples', () => {
    expect(markGuess('abbey', 'bible')).toEqual(['absent', 'present', 'correct', 'present', 'absent'])
    expect(markGuess('кубик', 'бутик')).toEqual(['absent', 'correct', 'present', 'correct', 'correct'])
    for (const w of ['abbey', 'bible']) expect(DAILY_WORDS_EN.includes(w)).toBe(false)
    for (const w of ['кубик', 'бутик']) expect(DAILY_WORDS_BG.includes(w)).toBe(false)
  })
  it('list sizes quoted in the text', () => {
    expect(DAILY_WORDS_EN.length).toBe(359)
    expect(DAILY_WORDS_BG.length).toBe(559)
    expectText('daily', 'en', '359', '12,600', '4,000')
    expectText('daily', 'bg', '559', '6300', '2100')
  })
})

describe('dictionary sizes quoted in the guides', () => {
  it('match the word lists', () => {
    expect(Math.round(en.length / 1000)).toBe(274)
    expect(Math.round(bg.length / 500) * 500).toBe(126500)
    expect(en.every((w) => /^[a-z]+$/.test(w))).toBe(true)
    expect(bg.every((w) => /^[а-я]+$/.test(w))).toBe(true)
    for (const page of ['bee', 'crossword', 'finder', 'anagram'] as const) expectText(page, 'en', '274,000')
    for (const page of ['bee', 'crossword', 'finder'] as const) expectText(page, 'bg', '126 500')
  })
})
