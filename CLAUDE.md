# CLAUDE.md

Working notes for Claude on zyankov.eu. The README covers setup and commands; this file covers
what matters when changing the site. `apps/buildcalc/CLAUDE.md` and `apps/letterwell/CLAUDE.md`
add the details for those apps. `.claude/settings.json` allows the build, lint and test commands,
blocks `.env.deploy` and the deploy script, and runs the colour lint after CSS edits. Talk to Zlatko in Bulgarian; code, comments and commit
messages stay in English.

## What the site is

zyankov.eu is a hub of small, free browser tools for the household, building work and word games,
in English and Bulgarian. The goal is a useful site that earns from AdSense. AdSense was rejected
once for "low value content", so content quality and trust come before promotion. Reapply around
mid-December 2026, after Search Console shows the new pages indexed.

| Part | Stack | Served at |
| --- | --- | --- |
| `apps/hub` | Astro: homepage, BG calculators, energy calculators, blog, about/legal | `/`, `/bg/…`, `/blog/`, `/bg/blog/` |
| `apps/buildcalc` | Angular SSR, prerendered: EN building calculators and guides | `/calculators/` |
| `apps/letterwell` | React + Vite: word finder, Wordle/crossword/Spelling Bee solvers, daily word game | `/letterwell/` |
| `packages/design-system` | Tokens, fonts, theme, shared shell (top bar, footer), analytics, boards | — |

## The rule for numbers (non-negotiable)

Every calculator, rate or figure must show where it comes from. Nobody trusts a result if the
formula and the data are not visible and correct.

- Show the formula on the page.
- Link a source for every coefficient: a standard, a manufacturer's datasheet, an official body
  (NAP, BNB, ECB, EUR-Lex) or at least a reputable article.
- Label our own estimates or middle values as such.
- Show a "checked" date (`checked` in the hub configs, `CHECKED` in `EnergyCalculator.astro`,
  `SOURCES_CHECKED_ISO` in BuildCalc). It also becomes `dateModified` in the page's JSON-LD, next to
  the author (`AUTHOR` in `lib/site.ts` / `seo.service.ts`), so update it whenever you re-check.
- Keep a short source comment next to each constant in code (`apps/hub/src/lib/materials.ts`,
  `apps/buildcalc/src/app/utils/calculations.ts`).
- No number without a source. If a source cannot be found, say so and ask.
- Blog articles that use numbers end with a "Източници" / "Sources" section and must agree with
  the calculator they link to.

## Where things live

- **Tool registry:** `apps/hub/src/lib/tools.ts` holds ids, hrefs per language, icons, groups
  (including `everyday`) and related tools. `only: 'bg'` marks Bulgarian-only tools. Project
  cards come from `packages/design-system/projects.json`.
- **BG material and everyday calculators:** one component,
  `apps/hub/src/components/MaterialCalculatorBg.astro`, driven by `CONFIGS[kind]`.
  - Per page: `sources`, `checked`, `kicker`, `crumb`, `resultTitle`, `caveat`.
  - Fields: `type: 'date'`, `signed`, `show: 'select:value'`.
  - The script branches per `kind` and ends with `render(big, rows)`.
  - Share link and shopping-list copy buttons; URL parameters restore the form.
  - Rates live in `lib/materials.ts`, everyday maths in `lib/everyday.ts`:
    - `BGN_PER_EUR = 1.95583`;
    - VAT rates;
    - `loanPayment` (check: 5000 at 5.5% for 10 months = 512.69).
- **Energy calculators:** `components/EnergyCalculator.astro` (EN `/energy-cost-calculator/`,
  BG `/bg/razhod-na-tok/`), plus the heating, firewood and air-conditioner pages.
- **New BG page checklist:**
  - the page under `apps/hub/src/pages/bg/<slug>/index.astro`;
  - an entry in `tools.ts`;
  - an OG image entry in `pages/og/[key].png.ts` (rendering is in `lib/og.ts`);
  - an entry in `pages/sitemap-site.xml.ts`;
  - related tools;
  - sources and a checked date.
- **Blog:** `apps/hub/src/content/blog/{en,bg}/*.md`. Frontmatter: `title`, `description`,
  `date`, optional `updated`, `lang`, `tags`, `tool` (the linked calculator id). EN and BG
  translations are paired for hreflang (see `getTranslation` in `lib/site.ts`). A new `tool` value also needs
  an entry in `TOOLS` (`lib/site.ts`), `POST_TOOL_IDS` and, for its category, `postCategory` (`lib/tools.ts`).
  Categories: words, home, everyday (percent, VAT, euro, loan, dates) and general.
- **BuildCalc:**
  - `data/calculators.ts`: `CalculatorInfo` with `sources`;
  - `pages/calculator.*`: the calculator page; `shareLink()` keeps changed values plus unit
    keys, and `afterNextRender` restores query parameters and recalculates;
  - `utils/calculations.ts`: the rates.

  Tests: `npm test` (52 specs).
- **Letterwell daily game:**
  - `src/daily.ts`: puzzles and `hintsFor()`;
  - `src/DailyWord.tsx`: the UI, the hints panel (saved per puzzle in `${storage}-hints-v1`,
    `#hints` opens it) and the FAQ;
  - BG at `/letterwell/bg/duma-na-denya/`, EN at `/letterwell/daily/`, with a different name
    and look so it is not a Wordle/NYT copy. Short links `/duma` and `/daily` are in `.htaccess`.
  - Bulgarian word meanings must be Bulgarian (or a link to a Bulgarian dictionary), never
    English glosses.
- **Shell:** `packages/design-system/shell/shell-inline.js`.
  - It records recently opened tools in `localStorage` `zyankov-recent` (12 paths).
  - It skips the homepage, blog, `vgradi`/embed pages and iframes.
  - Homepage favourites are kept in `zyankov-favourites`.
  - The privacy page mentions both.
- **Analytics:** Umami (`packages/design-system/site.config.json`, `analytics.js` `track()`), with
  `data-exclude-search="true"`. Events cover favourites, sharing and hints.
- **Colours:** only in `packages/design-system/tokens.css`. `npm run lint:colors` enforces it.

## Checks before a PR

```bash
timeout 170 npm run build:hub        # likewise build:letterwell, build:buildcalc
node scripts/assemble-site.mjs       # combine into dist/
npm run lint && npm run lint:colors && npm test
(cd dist && python3 -m http.server 8765)   # then click through, use trailing-slash URLs
```

GitHub Actions (`.github/workflows/build.yml`) runs lint, lint:colors, the tests and the full
build on every PR and on main; a PR should be green before Zlatko merges it.

For UI changes, check the page in a real browser (Playwright screenshots work well), in light and
dark mode and on a narrow screen.

## Git and PRs

- Use one branch and one PR per feature, and list the merge order when PRs depend on each
  other. Zlatko merges, builds and deploys himself.
- Commit messages start with the part they touch: `hub:`, `letterwell:`, `buildcalc:`,
  `design-system:`, `blog:`, `repo:`.

## Hosting and deploy

- **Hosting:** Bulinfo shared cPanel hosting, document root `public_html`.
- **Deploy:** `npm run build`, then `npm run deploy` for a dry run, then `npm run deploy -- --yes`
  (FTPS; login in `.env.deploy`, which is never committed). Uploading `dist/` by hand also
  works.
- **IndexNow:** `scripts/indexnow.mjs` sends the changed sitemap pages to Bing and the other
  IndexNow engines; `deploy -- --yes` runs it, after a manual upload run `npm run indexnow`. The key
  file `apps/hub/public/<key>.txt` must stay in sync with `KEY` in the script.
- **`.htaccess`** comes from the build. It covers:
  - the HTTPS and bare-domain 301;
  - the old BuildCalc info pages redirected to site-wide pages;
  - the `/duma` and `/daily` short links;
  - caching (hashed assets for a year, HTML not cached).
- **DNS:** the nameservers are ns7/ns8.bulinfo.org, so DNS records are changed there.
- **Domain renewal:** the domain expires on 2027-02-13 and does not renew automatically. Renew by
  the end of January 2027.
- **Bulinfo connector:** any change made through it is previewed first and needs Zlatko's
  explicit yes. Never ask for passwords in chat.

## SEO and AdSense

- **Sitemaps:**
  - the index at `/sitemap.xml` points to `/sitemap-site.xml` (hub),
    `/letterwell/sitemap.xml` and `/calculators/sitemap.xml`;
  - a new page must appear in its sitemap;
  - EN/BG pairs carry hreflang alternates.
- **Search Console indexing:** about 10 manual indexing requests per day. A checklist page of all
  URLs exists as a Claude artifact.
- **About and trust pages:**
  - `/about/` and `/bg/za-saita/` explain where the numbers come from and how corrections work;
  - contact is at `/bg/za-saita/#kontakt` and `/about/#contact`.
- **AdSense:**
  - publisher `ca-pub-4282820287798834`;
  - before reapplying, check for thin or empty pages and keep the privacy page accurate.

## Backlog (as of 9 November 2026)

1. EN versions of the everyday-sums articles are not planned (the tools are BG-only).
2. An embed version of the BG energy calculator (the EN one has one).
3. Check the Umami events for favourites, sharing and hints after a few days of traffic.
4. Weekly Search Console check; AdSense readiness review before mid-December.
5. Later: a separate SEO page for daily-word hints, short video clips, more everyday tools.
