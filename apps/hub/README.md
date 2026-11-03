# Hub (zyankov.eu homepage)

The homepage, the privacy page and the terms page. Built with React and Vite; the homepage is
prerendered to static HTML (`scripts/prerender-home.mjs`) and `scripts/generate-sitemap.mjs`
writes `dist/sitemap.xml` from `projects.json`.

Commands, deployment and the steps for adding a project are in the root `README.md`.

- Project cards come from `packages/design-system/projects.json`.
- `privacy/index.html`, `terms/index.html` — the legal pages, built as extra Vite pages with `src/legal.css`.
