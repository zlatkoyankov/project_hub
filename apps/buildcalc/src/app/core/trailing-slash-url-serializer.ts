import { DefaultUrlSerializer, UrlTree } from '@angular/router';

/**
 * Writes router links with a trailing slash: /calculators/paint-calculator/ instead of /calculators/paint-calculator.
 * The site is static and every page is a folder with an index.html, so the server answers a link without the slash
 * with a 301 to the slashed URL. Search Console listed those links as "Page with redirect", and the canonical and
 * sitemap URLs all end with a slash. Parsing drops the slash again, so /paint-calculator/ and /paint-calculator
 * are the same route.
 */
export class TrailingSlashUrlSerializer extends DefaultUrlSerializer {
  override parse(url: string): UrlTree {
    return super.parse(url.replace(/(.)\/+(?=$|[?#])/, '$1'));
  }

  override serialize(tree: UrlTree): string {
    const url = super.serialize(tree);
    const end = url.search(/[?#]/);
    const path = end === -1 ? url : url.slice(0, end);
    const rest = end === -1 ? '' : url.slice(end);
    return path.endsWith('/') ? url : `${path}/${rest}`;
  }
}
