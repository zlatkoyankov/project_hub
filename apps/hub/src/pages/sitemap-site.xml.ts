// Sitemap of the hub pages (homepage, information pages, blog) in both languages.
import { SITE, getPosts, getTranslation, isoDate, postPath } from '../lib/site'

interface Entry {
  path: string
  lastmod?: string
  alternates?: Record<string, string>
}

const pair = (en: string, bg: string) => ({ en, bg, 'x-default': en })

export async function GET() {
  const entries: Entry[] = [
    { path: '/', alternates: pair('/', '/bg/') },
    { path: '/bg/', alternates: pair('/', '/bg/') },
    { path: '/about/', alternates: pair('/about/', '/bg/za-saita/') },
    { path: '/bg/za-saita/', alternates: pair('/about/', '/bg/za-saita/') },
    { path: '/energy-cost-calculator/', alternates: pair('/energy-cost-calculator/', '/bg/razhod-na-tok/') },
    { path: '/bg/razhod-za-otoplenie/' },
    { path: '/bg/kalkulator-darva/' },
    { path: '/bg/kalkulator-klimatik/' },
    { path: '/bg/kalkulator-protsenti/', alternates: pair('/percentage-calculator/', '/bg/kalkulator-protsenti/') },
    { path: '/percentage-calculator/', alternates: pair('/percentage-calculator/', '/bg/kalkulator-protsenti/') },
    { path: '/bg/kalkulator-dds/' },
    { path: '/bg/leva-v-evro/' },
    { path: '/bg/kalkulator-dati/', alternates: pair('/date-calculator/', '/bg/kalkulator-dati/') },
    { path: '/date-calculator/', alternates: pair('/date-calculator/', '/bg/kalkulator-dati/') },
    { path: '/bg/kalkulator-kredit/', alternates: pair('/loan-calculator/', '/bg/kalkulator-kredit/') },
    { path: '/loan-calculator/', alternates: pair('/loan-calculator/', '/bg/kalkulator-kredit/') },
    { path: '/bg/kalkulator-zaplata/' },
    { path: '/bg/pochivni-dni-2027/' },
    { path: '/us-federal-holidays-2027/' },
    { path: '/uk-bank-holidays-2027/' },
    { path: '/bg/razhod-na-tok/', alternates: pair('/energy-cost-calculator/', '/bg/razhod-na-tok/') },
    { path: '/bg/kalkulator-laminat/', alternates: pair('/calculators/laminate-flooring-calculator/', '/bg/kalkulator-laminat/') },
    { path: '/bg/kalkulator-gipsokarton/', alternates: pair('/calculators/drywall-calculator/', '/bg/kalkulator-gipsokarton/') },
    { path: '/bg/kalkulator-boya/', alternates: pair('/calculators/paint-calculator/', '/bg/kalkulator-boya/') },
    { path: '/bg/kalkulator-plochki/', alternates: pair('/calculators/tile-calculator/', '/bg/kalkulator-plochki/') },
    { path: '/bg/kalkulator-beton/', alternates: pair('/calculators/concrete-calculator/', '/bg/kalkulator-beton/') },
    { path: '/bg/kalkulator-chakal/', alternates: pair('/calculators/gravel-calculator/', '/bg/kalkulator-chakal/') },
    { path: '/bg/kalkulator-tuhli/', alternates: pair('/calculators/brick-block-calculator/', '/bg/kalkulator-tuhli/') },
    { path: '/bg/kalkulator-izolatsiya/', alternates: pair('/calculators/insulation-board-calculator/', '/bg/kalkulator-izolatsiya/') },
    { path: '/bg/zamazka-i-mazilka/', alternates: pair('/calculators/screed-plaster-calculator/', '/bg/zamazka-i-mazilka/') },
    { path: '/bg/kalkulator-tapeti/', alternates: pair('/calculators/wallpaper-calculator/', '/bg/kalkulator-tapeti/') },
    { path: '/bg/lepilo-i-fuga/', alternates: pair('/calculators/tile-adhesive-grout-calculator/', '/bg/lepilo-i-fuga/') },
    { path: '/privacy/' },
    { path: '/terms/' },
    { path: '/disclaimer/' },
    { path: '/blog/', alternates: pair('/blog/', '/bg/blog/') },
    { path: '/bg/blog/', alternates: pair('/blog/', '/bg/blog/') },
  ]
  for (const post of [...(await getPosts('en')), ...(await getPosts('bg'))]) {
    const translation = await getTranslation(post)
    const [en, bg] = post.data.lang === 'en' ? [post, translation] : [translation, post]
    entries.push({
      path: postPath(post),
      lastmod: isoDate(post.data.updated ?? post.data.date),
      // Same order and x-default as the <link rel="alternate"> tags in BaseLayout.
      alternates: en && bg ? pair(postPath(en), postPath(bg)) : undefined,
    })
  }
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries.map((entry) => [
      '  <url>',
      `    <loc>${SITE}${entry.path}</loc>`,
      entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : '',
      ...Object.entries(entry.alternates ?? {}).map(([lang, path]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE}${path}" />`),
      '  </url>',
    ].filter(Boolean).join('\n')),
    '</urlset>',
    '',
  ].join('\n')
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
