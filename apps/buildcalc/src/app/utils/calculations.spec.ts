import {
  calculateAdhesive, calculateArea, calculateWallpaper, calculateConcrete, calculateDrywall, estimateFraming, groutPerSquareMeter, suggestedNotch, calculateFlooring, calculateGravel, calculateMulch, calculatePaint, calculateTile,
} from './calculations';

describe('calculation utilities', () => {
  it('converts gravel volume and density to tons', () => {
    const result = calculateGravel({
      length: 20, width: 10, depth: 3, density: 2700, waste: 10, price: 0, priceUnit: 0,
    });
    const volume = result.rows.find((row) => row.label === 'Volume with waste');
    const tons = result.rows.find((row) => row.label === 'Estimated weight');
    expect(volume?.value).toBeCloseTo(2.04, 2);
    expect(tons?.value).toBeCloseTo(2.75, 2);
  });

  it('computes paint coverage and rounds gallons up', () => {
    const result = calculatePaint({
      width: 12, height: 8, openings: 20, coats: 2, coverage: 350, waste: 0, price: 40,
    });
    const gallons = result.rows.find((row) => row.label === 'Estimated paint');
    const purchase = result.rows.find((row) => row.label === 'Whole-gallon purchase');
    const cost = result.rows.find((row) => row.label === 'Estimated cost');
    expect(gallons?.value).toBeCloseTo(0.4342857, 6);
    expect(purchase?.value).toBe(1);
    expect(cost?.value).toBe(40);
  });

  it('computes tile quantities and rounds packages', () => {
    const result = calculateTile({
      length: 10, width: 12, tileLength: 12, tileWidth: 12, grout: 0.125, waste: 10, boxSize: 10, price: 0, priceUnit: 0,
    });
    const tiles = result.rows.find((row) => row.label === 'Estimated tiles');
    const boxes = result.rows.find((row) => row.label === 'Estimated boxes');
    expect(tiles?.value).toBeGreaterThanOrEqual(130);
    expect(boxes?.value).toBe(Math.ceil((tiles?.value ?? 0) / 10));
  });

  it('converts concrete cubic feet to cubic yards', () => {
    const result = calculateConcrete({
      length: 10, width: 10, depth: 4, waste: 0, price: 0,
    });
    const cubicFeet = result.rows.find((row) => row.label === 'Volume');
    const cubicYards = result.rows.find((row) => row.label === 'Volume before waste');
    expect(cubicFeet?.value).toBeCloseTo(33.3333, 3);
    expect(cubicYards?.value).toBeCloseTo(1.2346, 3);
  });

  it('totals square footage across multiple rooms', () => {
    const result = calculateArea([
      { length: 12, width: 10, unit: 'ft' },
      { length: 120, width: 120, unit: 'in' },
    ]);
    const combined = result.rows.find((row) => row.label === 'Combined area');
    expect(combined?.value).toBeCloseTo(220, 4);
  });

  it('converts mulch depth to cubic yards', () => {
    const result = calculateMulch({
      length: 10, width: 10, depth: 3, waste: 10, price: 0,
    });
    const cubicYards = result.rows.find((row) => row.label === 'Volume with waste');
    expect(cubicYards?.value).toBeCloseTo(1.0185, 3);
  });

  it('applies waste allowance consistently', () => {
    const noWaste = calculateConcrete({ length: 10, width: 10, depth: 4, waste: 0, price: 0 });
    const withWaste = calculateConcrete({ length: 10, width: 10, depth: 4, waste: 10, price: 0 });
    const base = noWaste.rows.find((row) => row.label === 'Volume before waste')?.value ?? 0;
    const adjusted = withWaste.rows.find((row) => row.label === 'Volume with waste')?.value ?? 0;
    expect(adjusted).toBeCloseTo(base * 1.1, 6);
  });

  it('normalizes metric measurements before estimating', () => {
    const imperial = calculateConcrete({ length: 10, width: 10, depth: 4, waste: 0, price: 0 });
    const metric = calculateConcrete({
      length: 3.048, width: 3.048, depth: 10.16, waste: 0, price: 0, dimensionUnit: 2, depthUnit: 3,
    });
    const imperialVolume = imperial.rows.find((row) => row.label === 'Volume before waste')?.value;
    const metricVolume = metric.rows.find((row) => row.label === 'Volume before waste')?.value;
    expect(metricVolume).toBeCloseTo(imperialVolume ?? 0, 6);
  });

  it('supports metric gravel density and paint coverage inputs', () => {
    const gravel = calculateGravel({
      length: 6.096, width: 3.048, depth: 7.62, density: 1600, waste: 10,
      dimensionUnit: 2, depthUnit: 3, densityUnit: 1,
    });
    const volume = gravel.rows.find((row) => row.label === 'Volume with waste')?.value;
    const weight = gravel.rows.find((row) => row.label === 'Estimated weight')?.value;
    expect(volume).toBeCloseTo(2.04, 2);
    expect(weight).toBeCloseTo(2.75, 1);

    const paint = calculatePaint({
      width: 3.6576, height: 2.4384, openings: 1.858, coats: 2,
      coverage: 8.59, waste: 0, dimensionUnit: 2, openingsUnit: 2, coverageUnit: 1,
    });
    const gallons = paint.rows.find((row) => row.label === 'Estimated paint')?.value;
    expect(gallons).toBeCloseTo(0.434, 2);
  });

  it('throws for zero, negative, missing, or invalid inputs', () => {
    expect(() => calculateConcrete({ length: 0, width: 10, depth: 4, waste: 0, price: 0 })).toThrow();
    expect(() => calculatePaint({ width: 10, height: 8, openings: 1000, coats: 2, coverage: 350, waste: 0, price: 0 })).toThrow();
    expect(() => calculateArea([{ length: -2, width: 5, unit: 'ft' }])).toThrow();
    expect(() => calculateMulch({ length: 10, width: 10, depth: Number.NaN, waste: 0, price: 0 })).toThrow();
  });

  it('reports a metric paint purchase in whole liters that matches the cost basis', () => {
    const result = calculatePaint({
      width: 12, height: 8, openings: 0, coats: 2, coverage: 350, waste: 0, price: 10, metricPrice: true,
    });
    const purchase = result.rows.find((row) => row.label === 'Whole-liter purchase');
    const cost = result.rows.find((row) => row.label === 'Estimated cost');
    expect(purchase?.value).toBe(3);
    expect(purchase?.unit).toBe('L');
    expect(cost?.value).toBe(30);
    expect(result.rows.some((row) => row.label === 'Whole-gallon purchase')).toBe(false);
  });

  it('rejects pricing by the box without a box size and negative box sizes', () => {
    const base = { length: 10, width: 12, tileLength: 12, tileWidth: 12, grout: 0.125, waste: 10 };
    expect(() => calculateTile({ ...base, boxSize: 0, price: 5, priceUnit: 1 })).toThrow(/tiles per box/i);
    expect(() => calculateTile({ ...base, boxSize: -4 })).toThrow();
    expect(calculateTile({ ...base, boxSize: 10, price: 5, priceUnit: 1 }).rows.find((row) => row.label === 'Estimated material cost')?.value).toBe(65);
  });

  it('converts centimeter and millimeter inputs to the same estimate as inches', () => {
    const inches = calculateTile({ length: 10, width: 12, tileLength: 12, tileWidth: 12, grout: 0.125, waste: 0 });
    const millimeters = calculateTile({
      length: 10, width: 12, tileLength: 304.8, tileWidth: 304.8, grout: 3.175, waste: 0, tileUnit: 4, groutUnit: 4,
    });
    expect(millimeters.rows.find((row) => row.label === 'Estimated tiles')?.value)
      .toBe(inches.rows.find((row) => row.label === 'Estimated tiles')?.value);
  });

  it('rounds laminate up to whole boxes after waste', () => {
    const result = calculateFlooring({ length: 14, width: 12, waste: 10, boxArea: 20 });
    expect(result.rows.find((row) => row.label === 'Floor area')?.value).toBeCloseTo(168, 6);
    expect(result.rows.find((row) => row.label === 'Area with waste')?.value).toBeCloseTo(184.8, 6);
    expect(result.rows.find((row) => row.label === 'Boxes needed')?.value).toBe(10);
    expect(result.rows.find((row) => row.label === 'Flooring in those boxes')?.value).toBeCloseTo(200, 6);
  });

  it('reads metric laminate inputs', () => {
    // 4 m × 3 m = 12 m², +10% = 13.2 m², boxes of 2.2 m² → exactly 6 boxes.
    const result = calculateFlooring({ length: 4, width: 3, waste: 10, boxArea: 2.2, dimensionUnit: 2, boxAreaUnit: 2 });
    expect(result.rows.find((row) => row.label === 'Boxes needed')?.value).toBe(6);
  });

  it('adds studs, tracks and finishing supplies to the drywall estimate', () => {
    const result = calculateDrywall({ length: 12, width: 10, height: 8, openings: 21, includeCeiling: false, sheetSize: 0, waste: 10, supplies: true, studSpacing: 16, spacingUnit: 1, studLength: 8 });
    const row = (label: string) => result.rows.find((item) => item.label === label)?.value;
    // 12 ft wall: 9 spaces of 16 in + 1 = 10 studs; 10 ft wall: 8 + 1 = 9; two of each.
    expect(row('Studs')).toBe(38);
    expect(row('Stud pieces to buy')).toBe(38);
    expect(row('Floor and ceiling track')).toBeCloseTo(96.8);
    expect(row('Track pieces to buy')).toBe(13);
    expect(row('Drywall screws')).toBe(331);
    expect(row('Joint tape')).toBeCloseTo(132.4);
    expect(row('Joint compound')).toBe(1);
  });

  it('works out framing in metric, with studs taller than one piece', () => {
    const framing = estimateFraming(4 * 3.280839895, 3.5 * 3.280839895, 3.2 * 3.280839895, 0.6 * 3.280839895, 3 * 3.280839895, 0);
    expect(framing.studs).toBe(2 * (7 + 1) + 2 * (6 + 1));
    expect(framing.studPieces).toBe(framing.studs * 2);
  });

  it('counts drywall sheets for walls, minus openings, plus ceiling when asked', () => {
    const walls = calculateDrywall({ length: 12, width: 10, height: 8, openings: 21, includeCeiling: false, sheetSize: 0, waste: 10 });
    expect(walls.rows.find((row) => row.label === 'Wall area')?.value).toBeCloseTo(352, 6);
    expect(walls.rows.find((row) => row.label === 'Area to cover')?.value).toBeCloseTo(331, 6);
    expect(walls.rows.find((row) => row.label === 'Sheets needed')?.value).toBe(12);
    const withCeiling = calculateDrywall({ length: 12, width: 10, height: 8, openings: 21, includeCeiling: true, sheetSize: 0, waste: 10 });
    expect(withCeiling.rows.find((row) => row.label === 'Ceiling area')?.value).toBeCloseTo(120, 6);
    expect(withCeiling.rows.find((row) => row.label === 'Sheets needed')?.value).toBe(16);
  });

  it('rejects openings larger than the walls', () => {
    expect(() => calculateDrywall({ length: 2, width: 2, height: 2, openings: 100, includeCeiling: false, sheetSize: 0, waste: 0 })).toThrow();
  });

  it('adds baseboard pieces, corners, end caps and connectors for laminate', () => {
    const result = calculateFlooring({
      length: 14, width: 12, waste: 10, boxArea: 20,
      baseboards: true, doorways: 1, doorWidth: 3, pieceLength: 8, insideCorners: 4, outsideCorners: 0, transitions: 1,
    });
    const row = (label: string) => result.rows.find((item) => item.label === label)?.value;
    expect(row('Room perimeter')).toBeCloseTo(52, 6);
    expect(row('Baseboard length')).toBeCloseTo(53.9, 6);
    expect(row('Baseboard pieces')).toBe(7);
    expect(row('Inside corners')).toBe(4);
    expect(row('Outside corners')).toBeUndefined();
    expect(row('End caps')).toBe(2);
    expect(row('Connectors')).toBe(4);
    expect(row('Transition strips')).toBe(1);
    expect(result.summary).toContain('7 baseboard pieces');
  });

  it('leaves trim out when baseboards are off', () => {
    const result = calculateFlooring({ length: 14, width: 12, waste: 10, boxArea: 20, baseboards: false });
    expect(result.rows.some((item) => item.label === 'Baseboard pieces')).toBe(false);
  });

  it('works out grout per m² with the manufacturers’ formula', () => {
    // 300 × 300 mm tile, 4 mm joint, 10 mm deep: 0.426 kg/m² (the worked example tilers use).
    expect(groutPerSquareMeter(300, 300, 4, 10)).toBeCloseTo(0.4267, 3);
  });

  it('picks the trowel notch from the tile size', () => {
    expect(suggestedNotch(10)).toBe(0);
    expect(suggestedNotch(20)).toBe(2);
    expect(suggestedNotch(30.48)).toBe(3);
    expect(suggestedNotch(60)).toBe(4);
  });

  it('estimates adhesive and grout bags in metric', () => {
    const result = calculateAdhesive({ surfaceArea: 12, openingsUnit: 2, tileLength: 600, tileWidth: 600, tileThickness: 10, tileUnit: 4, grout: 3, groutUnit: 4, notch: -1, waste: 10, adhesiveBag: 25, groutBag: 5, weightUnit: 1 });
    const row = (label: string) => result.rows.find((item) => item.label === label)?.value ?? 0;
    expect(row('Trowel notch')).toBe(12);
    expect(row('Tile adhesive') * 0.45359237).toBeCloseTo(12 * 1.1 * 4.8, 3);
    expect(row('Adhesive bags')).toBe(3);
    expect(row('Grout') * 0.45359237).toBeCloseTo(12 * 1.1 * 0.16, 3);
    expect(row('Grout bags')).toBe(1);
  });

  it('estimates adhesive and grout bags in US units', () => {
    const result = calculateAdhesive({ surfaceArea: 120, openingsUnit: 0, tileLength: 12, tileWidth: 12, tileThickness: 0.375, tileUnit: 1, grout: 0.125, groutUnit: 1, notch: -1, waste: 10, adhesiveBag: 50, groutBag: 25, weightUnit: 0 });
    const row = (label: string) => result.rows.find((item) => item.label === label)?.value ?? 0;
    expect(row('Trowel notch')).toBe(10);
    expect(row('Adhesive bags')).toBe(3);
    expect(row('Grout bags')).toBe(1);
  });

  it('counts wallpaper rolls by strips', () => {
    const result = calculateWallpaper({ length: 12, width: 10, height: 8, openings: 21, rollWidth: 20.5, rollLength: 33, patternRepeat: 0, rollUnit: 1 });
    const row = (label: string) => result.rows.find((item) => item.label === label)?.value;
    // 44 ft of wall minus 21 sq ft ÷ 8 ft of openings = 41.4 ft ÷ 20.5 in = 25 strips; 33 ft ÷ 8 ft 4 in = 3 per roll.
    expect(row('Strips needed')).toBe(25);
    expect(row('Strips per roll')).toBe(3);
    expect(row('Rolls needed')).toBe(9);
  });

  it('rounds wallpaper strips up to whole pattern repeats, in metric', () => {
    const result = calculateWallpaper({ length: 4, width: 3.5, height: 2.6, openings: 1.8, rollWidth: 53, rollLength: 10.05, patternRepeat: 64, dimensionUnit: 2, openingsUnit: 2, rollUnit: 3 });
    const row = (label: string) => result.rows.find((item) => item.label === label)?.value ?? 0;
    expect(row('Strips needed')).toBe(27);
    // 2.6 m in 0.64 m repeats is 3.2 m, plus 10 cm trim.
    expect(row('Strip length') * 0.3048).toBeCloseTo(3.2 + 0.1016, 3);
    expect(row('Strips per roll')).toBe(3);
    expect(row('Rolls needed')).toBe(9);
  });
});
