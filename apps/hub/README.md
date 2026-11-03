# Zyankov.eu

The Zyankov.eu homepage is a directory of independent web projects. Each tool lives
on its own URL, while the project directory, FAQ, blog note, and About section stay on `/`.

Production builds prerender the homepage, Letterwell, and every BuildCalc route into static
HTML. The React pages hydrate in the browser, so headings and useful content are available
before JavaScript runs.

## Add a project

1. Build the project for its subdirectory path so scripts, styles, and public assets resolve
   correctly. BuildCalc is prepared automatically from `../calculators` when this site's
   `dev` or `build` command runs.
2. Add one entry to [`projects.json`](./projects.json). Use a root-relative `href` ending in `/`,
   and include a short original description and image alt text.
3. Put the card artwork in `public/` and set its root-relative path in the registry entry.
4. Run `npm run build`. The project directory and `dist/sitemap.xml` are generated from the
   registry; no manual sitemap edit is needed.
5. Upload the contents of this project's `dist/` to the domain root. BuildCalc's browser build
   is copied into `dist/calculators/` automatically.

The standalone privacy and terms pages are maintained in `public/privacy/` and `public/terms/`;
both are included in the generated sitemap.

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
