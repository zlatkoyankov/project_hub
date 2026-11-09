import { TrailingSlashUrlSerializer } from './trailing-slash-url-serializer';

describe('TrailingSlashUrlSerializer', () => {
  const serializer = new TrailingSlashUrlSerializer();
  const write = (url: string) => serializer.serialize(serializer.parse(url));

  it('adds a trailing slash to page links', () => {
    expect(write('/paint-calculator')).toBe('/paint-calculator/');
    expect(write('/guides/paint-calculator-guide')).toBe('/guides/paint-calculator-guide/');
  });

  it('keeps the home page, query strings and fragments working', () => {
    expect(write('/')).toBe('/');
    expect(write('/all-calculators?category=Painting')).toBe('/all-calculators/?category=Painting');
    expect(write('/about#contact')).toBe('/about/#contact');
  });

  it('reads a slashed address as the same route', () => {
    expect(serializer.parse('/paint-calculator/').root.children['primary'].segments.map((segment) => segment.path)).toEqual(['paint-calculator']);
  });
});
