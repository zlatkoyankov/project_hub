// /sitemap.xml is a sitemap index: the hub pages plus every project's own sitemap.
import { projects } from '@zyankov/design-system/render'
import { SITE } from '../lib/site'

export function GET() {
  const paths = ['/sitemap-site.xml', ...projects.map((project) => `${project.href}sitemap.xml`)]
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map((path) => `  <sitemap><loc>${SITE}${path}</loc></sitemap>`),
    '</sitemapindex>',
    '',
  ].join('\n')
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
