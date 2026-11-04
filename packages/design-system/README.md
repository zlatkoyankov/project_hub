# @zyankov/design-system

The shared look of every zyankov.eu app: colour and type tokens, self-hosted fonts, the theme
switch, and the page shell (top bar + footer). Apps depend on it as a workspace package
(`"@zyankov/design-system": "*"`); nothing is copied between apps.

## Files

| File | Purpose |
| --- | --- |
| `tokens.css` | All colours (light + dark), fonts, type scale, radii, spacing, shadows. **The only file with colour values.** |
| `fonts.css` + `fonts/` | Onest (text) and Literata (headings), self-hosted woff2 (SIL OFL). Latin, Latin Extended, Cyrillic. |
| `shell.css` | Styles for the skip link, top bar, footer and `.zy-ad-slot`. All classes start with `zy-`. |
| `shell/render.mjs` | Renders the head snippet, top bar and footer as HTML. |
| `shell/inject.mjs` | Puts the shell into HTML slots. Library function + CLI (`zy-inject`). |
| `shell/shell-inline.js` | Inlined into `<head>`: theme before first paint, theme toggle, skip link, Privacy settings button, cross-project click event. |
| `site.config.json` | AdSense publisher ID and the analytics provider. Read at build time by the shell. |
| `analytics.js` | `track(event, data)` for anonymous app events (Umami or Plausible, no-op otherwise). |
| `theme.js` | `getTheme`, `setTheme`, `toggleTheme`, `subscribeTheme` for app code (SSR-safe). |
| `vite.mjs` | Vite plugin `zyShell({ project, main })` that injects the shell in dev and build. |
| `projects.json` | The project registry: bar and footer links, homepage cards, sitemap. |
| `base.css` | Optional generic frame (container, card, button). Not loaded by any app yet. |
| `preview.html` | Living reference of tokens and components: `npm run preview:design`. |

## Using it in an app

1. Add `"@zyankov/design-system": "*"` to the app's dependencies and run `npm install` at the root.
2. Load the styles before the app's own CSS, in this order: `tokens.css`, `fonts.css`, `shell.css`.
   - Vite/React: `import '@zyankov/design-system/tokens.css'` (etc.) in the entry file.
   - Angular: list `@zyankov/design-system/tokens.css` (etc.) in `styles` in `angular.json`.
3. Put the three slots in `index.html`:
   ```html
   <head> … <template data-zy-slot="head"></template> … </head>
   <body>
     <template data-zy-slot="bar"></template>
     <div id="root"></div>   <!-- or <app-root> -->
     <template data-zy-slot="footer"></template>
   </body>
   ```
4. Fill them:
   - Vite: `plugins: [zyShell({ project: '<slug>', main: '<id of <main>>' })]` from `@zyankov/design-system/vite`.
   - Anything else: run `zy-inject <build dir> --project <slug> --main <id>` after the build.
5. Do not build a theme toggle or store the theme in the app. The bar has the toggle; read the
   theme with `getTheme()` / `subscribeTheme()` from `@zyankov/design-system/theme` if needed.

`<html data-project="<slug>">` is set by the injector and switches `--project-accent`.

## Rules

- No colour literals (`#fff`, `rgb()`, `hsl()`) outside `tokens.css`. `npm run lint:colors` enforces it.
  A missing colour gets a new token in **both** themes.
- For a translucent colour use `color-mix(in srgb, var(--token) 20%, transparent)`.
- Themes are `:root` (light) and `:root[data-theme='dark']`. Nothing else.
- Use `--on-accent` for text on `--accent`; never assume white.
- Body text at least `--text-base` (16px); nothing below `--text-xs` (12px).
- `--text-subtle` is for placeholders and decoration only; it is below AA for body text.
- Keep text contrast at WCAG AA (4.5:1) in both themes.

## Ads, consent and analytics

- The head slot loads AdSense on every page (`site.config.json` → `adsense.client`) except
  privacy and terms pages, which Google asks to keep free of ad tags.
- Consent in the EEA, UK and Switzerland comes from Google's own certified message, set up in
  AdSense under **Privacy & messaging → European regulations**. The footer button
  "Privacy settings" (`data-zy-consent`) reopens it.
- Pages under privacy/, terms/ and disclaimer/ never load ad tags.
- Analytics: set `analytics.websiteId` (Umami; `analytics.domains` limits tracking to the live site, so local builds are not counted) or `provider: "plausible"` + `domain` and rebuild.
  With no ID nothing is loaded, and the privacy policy and FAQ say so automatically
  (`<template data-zy-slot="privacy-analytics">`).
- Events in use: `calculate` (BuildCalc: calculator, units), `word_search` (Letterwell: language,
  letter count, result count), `outbound_project` (bar/footer clicks between projects).
  Never send what the user typed.

## Languages

The shell follows `<html lang>`: `bg` pages get Bulgarian bar and footer text. When a page lists
the other language with `<link rel="alternate" hreflang="…">`, the bar shows an EN / БГ switch
to that URL. Apps that prerender several language versions build with `zyShell({ devOnly: true })`
and run `zy-inject` after the prerender (see Letterwell). Project taglines in Bulgarian are
`tagline_bg` in `projects.json`.

## Theme

One key for the whole site: `localStorage['zyankov-theme']` (`light` | `dark`). Without it the
system preference applies. Old `letterwell-theme` / `buildcalc-theme` values are migrated once.
Changes fire `zyankov-theme-change` on `window`.

## Known gaps

- `ng serve` does not run the injector, so BuildCalc in dev has no bar, footer or theme script.
