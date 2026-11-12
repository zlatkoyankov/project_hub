import { describe, expect, it } from 'vitest';
import { CALCULATORS } from './calculators';
import { GUIDES } from './guides';
import { calculateArea, calculateConcrete, calculateGravel, calculateMulch, calculatePaint, calculateTile } from '../utils/calculations';

const guide = (slug: string) => {
  const found = GUIDES.find((g) => g.slug === slug);
  if (!found) throw new Error(`No guide ${slug}`);
  return [found.example.intro, ...found.example.steps, found.example.result].join(' ');
};
const row = (rows: { label: string; value: number }[], label: string) => {
  const found = rows.find((r) => r.label === label);
  if (!found) throw new Error(`No row ${label}`);
  return found.value;
};
const fmt = (value: number, digits = 2) => value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });

describe('GUIDES', () => {
  it('has unique slugs and links to existing calculators', () => {
    expect(new Set(GUIDES.map((g) => g.slug)).size).toBe(GUIDES.length);
    for (const item of GUIDES) {
      expect(CALCULATORS.some((c) => c.slug === item.calculatorSlug)).toBe(true);
      expect(item.sections.length).toBeGreaterThan(0);
      expect(item.example.steps.length).toBeGreaterThan(1);
      expect(item.mistakes.length).toBeGreaterThan(2);
      expect(item.sources.length).toBeGreaterThan(0);
    }
  });

  it('gravel example matches calculateGravel', () => {
    const text = guide('gravel-calculator-guide');
    const base = { length: 30, width: 4, density: 2700, waste: 10 };
    const { rows } = calculateGravel({ ...base, depth: 3 });
    expect(text).toContain(`${fmt(row(rows, 'Volume before waste'))} cu yd`);
    expect(text).toContain(`${fmt(row(rows, 'Volume with waste'))} cu yd`);
    expect(text).toContain(`${fmt(row(rows, 'Volume with waste') * 0.764554858)} m³`);
    expect(text).toContain(`${fmt(row(rows, 'Estimated weight'))} US tons`);
    expect(text).toContain(`2 inches needs ${fmt(row(calculateGravel({ ...base, depth: 2 }).rows, 'Volume with waste'))} cu yd`);
    expect(text).toContain(`4 inches ${fmt(row(calculateGravel({ ...base, depth: 4 }).rows, 'Volume with waste'))} cu yd`);
  });

  it('paint example matches calculatePaint', () => {
    const text = guide('paint-calculator-guide');
    const at350 = calculatePaint({ width: 52, height: 8, openings: 51, coats: 2, coverage: 350, waste: 0 }).rows;
    const at400 = calculatePaint({ width: 52, height: 8, openings: 51, coats: 2, coverage: 400, waste: 0 }).rows;
    expect(text).toContain(`${row(at350, 'Gross wall area')} sq ft`);
    expect(text).toContain(`${row(at350, 'Net wall area')} sq ft`);
    expect(text).toContain(`${row(at350, 'Coverage across coats')} sq ft`);
    expect(text).toContain(`${fmt(row(at350, 'Estimated paint'))} gallons`);
    expect(text).toContain(`${fmt(row(at400, 'Estimated paint'))} gallons`);
    expect(row(at350, 'Whole-gallon purchase')).toBe(3);
    expect(row(at400, 'Whole-gallon purchase')).toBe(2);
  });

  it('tile example matches calculateTile', () => {
    const text = guide('tile-calculator-guide');
    const tile = (waste: number) => calculateTile({ length: 8, width: 5, tileLength: 12, tileWidth: 12, grout: 0.125, waste, boxSize: 10 }).rows;
    expect(text).toContain(`${fmt(row(tile(10), 'Approx. tile coverage'), 3)} sq ft`);
    expect(text).toContain(`${row(tile(10), 'Estimated tiles')} tiles in ${row(tile(10), 'Estimated boxes')} boxes`);
    expect(text).toContain(`${row(tile(15), 'Estimated tiles')} tiles, still ${row(tile(15), 'Estimated boxes')} boxes`);
    expect(text).toContain(`20% needs ${row(tile(20), 'Estimated tiles')}`);
  });

  it('concrete example matches calculateConcrete and the 0.6 cu ft bag', () => {
    const text = guide('concrete-calculator-guide');
    const { rows } = calculateConcrete({ length: 12, width: 10, depth: 4, waste: 10 });
    expect(text).toContain(`${row(rows, 'Volume')} cu ft`);
    expect(text).toContain(`${fmt(row(rows, 'Volume before waste'))} cu yd`);
    expect(text).toContain(`${fmt(row(rows, 'Volume with waste'))} cu yd`);
    expect(text).toContain(`${Math.ceil(row(rows, 'Volume') / 0.6)} bags without allowance, ${Math.ceil(row(rows, 'Volume') * 1.1 / 0.6)} with it`);
  });

  it('square footage example matches calculateArea', () => {
    const text = guide('square-footage-calculator-guide');
    const lShape = calculateArea([{ length: 12, width: 10, unit: 'ft' }, { length: 6, width: 4, unit: 'ft' }]).rows;
    const metric = calculateArea([{ length: 4, width: 3, unit: 'm' }]).rows;
    expect(text).toContain(`${row(lShape, 'Combined area')} sq ft, which is ${fmt(row(lShape, 'Metric equivalent'))} m²`);
    expect(text).toContain(`${fmt(row(metric, 'Combined area'))} sq ft`);
  });

  it('mulch example matches calculateMulch', () => {
    const text = guide('mulch-calculator-guide');
    const base = { length: 140, width: 1, depth: 3 };
    const plain = calculateMulch({ ...base, waste: 0 }).rows;
    expect(text).toContain(`${row(plain, 'Volume')} cu ft`);
    expect(text).toContain(`${fmt(row(plain, 'Volume before waste'))} cu yd`);
    expect(text).toContain(`${Math.ceil(row(plain, 'Volume') / 2)} bags`);
    expect(text).toContain(`${fmt(row(calculateMulch({ ...base, waste: 10 }).rows, 'Volume with waste'))} cu yd`);
  });
});
