// Tells Bing (and the other IndexNow engines: Yandex, Seznam, Naver, Yep) which pages changed,
// so they recrawl them within minutes instead of days. Google does not use IndexNow.
//
//   npm run indexnow                 sends the pages whose content changed since the last send
//   npm run indexnow -- --dry-run    lists them, sends nothing
//   npm run indexnow -- --all        sends every page in the sitemaps
//   npm run indexnow -- <url> ...    sends just these URLs
//
// Run it after the new build is live on the server (npm run deploy -- --yes runs it for you).
// Only pages listed in the sitemaps are sent. What was sent is remembered in .indexnow-sent.json
// (not in git), keyed by a hash of each page with the hashed asset names removed, so a rebuild
// that changes nothing visible sends nothing.
// Protocol: https://www.indexnow.org/documentation (key file at the site root, JSON POST).
import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SITE = 'https://zyankov.eu'
const HOST = 'zyankov.eu'
// Public by design: the same value is served at https://zyankov.eu/<KEY>.txt
// (apps/hub/public/<KEY>.txt) so the engines can check that the request comes from the site owner.
// Replaced on 10 November 2026: Bing kept answering 403 for the first key, probably because the first send
// ran before the key file was on the server.
const KEY = '4853336ada3a8185d5c93f52dbc3c0eb'
// The shared endpoint passes the URLs to every IndexNow engine. Yandex is a second door: if Bing refuses but
// Yandex accepts, the key file is fine and the problem is on Bing's side.
const ENDPOINTS = ['https://api.indexnow.org/indexnow', 'https://yandex.com/indexnow']

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const stateFile = resolve(root, '.indexnow-sent.json')
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const all = args.includes('--all')
const explicit = args.filter((arg) => !arg.startsWith('--'))

const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim())
const distPath = (url) => resolve(dist, `.${new URL(url).pathname}`, new URL(url).pathname.endsWith('/') ? 'index.html' : '')

/** Every page URL in the sitemap index and the sitemaps it lists. */
async function sitemapUrls() {
  const index = await readFile(resolve(dist, 'sitemap.xml'), 'utf8')
  const urls = []
  for (const sitemap of locs(index)) urls.push(...locs(await readFile(distPath(sitemap), 'utf8')))
  return [...new Set(urls)]
}

/** Hash of a built page without hashed asset names, which change on rebuilds with no visible change. */
async function pageHash(url) {
  const html = await readFile(distPath(url), 'utf8')
  const stable = html.replace(/[-.][A-Za-z0-9_]{8,}\.(css|js|mjs|woff2|webp|png|svg)\b/g, '.$1')
  return createHash('sha256').update(stable).digest('hex').slice(0, 16)
}

async function checkLiveKey() {
  const live = await fetch(`${SITE}/${KEY}.txt`, { redirect: 'manual' }).catch((error) => error)
  const liveText = live instanceof Response && live.status === 200 ? (await live.text()).trim() : ''
  if (liveText !== KEY) {
    const why = live instanceof Response ? `answered ${live.status}${live.headers.get('location') ? ` -> ${live.headers.get('location')}` : ''}` : live.message
    throw new Error(`${SITE}/${KEY}.txt ${liveText ? 'has different content' : why}. Deploy the new build first, then run npm run indexnow.`)
  }
  console.log(`IndexNow: key file is live at ${SITE}/${KEY}.txt`)
}

async function main() {
  const keyFile = await readFile(resolve(dist, `${KEY}.txt`), 'utf8').catch(() => '')
  if (keyFile.trim() !== KEY) throw new Error(`dist/${KEY}.txt is missing or wrong. Run npm run build first.`)

  // The engines read the key from the live site, so check it the same way before sending anything.
  if (!dryRun) await checkLiveKey()

  let sent = {}
  try {
    sent = JSON.parse(await readFile(stateFile, 'utf8'))
  } catch {
    // First run: everything counts as changed.
  }

  let urls
  const hashes = {}
  if (explicit.length) {
    urls = explicit.map((url) => new URL(url, SITE).href)
  } else {
    urls = []
    for (const url of await sitemapUrls()) {
      hashes[url] = await pageHash(url)
      if (all || sent[url] !== hashes[url]) urls.push(url)
    }
  }
  const foreign = urls.filter((url) => new URL(url).host !== HOST)
  if (foreign.length) throw new Error(`Not on ${HOST}: ${foreign.join(', ')}`)

  if (!urls.length) {
    console.log('IndexNow: no changed pages to send.')
    return
  }
  console.log(`IndexNow: ${urls.length} page(s)${dryRun ? ' would be sent' : ''}:`)
  for (const url of urls) console.log(`  ${url}`)
  if (dryRun) return

  // One request takes up to 10,000 URLs. Try the endpoints in order and stop at the first that accepts.
  for (let i = 0; i < urls.length; i += 10_000) {
    const urlList = urls.slice(i, i + 10_000)
    const refusals = []
    for (const endpoint of ENDPOINTS) {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
      }).catch((error) => error)
      // 200 = received, 202 = received and the key check is still pending (normal on the first send).
      if (response instanceof Response && (response.status === 200 || response.status === 202)) {
        console.log(`IndexNow: ${new URL(endpoint).host} accepted (${response.status}).`)
        break
      }
      const answer = response instanceof Response ? `${response.status} ${await response.text()}` : response.message
      console.log(`IndexNow: ${new URL(endpoint).host} refused: ${answer}`)
      refusals.push(endpoint)
    }
    if (refusals.length === ENDPOINTS.length) throw new Error('IndexNow: every endpoint refused, nothing was recorded as sent.')
  }

  for (const url of urls) if (hashes[url]) sent[url] = hashes[url]
  await writeFile(stateFile, `${JSON.stringify(sent, null, 2)}\n`)
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
