import { describe, expect, it } from 'vitest';
import { CALCULATORS } from './calculators';
import { GUIDES } from './guides';
import {
  calculateAdhesive, calculateArea, calculateConcrete, calculateDrywall, calculateFlooring, calculateGravel, calculateInsulation,
  calculateMasonry, calculateMulch, calculatePaint, calculateScreed, calculateTile, calculateWallpaper, groutPerSquareMeter,
  masonryPerSquareFoot, MASONRY_UNITS,
} from '../utils/calculations';

const KG_PER_LB = 0.45359237;
const SQ_FT_PER_M2 = 10.7639104;

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
  it('flooring example matches calculateFlooring', () => {
    const text = guide('laminate-flooring-calculator-guide');
    const at = (waste: number) => calculateFlooring({ length: 14, width: 12, waste, boxArea: 20, baseboards: true, doorways: 1, doorWidth: 3, pieceLength: 8 }).rows;
    const rows = at(10);
    expect(text).toContain(`${row(rows, 'Floor area')} sq ft. With 10%: ${row(rows, 'Area with waste')} sq ft`);
    expect(text).toContain(`so ${row(rows, 'Boxes needed')} boxes (${row(rows, 'Flooring in those boxes')} sq ft`);
    expect(text).toContain(`${fmt(row(rows, 'Baseboard length'), 1)} ft of baseboard`);
    expect(text).toContain(`so ${row(rows, 'Baseboard pieces')} pieces, plus ${row(rows, 'End caps')} end caps`);
    expect(text).toContain(`it would be ${row(at(0), 'Boxes needed')} boxes`);
    expect(text).toContain(`in ${row(at(15), 'Boxes needed')} boxes`);
  });

  it('drywall example matches calculateDrywall', () => {
    const text = guide('drywall-calculator-guide');
    const base = { length: 12, width: 10, height: 8, openings: 36, includeCeiling: true, waste: 10 };
    const rows = calculateDrywall({ ...base, sheetSize: 0, supplies: true, studSpacing: 16, spacingUnit: 1, studLength: 8 }).rows;
    expect(text).toContain(`${row(rows, 'Wall area')} sq ft. Ceiling: 12 × 10 = ${row(rows, 'Ceiling area')} sq ft`);
    expect(text).toContain(`= ${row(rows, 'Area to cover')} sq ft. With 10%: ${row(rows, 'Area with waste')} sq ft`);
    expect(text).toContain(`so ${row(rows, 'Sheets needed')} sheets. With 4 × 12 ft sheets: ${row(calculateDrywall({ ...base, sheetSize: 2 }).rows, 'Sheets needed')} sheets`);
    expect(text).toContain(`about ${row(rows, 'Drywall screws')} screws, ${Math.round(row(rows, 'Joint tape'))} ft of tape and ${row(rows, 'Joint compound')} box of compound`);
    expect(text).toContain(`Studs at 16 in for new walls: ${row(rows, 'Studs')}`);
  });

  it('adhesive example matches calculateAdhesive', () => {
    const text = guide('tile-adhesive-grout-calculator-guide');
    const rows = calculateAdhesive({ surfaceArea: 10, openingsUnit: 2, tileLength: 300, tileWidth: 600, tileThickness: 9, tileUnit: 4, grout: 3, groutUnit: 4, notch: -1, waste: 10, adhesiveBag: 25, groutBag: 5, weightUnit: 1 }).rows;
    expect(row(rows, 'Trowel notch')).toBe(12);
    expect(text).toContain(`= ${fmt(row(rows, 'Tile adhesive') * KG_PER_LB, 1)} kg, which is ${row(rows, 'Adhesive bags')} bags of 25 kg`);
    expect(text).toContain(`= ${fmt(groutPerSquareMeter(300, 600, 3, 9), 3)} kg/m²`);
    expect(text).toContain(`= ${fmt(row(rows, 'Grout') * KG_PER_LB)} kg, so ${row(rows, 'Grout bags')} bag of 5 kg`);
    expect(groutPerSquareMeter(100, 100, 3, 9) / groutPerSquareMeter(300, 600, 3, 9)).toBeCloseTo(4);
    expect(text).toContain(`${fmt(groutPerSquareMeter(100, 100, 3, 9), 3)} kg`);
  });

  it('wallpaper example matches calculateWallpaper', () => {
    const text = guide('wallpaper-calculator-guide');
    const base = { length: 12, width: 10, height: 8, rollWidth: 20.5, rollLength: 33 };
    const rows = calculateWallpaper({ ...base, openings: 36, patternRepeat: 0 }).rows;
    expect(text).toContain(`so ${row(rows, 'Strips needed')} strips`);
    expect(text).toContain(`= ${fmt(row(rows, 'Strip length'))} ft. Strips per roll: 33 ÷ ${fmt(row(rows, 'Strip length'))}`);
    expect(text).toContain(`so ${row(rows, 'Strips per roll')} whole strips`);
    expect(text).toContain(`= ${row(rows, 'Rolls needed')} rolls`);
    const noOpenings = calculateWallpaper({ ...base, openings: 0, patternRepeat: 0 }).rows;
    expect(text).toContain(`${row(noOpenings, 'Strips needed')} strips and ${row(noOpenings, 'Rolls needed')} rolls`);
    const repeat = calculateWallpaper({ ...base, openings: 36, patternRepeat: 21 }).rows;
    expect(text).toContain(`grows to ${fmt(row(repeat, 'Strip length'))} ft, but ${row(repeat, 'Strips per roll')} still fit`);
    const sections = GUIDES.find((g) => g.slug === 'wallpaper-calculator-guide')!.sections.flatMap((x) => x.paragraphs).join(' ');
    const byArea = Math.ceil(((12 + 10) * 2 * 8 - 36) / (20.5 / 12 * 33));
    expect(sections).toContain(`it gives ${byArea} rolls instead of ${row(rows, 'Rolls needed')}`);
  });

  it('screed example matches calculateScreed', () => {
    const text = guide('screed-plaster-calculator-guide');
    const at = (thickness: number, material: number) => calculateScreed({ surfaceArea: 12, openingsUnit: 2, thickness, depthUnit: 4, material, waste: 5, bagSize: 25, weightUnit: 1 }).rows;
    const kg = (rows: { label: string; value: number }[]) => row(rows, 'Dry mix') * KG_PER_LB;
    expect(text).toContain(`= ${fmt(kg(at(50, 0)) / 1.05, 0)} kg, plus 5% = ${fmt(kg(at(50, 0)), 0)} kg`);
    expect(text).toContain(`so ${row(at(50, 0), 'Bags')} bags`);
    expect(text).toContain(`= ${fmt(kg(at(5, 1)) / 1.05, 0)} kg, plus 5% = ${fmt(kg(at(5, 1)), 1)} kg, so ${row(at(5, 1), 'Bags')} bags`);
  });

  it('insulation example matches calculateInsulation', () => {
    const text = guide('insulation-board-calculator-guide');
    const rows = calculateInsulation({ surfaceArea: 120, openings: 18, openingsUnit: 2, board: 2, thickness: 10, depthUnit: 3, waste: 5, supplies: true }).rows;
    expect(row(rows, 'Area to insulate') / SQ_FT_PER_M2).toBeCloseTo(102);
    expect(text).toContain(`so ${row(rows, 'Boards')} boards (${fmt(row(rows, 'Insulation volume') / 35.3146667)} m³`);
    expect(text).toContain(`= ${fmt(row(rows, 'Board adhesive') * KG_PER_LB, 0)} kg. Base coat: 102 × 4.0 = ${fmt(row(rows, 'Base coat') * KG_PER_LB, 0)} kg`);
    expect(text).toContain(`= ${fmt(row(rows, 'Reinforcing mesh') / SQ_FT_PER_M2, 1)} m². Anchors: 102 × 6 = ${row(rows, 'Anchors')}`);
  });

  it('masonry example matches calculateMasonry', () => {
    const text = guide('brick-block-calculator-guide');
    const rows = calculateMasonry({ length: 20, height: 6, openings: 0, unit: 0, waste: 5, mortarYield: 0.6 }).rows;
    const perSqFt = masonryPerSquareFoot(MASONRY_UNITS[0]).units;
    expect(text).toContain(`120 × ${fmt(perSqFt)} = ${Math.ceil(120 * perSqFt)} before waste, and ${row(rows, 'Bricks or blocks')} with 5%`);
    expect(text).toContain(`about ${fmt(row(rows, 'Mortar'))} cu ft with the allowance, which is ${row(rows, 'Mortar bags')} bags`);
    expect(text).toContain(`${row(rows, 'Bricks or blocks')} ÷ 37 = ${fmt(row(rows, 'Bricks or blocks') / 37, 1)}, so ${Math.ceil(row(rows, 'Bricks or blocks') / 37)} bags`);
    expect(fmt(perSqFt, 1)).toBe('6.9');
    expect(masonryPerSquareFoot(MASONRY_UNITS[1]).units).toBeCloseTo(1.125, 3);
  });
});
