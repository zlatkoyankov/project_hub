# Letterwell

Letterwell is a browser-based word finder for English and Bulgarian. It is built with React,
TypeScript, and Vite and is published at `https://zyankov.eu/letterwell/`.

The footer links to the shared Zyankov.eu About, Privacy, and Terms pages. Letter searches are
processed in the browser using word lists downloaded from this site. The site-wide theme and the
language preference are saved in local storage; recent searches stay in page memory and are cleared when
the page is reloaded or closed.

## Development

```bash
npm run dev
npm run build
npm run lint
```

## Languages and dictionaries

The selected language controls the interface and the word list used for searches. The page
title, description, social metadata, and structured data follow the selected language. The
sitemap is available at `/letterwell/sitemap.xml`; both languages currently share the same
canonical URL.

Bulgarian Scrabble scores use Bulgarian letter values. Words With Friends scoring is available
for English words only.

The Bulgarian word list in `public/bulgarian-words.txt` is derived from
[bayganyu/bulgarian-dictionary](https://github.com/bayganyu/bulgarian-dictionary), licensed
under MIT. Its license is included in `public/bulgarian-words-license.txt`.

To add another language:

1. Add a word list under `public/`.
2. Add the language code and letter pool in `src/App.tsx`.
3. Add the translated interface strings and dictionary-loading path.
