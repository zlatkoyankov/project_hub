// Builds short word meanings for the Wordle helper from Wiktionary.
//
// Source: the tab-separated Wiktionary dictionaries in https://github.com/Vuizur/Wiktionary-Dictionaries
// ("English-English Wiktionary dictionary.tsv"),
// extracted from the English Wiktionary with wiktextract. Licence: CC BY-SA 3.0 / GFDL, like Wiktionary.
//
// Usage: node scripts/build-meanings.mjs <path to the Wiktionary-Dictionaries checkout>
//
// Output, for each language:
//   public/meanings/<lang>/<code point of the first letter>.json  { word: [[partOfSpeech, [sense, …]], …] or { f: headword, m: … } }
//   public/meanings/<lang>/index.txt            one bit per word of public/wordle-<lang>.txt (base64), so the
//                                               page knows which words have a meaning without loading any of them.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const source = process.argv[2]
if (!source) throw new Error('Usage: node scripts/build-meanings.mjs <Wiktionary-Dictionaries checkout>')

// English only: for Bulgarian words Wiktionary mostly gives English glosses, so the Bulgarian page
// links to Bulgarian dictionaries instead (see dictionaryLinks in src/meanings.ts).
const SOURCES = { en: 'English-English Wiktionary dictionary.tsv' }
const MAX_PARTS = 2
const MAX_SENSES = 2
const MAX_CHARS = 150
// Senses marked like this are skipped when the word has other senses.
const SIDELINED = /^\([^)]*\b(?:archaic|obsolete|dated|rare|nonstandard|dialectal|dialect|Internet slang|vulgar|offensive|derogatory|slang|historical|uncommon|poetic)\b[^)]*\)/i

const normalise = (word) => word.normalize('NFD').toLowerCase().replace(/[̀́]/g, '').normalize('NFC').replace(/ѝ/g, 'и')
const stripTags = (text) => text.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim()
const shorten = (text) => (text.length <= MAX_CHARS ? text : `${text.slice(0, MAX_CHARS - 1).replace(/[\s,;:]+\S*$/, '')}…`)

// Top-level <li> items of an <ol>…</ol> body (nested lists are dropped).
function senses(listHtml) {
  const items = []
  let depth = 0
  let start = -1
  const tag = /<(\/?)(ol|li)>/g
  let match
  while ((match = tag.exec(listHtml))) {
    const [, closing, name] = match
    if (name === 'ol') depth += closing ? -1 : 1
    else if (!closing && depth === 0) start = tag.lastIndex
    else if (closing && depth === 0 && start >= 0) {
      items.push(stripTags(listHtml.slice(start, match.index)))
      start = -1
    }
  }
  return items.filter(Boolean)
}

// "<i>noun</i><br><ol>…</ol><br><i>verb</i><br><ol>…</ol>" → [["noun", [...]], ["verb", [...]]]
function parts(body) {
  const result = []
  for (const block of body.split(/(?:<br>)?(?=<i>[^<]{1,30}<\/i><br><ol>)/)) {
    const match = block.match(/^<i>([^<]{1,30})<\/i><br><ol>([\s\S]*)<\/ol>/)
    if (!match) continue
    const all = senses(match[2])
    const main = all.filter((sense) => !SIDELINED.test(sense))
    const picked = (main.length ? main : all).slice(0, MAX_SENSES).map(shorten)
    if (picked.length) result.push([match[1], picked])
  }
  return result
}

function loadDictionary(path) {
  const heads = new Map()
  const forms = new Map()
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const tab = line.indexOf('\t')
    if (tab < 0) continue
    const names = line.slice(0, tab).split('|')
    const head = normalise(names[0])
    const entry = parts(line.slice(tab + 1))
    if (!entry.length) continue
    // "crane" before "Crane": lower-case headwords first, proper names only when nothing else is left.
    const lower = names[0] === names[0].toLowerCase()
    const previous = heads.get(head) ?? []
    heads.set(head, lower ? [...entry, ...previous] : [...previous, ...entry])
    for (const form of names.slice(1)) {
      const key = normalise(form)
      if (!forms.has(key)) forms.set(key, head)
    }
  }
  for (const [head, entry] of heads) {
    const common = entry.filter(([part]) => part !== 'name')
    if (common.length) heads.set(head, common)
  }
  return { heads, forms }
}

for (const [lang, file] of Object.entries(SOURCES)) {
  const { heads, forms } = loadDictionary(join(source, file))
  const words = readFileSync(`public/wordle-${lang}.txt`, 'utf8').split(/\r?\n/).filter((word) => word.length === 5)
  const chunks = new Map()
  const bits = new Uint8Array(Math.ceil(words.length / 8))
  let found = 0
  words.forEach((word, index) => {
    let value = heads.get(word)?.slice(0, MAX_PARTS)
    if (!value && forms.has(word)) {
      const head = forms.get(word)
      const meaning = heads.get(head)?.slice(0, MAX_PARTS)
      if (meaning) value = { f: head, m: meaning }
    }
    if (!value) return
    found += 1
    bits[index >> 3] |= 1 << (index & 7)
    // File names by code point (a → 97, а → 1072), so Cyrillic never reaches FTP or a URL.
    const letter = word.codePointAt(0)
    if (!chunks.has(letter)) chunks.set(letter, {})
    chunks.get(letter)[word] = value
  })
  const out = `public/meanings/${lang}`
  rmSync(out, { recursive: true, force: true })
  mkdirSync(out, { recursive: true })
  for (const [letter, chunk] of chunks) writeFileSync(join(out, `${letter}.json`), JSON.stringify(chunk))
  writeFileSync(join(out, 'index.txt'), Buffer.from(bits).toString('base64'))
  console.log(`${lang}: ${found} of ${words.length} words have a meaning, ${chunks.size} files`)
}
