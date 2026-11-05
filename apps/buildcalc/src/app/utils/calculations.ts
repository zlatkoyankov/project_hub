export interface EstimateRow {
  label: string;
  value: number;
  unit: string;
  precision?: number;
  detail?: string;
}

export interface Estimate {
  rows: EstimateRow[];
  summary: string;
}

export type Values = Record<string, number>;

export interface GravelInput {
  length: number;
  width: number;
  depth: number;
  density: number;
  waste: number;
  price?: number;
  priceUnit?: number;
  dimensionUnit?: number;
  depthUnit?: number;
  densityUnit?: number;
  metricPrice?: boolean;
}

export interface PaintInput {
  width: number;
  height: number;
  openings: number;
  coats: number;
  coverage: number;
  waste: number;
  price?: number;
  dimensionUnit?: number;
  openingsUnit?: number;
  coverageUnit?: number;
  metricPrice?: boolean;
}

export interface TileInput {
  length: number;
  width: number;
  tileLength: number;
  tileWidth: number;
  grout: number;
  waste: number;
  boxSize?: number;
  price?: number;
  priceUnit?: number;
  dimensionUnit?: number;
  tileUnit?: number;
  groutUnit?: number;
}

export interface ConcreteInput {
  length: number;
  width: number;
  depth: number;
  waste: number;
  price?: number;
  dimensionUnit?: number;
  depthUnit?: number;
  metricPrice?: boolean;
}

export interface MulchInput {
  length: number;
  width: number;
  depth: number;
  waste: number;
  price?: number;
  dimensionUnit?: number;
  depthUnit?: number;
  metricPrice?: boolean;
}

const FEET_PER_UNIT = [1, 1 / 12, 3.280839895, 1 / 30.48, 1 / 304.8];
const INCHES_PER_UNIT = [12, 1, 39.37007874, 1 / 2.54, 1 / 25.4];
const SQUARE_FEET_PER_UNIT = [1, 1 / 144, 10.7639104, 1 / 929.0304];
const unitFactor = (factors: number[], unit: number | undefined): number => factors[unit ?? 0] ?? 1;

const positive = (value: number, name: string): void => {
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${name} must be greater than zero.`);
};

const nonNegative = (value: number, name: string): void => {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${name} cannot be negative.`);
};

const wasteMultiplier = (waste: number): number => {
  if (!Number.isFinite(waste) || waste < 0 || waste > 100) throw new Error('Waste allowance must be between 0% and 100%.');
  return 1 + waste / 100;
};

export function calculateGravel(values: GravelInput): Estimate {
  positive(values.length, 'Length');
  positive(values.width, 'Width');
  positive(values.depth, 'Depth');
  nonNegative(values.density, 'Density');
  nonNegative(values.waste, 'Waste allowance');

  const dimensionFactor = unitFactor(FEET_PER_UNIT, values.dimensionUnit);
  const depthInches = values.depth * unitFactor(INCHES_PER_UNIT, values.depthUnit ?? 1);
  const lengthFeet = values.length * dimensionFactor;
  const widthFeet = values.width * dimensionFactor;
  const area = lengthFeet * widthFeet;
  const cubicFeet = area * depthInches / 12;
  const cubicYards = cubicFeet / 27;
  const adjusted = cubicYards * wasteMultiplier(values.waste);
  const density = values.densityUnit === 1 ? values.density / 0.593276 : values.density;
  const tons = density > 0 ? adjusted * density / 2000 : 0;
  const price = values.price ?? 0;
  nonNegative(price, 'Price');

  const metricVolume = adjusted * 0.764554858;
  const metricDensity = values.densityUnit === 1 ? values.density : values.density / 0.593276;
  const priceUnit = values.priceUnit === 1
    ? values.metricPrice ? 'cubic meter' : 'cubic yard'
    : values.metricPrice ? 'metric tonne' : 'ton';
  const priceQuantity = values.priceUnit === 1
    ? values.metricPrice ? metricVolume : adjusted
    : values.metricPrice ? metricVolume * metricDensity / 1000 : tons;
  const cost = price > 0 ? price * priceQuantity : null;

  return {
    rows: [
      { label: 'Area', value: area, unit: 'sq ft', precision: 2 },
      { label: 'Base volume', value: cubicFeet, unit: 'cu ft', precision: 2 },
      { label: 'Volume before waste', value: cubicYards, unit: 'cu yd', precision: 2 },
      { label: 'Volume with waste', value: adjusted, unit: 'cu yd', precision: 2 },
      ...(tons > 0 ? [{ label: 'Estimated weight', value: tons, unit: 'US tons', precision: 2 }] : []),
      ...(cost !== null ? [{ label: 'Estimated material cost', value: cost, unit: 'USD', precision: 2, detail: `at $${price.toFixed(2)} per ${priceUnit}` }] : []),
    ],
    summary: `${adjusted.toFixed(2)} cubic yards${tons > 0 ? ` (about ${tons.toFixed(2)} US tons)` : ''} including waste.`,
  };
}

export function calculatePaint(values: PaintInput): Estimate {
  positive(values.width, 'Wall width');
  positive(values.height, 'Wall height');
  positive(values.coats, 'Number of coats');
  positive(values.coverage, 'Coverage');
  nonNegative(values.openings, 'Excluded area');
  nonNegative(values.waste, 'Waste allowance');

  const dimensionFactor = unitFactor(FEET_PER_UNIT, values.dimensionUnit);
  const gross = values.width * dimensionFactor * values.height * dimensionFactor;
  const openings = values.openings * unitFactor(SQUARE_FEET_PER_UNIT, values.openingsUnit);
  if (openings > gross) throw new Error('Excluded area cannot exceed gross wall area.');

  const net = gross - openings;
  const coverArea = net * values.coats * wasteMultiplier(values.waste);
  const coverage = values.coverageUnit === 1 ? values.coverage * 40.745 : values.coverage;
  const gallons = coverArea / coverage;
  const metricLiters = gallons * 3.785411784;
  const purchaseQuantity = values.metricPrice ? Math.ceil(metricLiters) : Math.ceil(gallons);
  const price = values.price ?? 0;
  nonNegative(price, 'Price');

  return {
    rows: [
      { label: 'Gross wall area', value: gross, unit: 'sq ft', precision: 2 },
      { label: 'Area excluded', value: openings, unit: 'sq ft', precision: 2 },
      { label: 'Net wall area', value: net, unit: 'sq ft', precision: 2 },
      { label: 'Coverage across coats', value: coverArea, unit: 'sq ft', precision: 2 },
      { label: 'Estimated paint', value: gallons, unit: 'gallons', precision: 2 },
      values.metricPrice
        ? { label: 'Whole-liter purchase', value: purchaseQuantity, unit: 'L', precision: 0, detail: 'rounded up for purchasing' }
        : { label: 'Whole-gallon purchase', value: Math.ceil(gallons), unit: 'gallons', precision: 0, detail: 'rounded up for purchasing' },
      ...(price > 0 ? [{ label: 'Estimated cost', value: purchaseQuantity * price, unit: 'USD', precision: 2 }] : []),
    ],
    summary: values.metricPrice
      ? `Plan for ${purchaseQuantity} liters for this estimate.`
      : `Plan for ${purchaseQuantity} gallon${purchaseQuantity === 1 ? '' : 's'} for this estimate.`,
  };
}

export function calculateTile(values: TileInput): Estimate {
  positive(values.length, 'Room length');
  positive(values.width, 'Room width');
  positive(values.tileLength, 'Tile length');
  positive(values.tileWidth, 'Tile width');
  nonNegative(values.grout, 'Grout spacing');
  nonNegative(values.waste, 'Waste allowance');
  nonNegative(values.boxSize ?? 0, 'Tiles per box');

  const dimensionFactor = unitFactor(FEET_PER_UNIT, values.dimensionUnit);
  const roomArea = values.length * dimensionFactor * values.width * dimensionFactor;
  const tileInches = unitFactor(INCHES_PER_UNIT, values.tileUnit ?? 1);
  const groutInches = unitFactor(INCHES_PER_UNIT, values.groutUnit ?? 1);
  const tileFace = (values.tileLength * tileInches + values.grout * groutInches)
    * (values.tileWidth * tileInches + values.grout * groutInches) / 144;
  const rawTiles = roomArea / tileFace * wasteMultiplier(values.waste);
  const tiles = Math.ceil(rawTiles);
  const boxes = (values.boxSize ?? 0) > 0 ? Math.ceil(tiles / (values.boxSize ?? 0)) : 0;
  const price = values.price ?? 0;
  nonNegative(price, 'Price');
  if (price > 0 && values.priceUnit === 1 && boxes === 0) throw new Error('Enter tiles per box to price by the box.');
  const cost = price > 0 ? price * (values.priceUnit === 1 ? boxes : tiles) : null;

  return {
    rows: [
      { label: 'Room area', value: roomArea, unit: 'sq ft', precision: 2 },
      { label: 'Approx. tile coverage', value: tileFace, unit: 'sq ft per tile', precision: 3, detail: 'including grout spacing' },
      { label: 'Estimated tiles', value: tiles, unit: 'tiles', precision: 0, detail: 'includes waste allowance' },
      ...(boxes > 0 ? [{ label: 'Estimated boxes', value: boxes, unit: 'boxes', precision: 0 }] : []),
      ...(cost !== null ? [{ label: 'Estimated material cost', value: cost, unit: 'USD', precision: 2 }] : []),
    ],
    summary: `Plan for ${tiles} tiles${boxes > 0 ? ` or ${boxes} boxes` : ''}, including waste.`,
  };
}

export function calculateConcrete(values: ConcreteInput): Estimate {
  positive(values.length, 'Slab length');
  positive(values.width, 'Slab width');
  positive(values.depth, 'Thickness');
  nonNegative(values.waste, 'Waste allowance');

  const dimensionFactor = unitFactor(FEET_PER_UNIT, values.dimensionUnit);
  const depthInches = values.depth * unitFactor(INCHES_PER_UNIT, values.depthUnit ?? 1);
  const area = values.length * dimensionFactor * values.width * dimensionFactor;
  const cubicFeet = area * depthInches / 12;
  const cubicYards = cubicFeet / 27;
  const adjusted = cubicYards * wasteMultiplier(values.waste);
  const price = values.price ?? 0;
  nonNegative(price, 'Price');

  return {
    rows: [
      { label: 'Slab area', value: area, unit: 'sq ft', precision: 2 },
      { label: 'Volume', value: cubicFeet, unit: 'cu ft', precision: 2 },
      { label: 'Volume before waste', value: cubicYards, unit: 'cu yd', precision: 2 },
      { label: 'Volume with waste', value: adjusted, unit: 'cu yd', precision: 2 },
      ...(price > 0 ? [{ label: 'Estimated material cost', value: adjusted * (values.metricPrice ? 0.764554858 : 1) * price, unit: 'USD', precision: 2 }] : []),
    ],
    summary: `${adjusted.toFixed(2)} cubic yards including waste.`,
  };
}

export function calculateArea(areas: { length: number; width: number; unit: 'ft' | 'in' | 'm' | 'cm' }[]): Estimate {
  if (areas.length === 0) throw new Error('Add at least one area.');
  const totals = areas.map((area, index) => {
    positive(area.length, `Area ${index + 1} length`);
    positive(area.width, `Area ${index + 1} width`);
    const factor = area.unit === 'ft' ? 1 : area.unit === 'in' ? 1 / 12 : area.unit === 'm' ? 3.280839895 : 1 / 30.48;
    return area.length * factor * area.width * factor;
  });
  const total = totals.reduce((sum, value) => sum + value, 0);
  return {
    rows: [
      ...totals.map((value, index) => ({ label: `Area ${index + 1}`, value, unit: 'sq ft', precision: 2 })),
      { label: 'Combined area', value: total, unit: 'sq ft', precision: 2 },
      { label: 'Metric equivalent', value: total * 0.09290304, unit: 'sq m', precision: 2 },
    ],
    summary: `${total.toFixed(2)} square feet combined.`,
  };
}

export function calculateMulch(values: MulchInput): Estimate {
  positive(values.length, 'Length');
  positive(values.width, 'Width');
  positive(values.depth, 'Depth');
  nonNegative(values.waste, 'Waste allowance');

  const dimensionFactor = unitFactor(FEET_PER_UNIT, values.dimensionUnit);
  const depthInches = values.depth * unitFactor(INCHES_PER_UNIT, values.depthUnit ?? 1);
  const area = values.length * dimensionFactor * values.width * dimensionFactor;
  const cubicFeet = area * depthInches / 12;
  const cubicYards = cubicFeet / 27;
  const adjusted = cubicYards * wasteMultiplier(values.waste);
  const price = values.price ?? 0;
  nonNegative(price, 'Price');

  return {
    rows: [
      { label: 'Area', value: area, unit: 'sq ft', precision: 2 },
      { label: 'Volume', value: cubicFeet, unit: 'cu ft', precision: 2 },
      { label: 'Volume before waste', value: cubicYards, unit: 'cu yd', precision: 2 },
      { label: 'Volume with waste', value: adjusted, unit: 'cu yd', precision: 2 },
      ...(price > 0 ? [{ label: 'Estimated material cost', value: adjusted * (values.metricPrice ? 0.764554858 : 1) * price, unit: 'USD', precision: 2 }] : []),
    ],
    summary: `${adjusted.toFixed(2)} cubic yards including waste.`,
  };
}

export interface FlooringInput {
  length: number;
  width: number;
  waste: number;
  boxArea: number;
  price?: number;
  dimensionUnit?: number;
  boxAreaUnit?: number;
  /** Baseboards and trim around the room (lengths in the room's dimension unit). */
  baseboards?: boolean;
  doorways?: number;
  doorWidth?: number;
  pieceLength?: number;
  insideCorners?: number;
  outsideCorners?: number;
  transitions?: number;
  trimPrice?: number;
}

export interface TrimEstimate {
  perimeter: number;
  baseboardLength: number;
  pieces: number;
  connectors: number;
  endCaps: number;
}

/** Baseboard pieces and accessories for a rectangular room; lengths in feet. */
export function estimateTrim(length: number, width: number, doorways: number, doorWidth: number, pieceLength: number, waste: number): TrimEstimate {
  positive(pieceLength, 'Baseboard piece length');
  nonNegative(doorways, 'Doorways');
  nonNegative(doorWidth, 'Doorway width');
  const perimeter = 2 * (length + width);
  const baseboardLength = Math.max(0, perimeter - doorways * doorWidth) * wasteMultiplier(waste);
  const pieces = Math.ceil(baseboardLength / pieceLength - 1e-6);
  // Joints along each wall where one piece meets the next (ignoring doorways, so a slight overestimate).
  const perWall = (wall: number) => Math.max(0, Math.ceil(wall / pieceLength - 1e-6) - 1);
  const connectors = 2 * perWall(length) + 2 * perWall(width);
  return { perimeter, baseboardLength, pieces, connectors, endCaps: 2 * Math.round(doorways) };
}

export function calculateFlooring(values: FlooringInput): Estimate {
  positive(values.length, 'Room length');
  positive(values.width, 'Room width');
  positive(values.boxArea, 'Coverage per box');
  nonNegative(values.waste, 'Waste allowance');

  const dimensionFactor = unitFactor(FEET_PER_UNIT, values.dimensionUnit);
  const area = values.length * dimensionFactor * values.width * dimensionFactor;
  const withWaste = area * wasteMultiplier(values.waste);
  const boxArea = values.boxArea * unitFactor(SQUARE_FEET_PER_UNIT, values.boxAreaUnit);
  const boxes = Math.ceil(withWaste / boxArea - 1e-6);
  const price = values.price ?? 0;
  nonNegative(price, 'Price');
  const trimPrice = values.trimPrice ?? 0;
  nonNegative(trimPrice, 'Price per baseboard piece');
  const trim = values.baseboards
    ? estimateTrim(
      values.length * dimensionFactor,
      values.width * dimensionFactor,
      Math.round(values.doorways ?? 0),
      (values.doorWidth ?? 0) * dimensionFactor,
      (values.pieceLength ?? 0) * dimensionFactor,
      values.waste,
    )
    : null;
  const insideCorners = Math.round(values.insideCorners ?? 0);
  const outsideCorners = Math.round(values.outsideCorners ?? 0);
  const transitions = Math.round(values.transitions ?? 0);
  const cost = boxes * price + (trim ? trim.pieces * trimPrice : 0);
  const count = (label: string, value: number, one: string, many: string, detail?: string) =>
    ({ label, value, unit: value === 1 ? one : many, precision: 0, ...(detail ? { detail } : {}) });

  return {
    rows: [
      { label: 'Floor area', value: area, unit: 'sq ft', precision: 2 },
      { label: 'Area with waste', value: withWaste, unit: 'sq ft', precision: 2 },
      { label: 'Boxes needed', value: boxes, unit: boxes === 1 ? 'box' : 'boxes', precision: 0, detail: 'rounded up to whole boxes' },
      { label: 'Flooring in those boxes', value: boxes * boxArea, unit: 'sq ft', precision: 2 },
      ...(trim ? [
        { label: 'Room perimeter', value: trim.perimeter, unit: 'ft', precision: 2 },
        { label: 'Baseboard length', value: trim.baseboardLength, unit: 'ft', precision: 2, detail: 'minus doorways, plus waste' },
        count('Baseboard pieces', trim.pieces, 'piece', 'pieces', 'rounded up to whole pieces'),
        count('Inside corners', insideCorners, 'corner', 'corners'),
        ...(outsideCorners > 0 ? [count('Outside corners', outsideCorners, 'corner', 'corners')] : []),
        ...(trim.endCaps > 0 ? [count('End caps', trim.endCaps, 'cap', 'caps', 'where baseboards stop at a door frame')] : []),
        ...(trim.connectors > 0 ? [count('Connectors', trim.connectors, 'connector', 'connectors', 'approximate; joints along the walls')] : []),
      ] : []),
      ...(transitions > 0 ? [count('Transition strips', transitions, 'strip', 'strips', 'at doorways to other floors')] : []),
      ...(cost > 0 ? [{ label: 'Estimated material cost', value: cost, unit: 'USD', precision: 2 }] : []),
    ],
    summary: `Plan for ${boxes} box${boxes === 1 ? '' : 'es'} (${(boxes * boxArea).toFixed(2)} sq ft)${trim ? ` and ${trim.pieces} baseboard piece${trim.pieces === 1 ? '' : 's'}` : ''}, including waste.`,
  };
}

/** Drywall sheet sizes: the first three in feet (US), the rest in meters. */
export const DRYWALL_SHEETS = [
  { label: '4 × 8 ft', squareFeet: 32 },
  { label: '4 × 10 ft', squareFeet: 40 },
  { label: '4 × 12 ft', squareFeet: 48 },
  { label: '1.2 × 2.0 m', squareFeet: 2.4 * 10.7639104 },
  { label: '1.2 × 2.5 m', squareFeet: 3.0 * 10.7639104 },
  { label: '1.2 × 3.0 m', squareFeet: 3.6 * 10.7639104 },
];

export interface DrywallInput {
  length: number;
  width: number;
  height: number;
  openings: number;
  includeCeiling: boolean;
  sheetSize: number;
  waste: number;
  price?: number;
  dimensionUnit?: number;
  openingsUnit?: number;
  /** Studs, tracks and finishing supplies for the walls. */
  supplies?: boolean;
  studSpacing?: number;
  spacingUnit?: number;
  /** Length of one stud or track, in the room's dimension unit. */
  studLength?: number;
}

/** Rules of thumb for finishing (see the drywall guide): about one screw per sq ft of board,
 *  0.4 ft of joint tape per sq ft, and one 4.5-gallon box of premixed compound per 475 sq ft. */
export const DRYWALL_SUPPLY_RATES = { screwsPerSqFt: 1, tapeFtPerSqFt: 0.4, sqFtPerCompoundBox: 475 };

export interface FramingEstimate {
  trackLength: number;
  trackPieces: number;
  studs: number;
  studPieces: number;
}

/** Metal (or wood) framing for the four walls of a rectangular room; lengths in feet.
 *  Studs at the given spacing along each wall, plus one at each wall's end; floor and ceiling tracks. */
export function estimateFraming(length: number, width: number, height: number, spacing: number, pieceLength: number, waste: number): FramingEstimate {
  positive(spacing, 'Stud spacing');
  positive(pieceLength, 'Stud length');
  const whole = (value: number) => Math.ceil(value - 1e-6);
  const perimeter = 2 * (length + width);
  const trackLength = 2 * perimeter * wasteMultiplier(waste);
  const studsPerWall = (wall: number) => whole(wall / spacing) + 1;
  const studs = 2 * studsPerWall(length) + 2 * studsPerWall(width);
  return {
    trackLength,
    trackPieces: whole(trackLength / pieceLength),
    studs,
    studPieces: studs * whole(height / pieceLength),
  };
}

export function calculateDrywall(values: DrywallInput): Estimate {
  positive(values.length, 'Room length');
  positive(values.width, 'Room width');
  positive(values.height, 'Wall height');
  nonNegative(values.openings, 'Doors and windows');
  nonNegative(values.waste, 'Waste allowance');
  const sheet = DRYWALL_SHEETS[values.sheetSize];
  if (!sheet) throw new Error('Choose a sheet size.');

  const dimensionFactor = unitFactor(FEET_PER_UNIT, values.dimensionUnit);
  const length = values.length * dimensionFactor;
  const width = values.width * dimensionFactor;
  const height = values.height * dimensionFactor;
  const walls = 2 * (length + width) * height;
  const ceiling = values.includeCeiling ? length * width : 0;
  const gross = walls + ceiling;
  const openings = values.openings * unitFactor(SQUARE_FEET_PER_UNIT, values.openingsUnit);
  if (openings > gross) throw new Error('Doors and windows cannot be larger than the wall area.');
  const net = gross - openings;
  const withWaste = net * wasteMultiplier(values.waste);
  const sheets = Math.ceil(withWaste / sheet.squareFeet - 1e-6);
  const price = values.price ?? 0;
  nonNegative(price, 'Price');
  const framing = values.supplies
    ? estimateFraming(length, width, height, (values.studSpacing ?? 0) * unitFactor(FEET_PER_UNIT, values.spacingUnit ?? 1), (values.studLength ?? 0) * dimensionFactor, values.waste)
    : null;
  const count = (label: string, value: number, one: string, many: string, detail?: string) =>
    ({ label, value, unit: value === 1 ? one : many, precision: 0, ...(detail ? { detail } : {}) });
  const supplies = values.supplies ? [
    ...(framing ? [
      count('Studs', framing.studs, 'stud', 'studs', 'walls only, plus one at each wall end'),
      count('Stud pieces to buy', framing.studPieces, 'piece', 'pieces'),
      { label: 'Floor and ceiling track', value: framing.trackLength, unit: 'ft', precision: 1, detail: 'walls only, with waste' },
      count('Track pieces to buy', framing.trackPieces, 'piece', 'pieces'),
    ] : []),
    count('Drywall screws', Math.ceil(net * DRYWALL_SUPPLY_RATES.screwsPerSqFt - 1e-6), 'screw', 'screws', 'about one per sq ft (11 per m²) of board'),
    { label: 'Joint tape', value: net * DRYWALL_SUPPLY_RATES.tapeFtPerSqFt, unit: 'ft', precision: 0, detail: 'about 0.4 ft per sq ft (1.3 m per m²)' },
    count('Joint compound', Math.ceil(net / DRYWALL_SUPPLY_RATES.sqFtPerCompoundBox - 1e-6), 'box', 'boxes', '4.5-gallon boxes of premixed compound'),
  ] : [];

  return {
    rows: [
      { label: 'Wall area', value: walls, unit: 'sq ft', precision: 2 },
      ...(ceiling > 0 ? [{ label: 'Ceiling area', value: ceiling, unit: 'sq ft', precision: 2 }] : []),
      { label: 'Doors and windows', value: openings, unit: 'sq ft', precision: 2 },
      { label: 'Area to cover', value: net, unit: 'sq ft', precision: 2 },
      { label: 'Area with waste', value: withWaste, unit: 'sq ft', precision: 2 },
      { label: 'Sheets needed', value: sheets, unit: sheets === 1 ? 'sheet' : 'sheets', precision: 0, detail: `${sheet.label} sheets, rounded up` },
      ...supplies,
      ...(price > 0 ? [{ label: 'Estimated material cost', value: sheets * price, unit: 'USD', precision: 2 }] : []),
    ],
    summary: `Plan for ${sheets} sheet${sheets === 1 ? '' : 's'} of ${sheet.label} drywall, including waste.`,
  };
}

/** Notched-trowel sizes with typical cement adhesive use (kg per m²), from Ceresit CM 11's data sheet. */
export const TROWEL_NOTCHES = [
  { mm: 4, label: '4 mm (5/32 in)', kgPerM2: 2.0 },
  { mm: 6, label: '6 mm (1/4 in)', kgPerM2: 2.7 },
  { mm: 8, label: '8 mm (5/16 in)', kgPerM2: 3.4 },
  { mm: 10, label: '10 mm (3/8 in)', kgPerM2: 4.2 },
  { mm: 12, label: '12 mm (1/2 in)', kgPerM2: 4.8 },
];

/** Notch for a tile, by its longest side in cm: the usual rule from adhesive data sheets. */
export function suggestedNotch(longestSideCm: number): number {
  if (longestSideCm <= 10) return 0;
  if (longestSideCm <= 15) return 1;
  if (longestSideCm <= 25) return 2;
  if (longestSideCm <= 31) return 3;
  return 4;
}

/** Grout in kg per m²: (L + W) / (L × W) × joint width × joint depth × density, all in mm (density in kg/L). */
export function groutPerSquareMeter(lengthMm: number, widthMm: number, jointMm: number, depthMm: number, density = 1.6): number {
  return ((lengthMm + widthMm) / (lengthMm * widthMm)) * jointMm * depthMm * density;
}

export interface AdhesiveInput {
  surfaceArea: number;
  tileLength: number;
  tileWidth: number;
  tileThickness: number;
  grout: number;
  /** -1 picks the notch from the tile size. */
  notch: number;
  waste: number;
  adhesiveBag: number;
  groutBag: number;
  /** Area unit of surfaceArea (sq ft, sq in, sq m, sq cm). */
  openingsUnit?: number;
  /** Unit of the tile sizes and thickness (in, cm, mm). */
  tileUnit?: number;
  groutUnit?: number;
  /** 0 lb, 1 kg for the bag sizes. */
  weightUnit?: number;
}

const KG_PER_LB = 0.45359237;
const MM_PER_UNIT = [304.8, 25.4, 1000, 10, 1];

export function calculateAdhesive(values: AdhesiveInput): Estimate {
  positive(values.surfaceArea, 'Area to tile');
  positive(values.tileLength, 'Tile length');
  positive(values.tileWidth, 'Tile width');
  positive(values.tileThickness, 'Tile thickness');
  nonNegative(values.grout, 'Grout joint width');
  positive(values.adhesiveBag, 'Adhesive bag size');
  positive(values.groutBag, 'Grout bag size');

  const squareFeet = values.surfaceArea * unitFactor(SQUARE_FEET_PER_UNIT, values.openingsUnit);
  const squareMeters = squareFeet / 10.7639104;
  const withWaste = squareMeters * wasteMultiplier(values.waste);
  const mm = (value: number, unit: number | undefined) => value * (MM_PER_UNIT[unit ?? 1] ?? 25.4);
  const length = mm(values.tileLength, values.tileUnit);
  const width = mm(values.tileWidth, values.tileUnit);
  const thickness = mm(values.tileThickness, values.tileUnit);
  const joint = mm(values.grout, values.groutUnit);

  const notchIndex = values.notch >= 0 ? values.notch : suggestedNotch(Math.max(length, width) / 10);
  const notch = TROWEL_NOTCHES[notchIndex];
  if (!notch) throw new Error('Choose a trowel notch size.');
  const adhesiveKg = withWaste * notch.kgPerM2;
  const groutKg = withWaste * groutPerSquareMeter(length, width, joint, thickness);

  const kgBags = values.weightUnit === 1;
  const bagKg = (bag: number) => (kgBags ? bag : bag * KG_PER_LB);
  const bagLabel = (bag: number) => `${bag} ${kgBags ? 'kg' : 'lb'} bags`;
  const adhesiveBags = Math.ceil(adhesiveKg / bagKg(values.adhesiveBag) - 1e-6);
  const groutBags = joint > 0 ? Math.max(1, Math.ceil(groutKg / bagKg(values.groutBag) - 1e-6)) : 0;
  const lb = (kg: number) => kg / KG_PER_LB;

  return {
    rows: [
      { label: 'Area to tile', value: squareFeet, unit: 'sq ft', precision: 2 },
      { label: 'Area with waste', value: withWaste * 10.7639104, unit: 'sq ft', precision: 2 },
      { label: 'Trowel notch', value: notch.mm, unit: 'mm', precision: 0, detail: values.notch >= 0 ? notch.label : `${notch.label}, suggested for this tile size` },
      { label: 'Tile adhesive', value: lb(adhesiveKg), unit: 'lb', precision: 1, detail: `about ${notch.kgPerM2} kg per m² (${(notch.kgPerM2 / KG_PER_LB / 10.7639104).toFixed(2)} lb per sq ft)` },
      { label: 'Adhesive bags', value: adhesiveBags, unit: adhesiveBags === 1 ? 'bag' : 'bags', precision: 0, detail: bagLabel(values.adhesiveBag) },
      ...(joint > 0 ? [
        { label: 'Grout', value: lb(groutKg), unit: 'lb', precision: 1, detail: `about ${(groutKg / withWaste).toFixed(2)} kg per m²` },
        { label: 'Grout bags', value: groutBags, unit: groutBags === 1 ? 'bag' : 'bags', precision: 0, detail: bagLabel(values.groutBag) },
      ] : []),
    ],
    summary: `Plan for ${adhesiveBags} bag${adhesiveBags === 1 ? '' : 's'} of tile adhesive${joint > 0 ? ` and ${groutBags} bag${groutBags === 1 ? '' : 's'} of grout` : ''}, including waste.`,
  };
}

export interface WallpaperInput {
  length: number;
  width: number;
  height: number;
  /** Area of doors and windows. */
  openings: number;
  rollWidth: number;
  rollLength: number;
  patternRepeat: number;
  price?: number;
  dimensionUnit?: number;
  openingsUnit?: number;
  /** Unit of roll width and pattern repeat (in, cm, mm). */
  rollUnit?: number;
}

/** Extra length per strip for trimming at the ceiling and the floor: about 4 in (10 cm). */
export const WALLPAPER_TRIM_FT = 1 / 3;

/** Wallpaper by strips: each strip is the wall height (rounded up to whole pattern repeats) plus trim;
 *  strips that fit in a roll are counted whole, and doors and windows reduce the strips by their width. */
export function calculateWallpaper(values: WallpaperInput): Estimate {
  positive(values.length, 'Room length');
  positive(values.width, 'Room width');
  positive(values.height, 'Wall height');
  nonNegative(values.openings, 'Doors and windows');
  positive(values.rollWidth, 'Roll width');
  positive(values.rollLength, 'Roll length');
  nonNegative(values.patternRepeat, 'Pattern repeat');
  const price = values.price ?? 0;
  nonNegative(price, 'Price');

  const dimension = unitFactor(FEET_PER_UNIT, values.dimensionUnit);
  const small = unitFactor(FEET_PER_UNIT, values.rollUnit ?? 1);
  const length = values.length * dimension;
  const width = values.width * dimension;
  const height = values.height * dimension;
  const rollWidth = values.rollWidth * small;
  const rollLength = values.rollLength * dimension;
  const repeat = values.patternRepeat * small;
  const openings = values.openings * unitFactor(SQUARE_FEET_PER_UNIT, values.openingsUnit);

  const whole = (value: number) => Math.ceil(value - 1e-6);
  const perimeter = 2 * (length + width);
  // Doors and windows mostly save whole strips across their width: width ≈ area ÷ wall height.
  const wallToCover = Math.max(0, perimeter - openings / height);
  const strips = whole(wallToCover / rollWidth);
  const drop = (repeat > 0 ? whole(height / repeat) * repeat : height) + WALLPAPER_TRIM_FT;
  const stripsPerRoll = Math.floor(rollLength / drop + 1e-6);
  if (stripsPerRoll < 1) throw new Error('A roll is shorter than one strip: check the roll length and wall height.');
  const rolls = whole(strips / stripsPerRoll);

  return {
    rows: [
      { label: 'Wall perimeter', value: perimeter, unit: 'ft', precision: 2 },
      { label: 'Strip length', value: drop, unit: 'ft', precision: 2, detail: repeat > 0 ? 'wall height in whole pattern repeats, plus trim' : 'wall height plus trim' },
      { label: 'Strips needed', value: strips, unit: strips === 1 ? 'strip' : 'strips', precision: 0, detail: 'doors and windows deducted by their width' },
      { label: 'Strips per roll', value: stripsPerRoll, unit: stripsPerRoll === 1 ? 'strip' : 'strips', precision: 0 },
      { label: 'Rolls needed', value: rolls, unit: rolls === 1 ? 'roll' : 'rolls', precision: 0, detail: 'buy one spare from the same batch' },
      ...(price > 0 ? [{ label: 'Estimated cost', value: rolls * price, unit: '$', precision: 2 }] : []),
    ],
    summary: `Plan for ${rolls} roll${rolls === 1 ? '' : 's'} of wallpaper (${strips} strips), plus a spare roll from the same batch.`,
  };
}

/** Dry mix per m² for each mm of thickness, from manufacturers' data sheets. */
export const SCREED_MATERIALS = [
  { label: 'Cement screed', kgPerM2PerMm: 2.0, source: 'ready-mixed cement screed, about 20 kg/m² per cm (Sika, Baumit)' },
  { label: 'Self-leveling compound', kgPerM2PerMm: 1.8, source: 'about 1.8 kg/m² per mm (Knauf NE 425)' },
  { label: 'Gypsum plaster', kgPerM2PerMm: 0.9, source: 'about 0.8 to 1.0 kg/m² per mm (Knauf MP 75)' },
];

export interface ScreedInput {
  surfaceArea: number;
  thickness: number;
  material: number;
  /** kg/m² per mm; overrides the material when above 0. */
  consumption?: number;
  waste: number;
  bagSize: number;
  price?: number;
  openingsUnit?: number;
  depthUnit?: number;
  weightUnit?: number;
}

/** Bags of screed, floor leveler or plaster: area × thickness × the mix's consumption per mm. */
export function calculateScreed(values: ScreedInput): Estimate {
  positive(values.surfaceArea, 'Area');
  positive(values.thickness, 'Thickness');
  positive(values.bagSize, 'Bag size');
  const price = values.price ?? 0;
  nonNegative(price, 'Price');
  const material = SCREED_MATERIALS[values.material];
  if (!material) throw new Error('Choose a material.');
  const custom = (values.consumption ?? 0) > 0;
  const rate = custom ? values.consumption! : material.kgPerM2PerMm;

  const squareFeet = values.surfaceArea * unitFactor(SQUARE_FEET_PER_UNIT, values.openingsUnit);
  const squareMeters = squareFeet / 10.7639104;
  const thicknessMm = values.thickness * unitFactor(FEET_PER_UNIT, values.depthUnit ?? 1) * 304.8;
  const volumeCubicFeet = squareFeet * (thicknessMm / 304.8);
  const kg = squareMeters * thicknessMm * rate * wasteMultiplier(values.waste);
  const KG_PER_LB = 0.45359237;
  const bagKg = values.weightUnit === 1 ? values.bagSize : values.bagSize * KG_PER_LB;
  const bags = Math.ceil(kg / bagKg - 1e-6);

  return {
    rows: [
      { label: 'Area', value: squareFeet, unit: 'sq ft', precision: 2 },
      { label: 'Thickness', value: thicknessMm, unit: 'mm', precision: 1 },
      { label: 'Volume', value: volumeCubicFeet, unit: 'cu ft', precision: 2 },
      { label: 'Dry mix', value: kg / KG_PER_LB, unit: 'lb', precision: 1, detail: custom ? `${rate} kg/m² per mm, as entered, with waste` : `${material.label}: ${material.source}, with waste` },
      { label: 'Bags', value: bags, unit: bags === 1 ? 'bag' : 'bags', precision: 0, detail: `${values.bagSize} ${values.weightUnit === 1 ? 'kg' : 'lb'} bags` },
      ...(price > 0 ? [{ label: 'Estimated cost', value: bags * price, unit: '$', precision: 2 }] : []),
    ],
    summary: `Plan for ${bags} bag${bags === 1 ? '' : 's'} of ${(custom ? 'dry mix' : material.label.toLowerCase())}, including waste.`,
  };
}
