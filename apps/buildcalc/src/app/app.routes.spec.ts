import { CALCULATORS } from './data/calculators';
import { GUIDES } from './data/guides';
import { routes } from './app.routes';
import { Route, UrlSegment } from '@angular/router';
import { readFileSync } from 'node:fs';

const matcher = (path: string) => routes.find((route) => route.path === path)!.canMatch![0] as
  (route: Route, segments: UrlSegment[]) => boolean;
const segs = (...parts: string[]) => parts.map((part) => new UrlSegment(part, {}));

describe('routes', () => {
  it('matches only known calculator and guide slugs so unknown URLs reach the 404 page', () => {
    expect(matcher(':slug')({}, segs(CALCULATORS[0].slug))).toBe(true);
    expect(matcher(':slug')({}, segs('unknown'))).toBe(false);
    expect(matcher('guides/:slug')({}, segs('guides', GUIDES[0].slug))).toBe(true);
    expect(matcher('guides/:slug')({}, segs('guides', 'unknown'))).toBe(false);
  });

  it('lists every calculator, guide and page in the sitemap exactly once, with trailing slashes', () => {
    const sitemap = readFileSync('public/sitemap.xml', 'utf8');
    const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
    expect(new Set(locs).size).toBe(locs.length);
    expect(locs).toContain('https://zyankov.eu/calculators/all-calculators/');
    for (const calculator of CALCULATORS) {
      expect(locs).toContain(`https://zyankov.eu/calculators/${calculator.slug}/`);
      expect(locs).not.toContain(`https://zyankov.eu/calculators/calculators/${calculator.slug}`);
    }
    for (const guide of GUIDES) expect(locs).toContain(`https://zyankov.eu/calculators/guides/${guide.slug}/`);
    // Site-wide pages live outside BuildCalc and must not be listed here.
    for (const moved of ['privacy', 'terms', 'disclaimer', 'contact']) {
      expect(locs).not.toContain(`https://zyankov.eu/calculators/${moved}/`);
    }
  });

  it('keeps meta descriptions within a snippet-friendly length', () => {
    for (const calculator of CALCULATORS) expect(calculator.description.length).toBeLessThanOrEqual(160);
    for (const guide of GUIDES) expect(guide.description.length).toBeLessThanOrEqual(160);
  });
});
