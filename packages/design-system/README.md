# @zyankov/design-system

The shared look of every zyankov.eu app: colour and type tokens, self-hosted fonts, the theme
switch, and the page shell (top bar + footer). Apps depend on it as a workspace package
(`"@zyankov/design-system": "*"`); nothing is copied between apps.

## Files

| File | Purpose |
| --- | --- |
| `tokens.css` | All colours (light + dark), fonts, type scale, radii, spacing, shadows. **The only file with colour values.** |
| `fonts.css` + `fonts/` | DM Sans and Fraunces, self-hosted woff2 (SIL OFL). Latin + Latin Extended only. |
| `shell.css` | Styles for the skip link, top bar, footer and `.zy-ad-slot`. All classes start with `zy-`. |
| `shell/render.mjs` | Renders the head snippet, top bar and footer as HTML. |
| `shell/inject.mjs` | Puts the shell into HTML slots. Library function + CLI (`zy-inject`). |
| `shell/theme-inline.js` | Inlined into `<head>`: applies the theme before first paint, wires the toggle. |
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

## Theme

One key for the whole site: `localStorage['zyankov-theme']` (`light` | `dark`). Without it the
system preference applies. Old `letterwell-theme` / `buildcalc-theme` values are migrated once.
Changes fire `zyankov-theme-change` on `window`.

## Known gaps

- DM Sans and Fraunces have no Cyrillic. Bulgarian text renders in the next font in the stack.
- `ng serve` does not run the injector, so BuildCalc in dev has no bar, footer or theme script.
