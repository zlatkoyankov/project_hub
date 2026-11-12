# BuildCalc (apps/buildcalc)

The English building calculators at `/calculators/`. Angular with standalone components and
signals, SSR builder, every route prerendered to static HTML for the shared hosting. The root
CLAUDE.md rules apply, above all the rule for numbers.

## Layout

- `src/app/data/calculators.ts` holds the calculators:
  - `CALCULATORS` is a list of `CalculatorInfo`:
    - slug, titles, category, intro, `kind`, keywords;
    - `example` and `formula`, both shown on the page;
    - `faqs`;
    - `bg`: the Bulgarian twin's path, used for hreflang;
    - `sources`.
  - `SOURCES_CHECKED`: one date for all sources. Update it when you re-check them.
  - `RELATED_SLUGS` and `ARTICLES` link calculators to each other and to hub blog posts.
- `src/app/utils/calculations.ts` holds the maths and rates, with a source comment next to each
  constant. `calculations.spec.ts` must cover every formula with a worked example.
- `src/app/pages/calculator.*`:
  - one page component for every calculator, branching on `kind`;
  - `shareLink()` keeps changed values plus unit keys;
  - `afterNextRender` restores query parameters and recalculates;
  - the sources list is `.calc-sources`.
- `src/app/data/guides.ts` has the `/calculators/guides/<slug>/` guides; `pages/content.*`
  renders guides and info pages. Each guide has sections, a worked `example`, `mistakes` and
  `sources`; `guides.spec.ts` recomputes every number in the example with `calculations.ts`.
- `src/app/core/seo.service.ts` sets titles, meta, canonical and JSON-LD per route.
  `unit-preference.service.ts` stores US/metric in `localStorage` `buildcalc-units`.
- `src/app/app.routes.server.ts` lists what gets prerendered. It covers the home and directory
  pages, `:slug`, `embed/:slug`, `guides/:slug` and about. A new route that is not listed here
  will not exist on the static site.

## Adding a calculator

1. Write the maths and constants in `utils/calculations.ts`, each with a source comment, and add
   specs with a worked example.
2. Add a `CalculatorInfo` entry with formula, example, FAQs and `sources`. Add the `bg` path if a
   Bulgarian twin exists, and add the reverse alternate in the hub sitemap.
3. Add a `kind` branch in `pages/calculator.*`.
4. Update `public/sitemap.xml` (served as `/calculators/sitemap.xml`) and related slugs.
5. Run `npm test` (from the root) and `timeout 170 npm run build:buildcalc`, then open the
   prerendered page in `dist/` and check that the worked example gives the expected result.

## Gotchas

- Inputs have ids like `#calc-length`, which Playwright tests use.
- The production build uses `--base-href /calculators/`, and URLs end with `/`.
- The old info pages (`/calculators/privacy/` and others) 301 to the site-wide pages through the
  root `.htaccess`. Do not recreate them.
- Colours only through tokens from the design system. The colour lint also checks `.scss` files.
