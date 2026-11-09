# Letterwell (apps/letterwell)

Word tools and the daily word game at `/letterwell/`, in English and Bulgarian. React +
TypeScript + Vite, prerendered per page and language. The root CLAUDE.md applies.

## Pages and routing

There is one React app. `src/seo.ts` works out the language from the path (anything under
`/letterwell/bg/` is Bulgarian) and the page from the last segment:

| Page | EN | BG |
| --- | --- | --- |
| Word finder | `/letterwell/` | `/letterwell/bg/` |
| Wordle helper | `/letterwell/wordle-solver/` | `/letterwell/bg/wordle/` |
| Crossword helper | `/letterwell/crossword-solver/` | `/letterwell/bg/krastoslovitsi/` |
| Spelling Bee helper | `/letterwell/spelling-bee-solver/` | `/letterwell/bg/spelling-bee/` |
| Daily word game | `/letterwell/daily/` | `/letterwell/bg/duma-na-denya/` |

`scripts/prerender.mjs` writes one HTML file per page and language listed in `seo.ts` with its own title, meta,
canonical, hreflang and OG image key. The design-system shell is injected afterwards. A new page
needs:
- entries in `src/seo.ts`: `pages`, `pagePath`, `pageFromPath`, `pageMeta` and `pageOgKey`
  (`scripts/prerender.mjs` reads them);
- a line in `public/sitemap.xml`;
- an OG image on the hub (`/og/<key>.png`).

## Daily word game

- **Puzzles** are in `src/daily.ts`:
  - `DAILY_WORDS_BG` has 559 words and `DAILY_WORDS_EN` has 359;
  - `EPOCH` is 9 November 2026 (puzzle 1);
  - the day changes at midnight Sofia time (`sofiaToday`);
  - the list repeats after its length, so append words only at the end; changing the order
    changes past and future answers.
- **Hints:** `hintsFor()` builds them; they are shown in `src/DailyWord.tsx`.
- **Saved state:** game state and stats in `localStorage` `zy-daily` (BG) and `zy-daily-en`
  (EN); hints per puzzle in `${storage}-hints-v1`; `#hints` opens the hints panel.
- **Share text** comes from `shareText()`, with the short links `zyankov.eu/duma` and
  `zyankov.eu/daily`.
- **Branding:** the English and Bulgarian games use their own names and look, not Wordle's.
  Do not copy NYT branding or wording.

## Word lists and meanings

- The word lists in `public/` (`*-words.txt`, `wordle-*.txt`) have licence files next to them.
  Keep them when changing a list.
- Meanings are built by `scripts/build-meanings.mjs` from Wiktionary (CC BY-SA) into
  `public/meanings/<lang>/`. They are loaded only on demand (the ⓘ button, greyed out without
  data).
- Bulgarian words get Bulgarian meanings or a link to a Bulgarian dictionary, never English
  glosses.

## Checks

From the root, run `npm run lint` (oxlint) and `timeout 170 npm run build:letterwell`, then
`node scripts/assemble-site.mjs`. Open the page in `dist/`. In Playwright, close the daily help
dialog (`.daily-close`) before clicking the board.
