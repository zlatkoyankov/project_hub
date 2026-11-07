// /og/<key>.png — sharing images for every hub page, every post and the Letterwell pages.
// <key> is the page path without slashes: "/" → home, "/bg/blog/x/" → bg-blog-x (see ogKey()).
import type { APIRoute, GetStaticPaths } from 'astro'
import { renderOg, type OgCard } from '../../lib/og'
import { getPosts, ogKey, postPath } from '../../lib/site'

export const getStaticPaths: GetStaticPaths = async () => {
  const cards: Record<string, OgCard> = {
    home: { kicker: 'Free browser tools', title: 'Small tools. Made with care.' },
    bg: { kicker: 'Безплатни инструменти', title: 'Малки инструменти. Направени с грижа.' },
    about: { kicker: 'About', title: 'Hi, I’m Zlatko. I build small, useful browser tools.' },
    privacy: { kicker: 'Privacy policy', title: 'What Zyankov.eu processes and why' },
    terms: { kicker: 'Terms of use', title: 'Terms for Zyankov.eu, Letterwell and BuildCalc' },
    disclaimer: { kicker: 'Disclaimer', title: 'What the estimates and word lists can and cannot tell you' },
    blog: { kicker: 'Blog', title: 'Worked examples for word games and home projects' },
    'bg-blog': { kicker: 'Блог', title: 'Практични статии за думи и ремонти' },
    letterwell: { kicker: 'Letterwell · word finder', title: 'Find words from your letters', footer: 'zyankov.eu/letterwell' },
    'letterwell-bg': { kicker: 'Letterwell · търсачка за думи', title: 'Думи от букви на български', footer: 'zyankov.eu/letterwell/bg' },
    'energy-cost-calculator': { kicker: 'Home & energy · calculator', title: 'What does it cost to run?', footer: 'zyankov.eu/energy-cost-calculator' },
    'bg-kalkulator-darva': { kicker: 'Дом и енергия · калкулатор', title: 'Колко дърва или пелети ми трябват за зимата?', footer: 'zyankov.eu/bg/kalkulator-darva' },
    'bg-razhod-za-otoplenie': { kicker: 'Дом и енергия · калкулатор', title: 'Дърва, пелети или климатик: кое е най-евтино?', footer: 'zyankov.eu/bg/razhod-za-otoplenie' },
    'bg-razhod-na-tok': { kicker: 'Дом и енергия · калкулатор', title: 'Колко ток харчи уредът?', footer: 'zyankov.eu/bg/razhod-na-tok' },
    'bg-kalkulator-laminat': { kicker: 'Дом и ремонт · калкулатор', title: 'Колко ламинат и первази ми трябват?', footer: 'zyankov.eu/bg/kalkulator-laminat' },
    'bg-kalkulator-gipsokarton': { kicker: 'Дом и ремонт · калкулатор', title: 'Колко плоскости гипсокартон ми трябват?', footer: 'zyankov.eu/bg/kalkulator-gipsokarton' },
    'bg-kalkulator-boya': { kicker: 'Дом и ремонт · калкулатор', title: 'Колко литра боя ми трябват?', footer: 'zyankov.eu/bg/kalkulator-boya' },
    'bg-kalkulator-plochki': { kicker: 'Дом и ремонт · калкулатор', title: 'Колко плочки и кашони ми трябват?', footer: 'zyankov.eu/bg/kalkulator-plochki' },
    'bg-kalkulator-beton': { kicker: 'Дом и ремонт · калкулатор', title: 'Колко бетон, цимент и пясък ми трябват?', footer: 'zyankov.eu/bg/kalkulator-beton' },
    'bg-kalkulator-chakal': { kicker: 'Дом и ремонт · калкулатор', title: 'Колко чакъл или пясък ми трябва?', footer: 'zyankov.eu/bg/kalkulator-chakal' },
    'bg-kalkulator-tuhli': { kicker: 'Дом и ремонт · калкулатор', title: 'Колко тухли и разтвор ми трябват?', footer: 'zyankov.eu/bg/kalkulator-tuhli' },
    'bg-kalkulator-izolatsiya': { kicker: 'Дом и ремонт · калкулатор', title: 'Колко стиропор и лепило ми трябват?', footer: 'zyankov.eu/bg/kalkulator-izolatsiya' },
    'bg-zamazka-i-mazilka': { kicker: 'Дом и ремонт · калкулатор', title: 'Колко замазка или мазилка ми трябва?', footer: 'zyankov.eu/bg/zamazka-i-mazilka' },
    'bg-kalkulator-tapeti': { kicker: 'Дом и ремонт · калкулатор', title: 'Колко ролки тапет ми трябват?', footer: 'zyankov.eu/bg/kalkulator-tapeti' },
    'bg-lepilo-i-fuga': { kicker: 'Дом и ремонт · калкулатор', title: 'Колко лепило и фуга ми трябват?', footer: 'zyankov.eu/bg/lepilo-i-fuga' },
    'letterwell-wordle-solver': { kicker: 'Letterwell · Wordle helper', title: 'Stuck on Wordle? Narrow down the answer', footer: 'zyankov.eu/letterwell/wordle-solver' },
    'letterwell-spelling-bee-solver': { kicker: 'Letterwell · Spelling Bee helper', title: 'Seven letters. How many words?', footer: 'zyankov.eu/letterwell/spelling-bee-solver' },
    'letterwell-bg-spelling-bee': { kicker: 'Letterwell · Spelling Bee', title: 'Седем букви. Колко думи?', footer: 'zyankov.eu/letterwell/bg/spelling-bee' },
    'letterwell-crossword-solver': { kicker: 'Letterwell · crossword helper', title: 'Missing a few letters? Fill the gaps', footer: 'zyankov.eu/letterwell/crossword-solver' },
    'letterwell-bg-krastoslovitsi': { kicker: 'Letterwell · кръстословици', title: 'Думи по шаблон за кръстословици', footer: 'zyankov.eu/letterwell/bg/krastoslovitsi' },
    'letterwell-daily': { kicker: 'Letterwell · word game', title: 'Letterwell Daily: find the five-letter word', footer: 'zyankov.eu/daily' },
    'letterwell-bg-duma-na-denya': { kicker: 'Letterwell · игра', title: 'Дума на деня: познай думата от 5 букви', footer: 'zyankov.eu/duma' },
    'letterwell-bg-wordle': { kicker: 'Letterwell · помощник за Wordle', title: 'Wordle на български: стесни възможните думи', footer: 'zyankov.eu/letterwell/bg/wordle' },
  }
  for (const lang of ['en', 'bg'] as const) {
    for (const post of await getPosts(lang)) {
      cards[ogKey(postPath(post))] = { kicker: lang === 'bg' ? 'Блог' : 'Blog', title: post.data.title }
    }
  }
  return Object.entries(cards).map(([key, card]) => ({ params: { key }, props: card }))
}

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await renderOg(props as OgCard)), { headers: { 'Content-Type': 'image/png' } })
