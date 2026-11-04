# zyankov.eu

One repository for everything published on [zyankov.eu](https://zyankov.eu): the homepage, every
tool, and the shared packages they use.

| Path | What it is | Served at |
| --- | --- | --- |
| `apps/hub` | Homepage, blog, about and legal pages (Astro) | `/`, `/bg/`, `/blog/` |
| `apps/letterwell` | Letterwell word finder (React + Vite) | `/letterwell/` |
| `apps/buildcalc` | BuildCalc calculators and guides (Angular, prerendered) | `/calculators/` |
| `packages/design-system` | Shared tokens, fonts, theme and page shell (top bar + footer) | — |
| `scripts/assemble-site.mjs` | Combines the app builds into one deployable `dist/` | — |

Letterwell and BuildCalc were imported with `git subtree`, so their full commit history is part of
this repository. Their old repositories are kept only as an archive.

## Setup

Node.js 20 or newer. Install once from the repository root (npm workspaces put every app's
dependencies in the root `node_modules`):

```bash
npm install
```

## Everyday commands

| Command | Does |
| --- | --- |
| `npm run dev:hub` | Homepage and blog dev server (http://localhost:4321/) |
| `npm run dev:letterwell` | Letterwell dev server (opens under `/letterwell/`) |
| `npm run dev:buildcalc` | BuildCalc dev server |
| `npm run build` | Builds all apps and assembles the site in `dist/` |
| `npm run preview` | Serves `dist/` at http://localhost:4173 — use URLs with a trailing slash |
| `npm test` | BuildCalc unit tests |
| `npm run lint` | oxlint for the hub and Letterwell |
| `npm run lint:colors` | Fails on colour literals outside `packages/design-system/tokens.css` |
| `npm run preview:design` | Design-system reference page at http://localhost:4174 |

Run a script for one app with `-w`, for example `npm run build -w letterwell`.

## Deploy

1. `npm run build`
2. `npm run deploy` shows what would be uploaded and which files on the server are no longer in the build.
3. `npm run deploy -- --yes` uploads `dist/` to `public_html` over FTPS and deletes those files.

The FTP login is read from `.env.deploy` (copy `.env.deploy.example`; the file is in `.gitignore`).
Dot files and folders on the server (`.well-known`, cPanel's `.htaccess` and `.user.ini` in subfolders),
`php.ini`, `cgi-bin` and `error_log` are never deleted. Uploading `dist/` by hand still works.

The deploy checklist in the improvement plan applies before every upload.

## Add a project

1. Create `apps/<name>` with its own `package.json` (`"name": "<name>"`) and a `build` script.
2. Build it for its sub-path (Vite: `base: '/<path>/'`, Angular: `--base-href /<path>/`).
3. Add it to `parts` in `scripts/assemble-site.mjs` and a `build:<name>` script in the root
   `package.json`, then include it in `build`.
4. Use the design system: depend on `@zyankov/design-system`, load its CSS and add the shell
   slots (see `packages/design-system/README.md`).
5. Add an entry to `packages/design-system/projects.json` (`slug`, `name`, `tagline`,
   root-relative `href` ending in `/`, description, card image in `apps/hub/public/`). The top
   bar, footer, homepage card and sitemap entry come from it.

## Conventions

- One branch per phase or feature (`phase-0-monorepo`, `phase-1-design-system`, …), merged into
  `main` when it is done and deployed.
- Commit messages start with the part they touch: `hub:`, `letterwell:`, `buildcalc:`,
  `design-system:`, `blog:`, `repo:`.

## Google Search and AdSense launch checklist

- Deploy the site on the canonical HTTPS domain and confirm every listed URL works.
- Verify domain ownership in Google Search Console and submit `/sitemap.xml`.
- Publish accurate, original, useful content for each project; there is no guaranteed approval
  based on a fixed page count.
- Review the privacy policy against the actual hosting setup, published contact details, and
  applicable legal requirements before launch.
- The AdSense publisher script is loaded on the homepage, privacy page, and Letterwell. A
  publisher script request can send technical information to Google even when no ad is visible.
  Confirm the account's ad settings and configure consent controls before serving ads where
  consent is required.
- After approval, publish the exact `ads.txt` record Google provides for the publisher account.
- Before serving ads where required, configure an eligible consent-management platform and
  keep the privacy policy accurate about the actual vendors, data use, and choices.

The build does not promise indexing, AdSense acceptance, or legal compliance. Those also depend
on live content, domain ownership, account status, hosting, and the actual advertising setup.
