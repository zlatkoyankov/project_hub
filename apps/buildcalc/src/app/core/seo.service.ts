import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { CALCULATORS, SOURCES_CHECKED_ISO } from '../data/calculators';
import { GUIDES } from '../data/guides';

// Public origin plus the sub-path the app is deployed under.
export const SITE_BASE_URL: string = 'https://zyankov.eu/calculators';
const SITE_NAME = 'BuildCalc';
// The person behind the site, for structured data (author and publisher).
const AUTHOR = { '@type': 'Person', name: 'Zlatko Yankov', url: 'https://zyankov.eu/about/' };
const JSON_LD_ID = 'buildcalc-json-ld';
const SECTION_NAMES: Record<string, string> = { 'all-calculators': 'Calculators', guides: 'Material guides' };

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);

  updateFromRoute(root: ActivatedRouteSnapshot): void {
    let route = root;
    while (route.firstChild) route = route.firstChild;
    const title = route.title ?? 'BuildCalc | Plan smarter. Build with confidence.';
    const description = route.data['description'] as string | undefined;
    const path = '/' + route.pathFromRoot.flatMap((r) => r.url.map((segment) => segment.path)).join('/');
    this.document.title = title;
    if (description) this.setMeta('description', description);
    this.setMeta('og:title', title, 'property');
    if (description) this.setMeta('og:description', description, 'property');
    this.setMeta('og:type', 'website', 'property');
    this.setMeta('og:site_name', SITE_NAME, 'property');
    this.setMeta('twitter:card', 'summary_large_image');
    this.setMeta('robots', route.data['noindex'] ? 'noindex, nofollow' : 'index, follow');

    const image = this.absolute(`/images/${this.imageFor(path)}.webp`);
    if (image) this.setMeta('og:image', image, 'property');

    const canonical = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      ?? this.document.createElement('link');
    canonical.rel = 'canonical';
    const canonicalUrl = this.pageUrl(path);
    if (canonicalUrl && !route.data['noindex']) {
      canonical.href = canonicalUrl;
      if (!canonical.isConnected) this.document.head.appendChild(canonical);
    } else if (canonical.isConnected) {
      canonical.remove();
    }
    if (canonicalUrl) this.setMeta('og:url', canonicalUrl, 'property');
    this.setAlternates(route.data['noindex'] ? undefined : CALCULATORS.find((item) => path === `/${item.slug}`), canonicalUrl);

    this.setJsonLd(route.data['noindex'] ? [] : this.structuredData(path, title, description));
  }

  // Pages are prerendered as <path>/index.html, and the static host redirects /path to /path/,
  // so canonical and structured-data URLs end with a slash.
  private pageUrl(path: string): string {
    return this.absolute(path.endsWith('/') ? path : `${path}/`);
  }

  private absolute(path: string): string {
    return SITE_BASE_URL ? `${SITE_BASE_URL.replace(/\/$/, '')}${path}` : '';
  }

  private imageFor(path: string): string {
    return CALCULATORS.find((item) => path === `/${item.slug}`)?.kind
      ?? GUIDES.find((item) => path === `/guides/${item.slug}`)?.kind
      ?? 'hero';
  }

  private structuredData(path: string, title: string, description?: string): object[] {
    const data: object[] = [];
    const url = this.pageUrl(path);
    if (path === '/') {
      data.push({ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, ...(url && { url }) });
    }
    const calculator = CALCULATORS.find((item) => path === `/${item.slug}`);
    if (calculator) {
      data.push({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: calculator.title,
        description: description ?? calculator.description,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        inLanguage: 'en',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        author: AUTHOR,
        publisher: AUTHOR,
        // When the formula, rates and sources were last checked (shown on the page).
        dateModified: SOURCES_CHECKED_ISO,
        ...(url && { url }),
      });
      data.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: calculator.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      });
    }
    const guide = GUIDES.find((item) => path === `/guides/${item.slug}`);
    if (guide) {
      data.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: guide.title,
        description: description ?? guide.description,
        author: AUTHOR,
        publisher: AUTHOR,
        ...(url && { mainEntityOfPage: url }),
      });
    }
    if (path !== '/' && url) {
      const crumbs = path.split('/').filter(Boolean);
      data.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: this.pageUrl('/') },
          ...crumbs.map((_, index) => ({
            '@type': 'ListItem',
            position: index + 2,
            name: index === crumbs.length - 1 ? title.replace(` | ${SITE_NAME}`, '') : SECTION_NAMES[crumbs[index]] ?? crumbs[index],
            item: this.pageUrl(`/${crumbs.slice(0, index + 1).join('/')}`),
          })),
        ],
      });
    }
    return data;
  }

  // hreflang links between an English calculator and its Bulgarian version on the hub.
  private setAlternates(calculator: (typeof CALCULATORS)[number] | undefined, url: string): void {
    this.document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((link) => link.remove());
    if (!calculator?.bg || !url) return;
    const bg = new URL(calculator.bg, SITE_BASE_URL).href;
    for (const [lang, href] of [['en', url], ['bg', bg], ['x-default', url]]) {
      const link = this.document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      link.href = href;
      this.document.head.appendChild(link);
    }
  }

  private setJsonLd(data: object[]): void {
    this.document.getElementById(JSON_LD_ID)?.remove();
    if (!data.length) return;
    const script = this.document.createElement('script');
    script.id = JSON_LD_ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data.length === 1 ? data[0] : data);
    this.document.head.appendChild(script);
  }

  private setMeta(name: string, content: string, attribute = 'name'): void {
    const selector = `meta[${attribute}="${name}"]`;
    const element = this.document.querySelector<HTMLMetaElement>(selector) ?? this.document.createElement('meta');
    element.setAttribute(attribute, name);
    element.content = content;
    if (!element.isConnected) this.document.head.appendChild(element);
  }
}
