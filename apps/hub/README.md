# Hub (zyankov.eu homepage)

The homepage, the privacy page and the terms page. Built with React and Vite; the homepage is
prerendered to static HTML (`scripts/prerender-home.mjs`) and `scripts/generate-sitemap.mjs`
writes `dist/sitemap.xml` from `projects.json`.

Commands, deployment and the steps for adding a project are in the root `README.md`.

- `projects.json` — the project registry: homepage cards and sitemap entries.
- `public/privacy/`, `public/terms/` — the standalone legal pages.
