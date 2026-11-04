import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'

const siteUrl = 'https://zyankov.eu'
const distDirectory = resolve('dist')
const projectRegistry = JSON.parse(
  await readFile(createRequire(import.meta.url).resolve('@zyankov/design-system/projects.json'), 'utf8'),
)

if (!Array.isArray(projectRegistry)) {
  throw new TypeError('projects.json must contain an array of projects.')
}

const projectPaths = projectRegistry.map((project) => {
  if (typeof project.name !== 'string' || !project.name.trim()) {
    throw new TypeError('Every project in projects.json must have a name.')
  }

  if (
    typeof project.href !== 'string' ||
    !project.href.startsWith('/') ||
    project.href.startsWith('//') ||
    project.href.includes('#') ||
    project.href.includes('?') ||
    project.href.split('/').includes('..') ||
    new URL(project.href, siteUrl).origin !== siteUrl
  ) {
    throw new TypeError(`Project "${project.name}" must use a root-relative URL path.`)
  }

  return project.href
})

if (new Set(projectPaths).size !== projectPaths.length) {
  throw new Error('Every project in projects.json must have a unique href.')
}

// Site pages that live in the hub. Each project publishes its own sitemap at <href>sitemap.xml.
const sitePaths = ['/', '/about/', '/privacy/', '/terms/', '/disclaimer/']

const siteSitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitePaths.map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`),
  '</urlset>',
  '',
].join('\n')

// /sitemap.xml is a sitemap index: the hub pages plus every project's own sitemap.
const sitemapIndex = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...['/sitemap-site.xml', ...projectPaths.map((path) => `${path}sitemap.xml`)].map(
    (path) => `  <sitemap><loc>${siteUrl}${path}</loc></sitemap>`,
  ),
  '</sitemapindex>',
  '',
].join('\n')

await mkdir(distDirectory, { recursive: true })
await writeFile(resolve(distDirectory, 'sitemap-site.xml'), siteSitemap)
await writeFile(resolve(distDirectory, 'sitemap.xml'), sitemapIndex)
