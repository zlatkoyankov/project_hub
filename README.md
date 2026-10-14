# Zyankov.eu

The Zyankov.eu homepage is a one-page directory of independent web projects. Each tool lives
on its own URL, while the directory, FAQ, short blog notes, and about section stay on `/`.

## Add a project

1. Build the project as a static site. For a subdirectory such as `/my-tool/`, configure its
   build base path to `/my-tool/` so scripts, styles, and public assets resolve correctly.
2. Add one entry to [`projects.json`](./projects.json). Use a root-relative `href` ending in `/`,
   and include a short original description and image alt text.
3. Put the card artwork in `public/` and set its root-relative path in the registry entry.
4. Run `npm run build`. The project directory and `dist/sitemap.xml` are generated from the
   registry; no manual sitemap edit is needed.
5. Upload the contents of this project's `dist/` to the domain root, then upload the new
   project's `dist/` contents to its matching subdirectory (for example, `public_html/my-tool/`).

The standalone privacy page is maintained at `public/privacy/index.html` and is included in
the generated sitemap.

## Google Search and AdSense launch checklist

- Deploy the site on the canonical HTTPS domain and confirm every listed URL works.
- Verify domain ownership in Google Search Console and submit `/sitemap.xml`.
- Publish accurate, original, useful content for each project; there is no guaranteed approval
  based on a fixed page count.
- Review the privacy policy against the actual hosting setup, published contact details, and
  applicable legal requirements before launch.
- The AdSense publisher script is installed on the homepage, privacy page, and Letterwell.
  Keep ads disabled in AdSense until the consent-management platform is configured.
- After approval, publish the exact `ads.txt` record Google provides for the publisher account.
- Before serving ads where required, configure an eligible consent-management platform and
  keep the privacy policy accurate about the actual vendors, data use, and choices.

The build does not promise indexing, AdSense acceptance, or legal compliance. Those also depend
on live content, domain ownership, account status, hosting, and the actual advertising setup.
