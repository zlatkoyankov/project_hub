import { describe, expect, it } from 'vitest';
import { ARTICLES, CALCULATORS, RELATED_SLUGS } from './calculators';

describe('related calculators and articles', () => {
  const slugs = new Set(CALCULATORS.map((item) => item.slug));

  it('lists three existing, different calculators for every calculator', () => {
    for (const calculator of CALCULATORS) {
      const related = RELATED_SLUGS[calculator.slug];
      expect(related, calculator.slug).toHaveLength(3);
      expect(new Set(related).size).toBe(3);
      for (const slug of related) {
        expect(slugs.has(slug), slug).toBe(true);
        expect(slug).not.toBe(calculator.slug);
      }
    }
  });

  it('links every calculator to a blog article', () => {
    for (const calculator of CALCULATORS) expect(ARTICLES[calculator.slug]?.href, calculator.slug).toMatch(/^\/blog\/[a-z0-9-]+\/$/);
  });
});
