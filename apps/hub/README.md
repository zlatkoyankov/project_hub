# Hub (zyankov.eu homepage, blog and information pages)

Built with [Astro](https://astro.build) as static HTML. Letterwell and BuildCalc are separate
apps; `scripts/assemble-site.mjs` in the repository root puts everything together.

| Path | Page |
| --- | --- |
| `src/pages/index.astro`, `src/pages/bg/index.astro` | Homepage in English and Bulgarian |
| `src/pages/about/`, `privacy/`, `terms/`, `disclaimer/` | Information pages (`PageLayout`) |
| `src/pages/blog/`, `src/pages/bg/blog/` | Blog listing, posts and RSS in each language |
| `src/pages/sitemap.xml.ts`, `sitemap-site.xml.ts` | Sitemap index and the hub's own sitemap |
| `src/layouts/BaseLayout.astro` | Head metadata, hreflang, JSON-LD and the shared shell |

Project cards come from `packages/design-system/projects.json`.

## Writing a blog post

1. Add `src/content/blog/en/<slug>.md` (or `bg/<slug>.md`). The file name becomes the URL:
   `/blog/<slug>/` or `/bg/blog/<slug>/`.
2. Front matter:
   ```yaml
   title: 'How much paint do I need for a room?'   # up to 110 characters
   description: 'One or two sentences for Google and the post intro (50–170 characters).'
   date: 2026-11-04
   lang: en                     # en | bg
   tags: [paint, home-improvement]
   tool: paint-calculator       # optional: shows a "try the tool" card (see TOOLS in src/lib/site.ts)
   translation: bg/<slug>       # optional: the same post in the other language (adds hreflang)
   draft: true                  # optional: visible in `npm run dev:hub`, left out of the build
   ```
3. Write in Markdown. Use real numbers and worked examples, and link to the tools.
4. `npm run dev:hub` to preview at http://localhost:4321/blog/.

The homepage, blog listing, RSS feed and sitemap pick the post up automatically.
