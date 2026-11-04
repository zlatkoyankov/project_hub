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
    { path: '/energy-cost-calculator/', alternates: pair('/energy-cost-calculator/', '/bg/razhod-na-tok/') },
    { path: '/bg/razhod-na-tok/', alternates: pair('/energy-cost-calculator/', '/bg/razhod-na-tok/') },
    { path: '/about/' },
    { path: '/privacy/' },
    { path: '/terms/' },
    { path: '/disclaimer/' },
    { path: '/blog/', alternates: pair('/blog/', '/bg/blog/') },
    { path: '/bg/blog/', alternates: pair('/blog/', '/bg/blog/') },
  ]
  for (const post of [...(await getPosts('en')), ...(await getPosts('bg'))]) {
    const translation = await getTranslation(post)
    entries.push({
      path: postPath(post),
      lastmod: isoDate(post.data.updated ?? post.data.date),
      alternates: translation ? { [post.data.lang]: postPath(post), [translation.data.lang]: postPath(translation) } : undefined,
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
