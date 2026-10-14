import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const siteUrl = 'https://zyankov.eu'
const distDirectory = resolve('dist')
const projectRegistry = JSON.parse(
  await readFile(new URL('../projects.json', import.meta.url), 'utf8'),
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

const sitemapPaths = [...new Set(['/', '/privacy/', ...projectPaths])]
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapPaths.flatMap((path) => [
    '  <url>',
    `    <loc>${siteUrl}${path}</loc>`,
    '  </url>',
  ]),
  '</urlset>',
  '',
].join('\n')

await mkdir(distDirectory, { recursive: true })
await writeFile(resolve(distDirectory, 'sitemap.xml'), sitemap)
