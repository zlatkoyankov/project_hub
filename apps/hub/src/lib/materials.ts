// Metric material estimates for the Bulgarian laminate and drywall calculators.
// Same formulas as BuildCalc (apps/buildcalc/src/app/utils/calculations.ts), in metres.

const withWaste = (value: number, wastePct: number) => value * (1 + Math.max(0, wastePct) / 100)
// Round up to whole items, ignoring floating-point noise (3.0000001 boxes is 3 boxes).
const wholeUp = (value: number) => Math.max(0, Math.ceil(value - 1e-6))

export interface FlooringInput {
  length: number
  width: number
  waste: number
  /** m² per box */
  boxArea: number
  /** price per m² */
  price: number
  trim: boolean
  doorways: number
  doorWidth: number
  pieceLength: number
  insideCorners: number
  outsideCorners: number
  transitions: number
  /** price per baseboard piece */
  trimPrice: number
}

export interface FlooringEstimate {
  area: number
  areaWithWaste: number
  boxes: number
  boughtArea: number
  trim: null | {
    perimeter: number
    baseboardLength: number
    pieces: number
    connectors: number
    endCaps: number
    insideCorners: number
    outsideCorners: number
  }
  transitions: number
  cost: number
}

export function estimateFlooring(input: FlooringInput): FlooringEstimate | null {
  if (!(input.length > 0 && input.width > 0 && input.boxArea > 0)) return null
  const area = input.length * input.width
  const areaWithWaste = withWaste(area, input.waste)
  const boxes = wholeUp(areaWithWaste / input.boxArea)
  const boughtArea = boxes * input.boxArea
  let trim: FlooringEstimate['trim'] = null
  if (input.trim && input.pieceLength > 0) {
    const doorways = Math.max(0, Math.round(input.doorways))
    const perimeter = 2 * (input.length + input.width)
    const baseboardLength = withWaste(Math.max(0, perimeter - doorways * Math.max(0, input.doorWidth)), input.waste)
    // Joints along each wall where one piece meets the next (ignoring doorways, so a slight overestimate).
    const perWall = (wall: number) => Math.max(0, wholeUp(wall / input.pieceLength) - 1)
    trim = {
      perimeter,
      baseboardLength,
      pieces: wholeUp(baseboardLength / input.pieceLength),
      connectors: 2 * perWall(input.length) + 2 * perWall(input.width),
      endCaps: 2 * doorways,
      insideCorners: Math.max(0, Math.round(input.insideCorners)),
      outsideCorners: Math.max(0, Math.round(input.outsideCorners)),
    }
  }
  const transitions = Math.max(0, Math.round(input.transitions))
  const cost = boughtArea * Math.max(0, input.price) + (trim ? trim.pieces * Math.max(0, input.trimPrice) : 0)
  return { area, areaWithWaste, boxes, boughtArea, trim, transitions, cost }
}

/** Common board sizes in Bulgarian shops, width × length in metres. */
export const DRYWALL_SHEETS = [
  { label: '1,2 × 2,0 м', area: 2.4 },
  { label: '1,2 × 2,5 м', area: 3.0 },
  { label: '1,2 × 2,6 м', area: 3.12 },
  { label: '1,2 × 3,0 м', area: 3.6 },
]

export interface DrywallInput {
  length: number
  width: number
  height: number
  /** m² of doors and windows */
  openings: number
  ceiling: boolean
  sheet: number
  waste: number
  /** price per sheet */
  price: number
  /** Metal framing (UW/CW profiles) for the walls and finishing supplies. */
  supplies?: boolean
  studSpacing?: number
  profileLength?: number
}

/** Approximate consumption per m² of board: screws about one per square foot; tape and joint
 *  compound from Knauf's system data (0.75 m of tape; 0.5 kg compound on walls, 0.3 kg on ceilings). */
export const SUPPLY_RATES = { screwsPerM2: 11, tapePerM2: 0.75, compoundWallKg: 0.5, compoundCeilingKg: 0.3 }

export interface DrywallSupplies {
  studs: number
  studPieces: number
  trackLength: number
  trackPieces: number
  screws: number
  tape: number
  compound: number
}

export interface DrywallEstimate {
  walls: number
  ceiling: number
  openings: number
  net: number
  withWaste: number
  sheets: number
  sheetLabel: string
  cost: number
  supplies: DrywallSupplies | null
}

export function estimateDrywall(input: DrywallInput): DrywallEstimate | null {
  const sheet = DRYWALL_SHEETS[input.sheet]
  if (!sheet || !(input.length > 0 && input.width > 0 && input.height > 0)) return null
  const walls = 2 * (input.length + input.width) * input.height
  const ceiling = input.ceiling ? input.length * input.width : 0
  const openings = Math.min(Math.max(0, input.openings), walls + ceiling)
  const net = walls + ceiling - openings
  const total = withWaste(net, input.waste)
  const sheets = wholeUp(total / sheet.area)
  let supplies: DrywallSupplies | null = null
  const spacing = input.studSpacing ?? 0
  const pieceLength = input.profileLength ?? 0
  if (input.supplies && spacing > 0 && pieceLength > 0) {
    const perimeter = 2 * (input.length + input.width)
    // CW studs along each wall at the spacing, plus one at each wall end; UW tracks on floor and ceiling.
    const studsPerWall = (wall: number) => wholeUp(wall / spacing) + 1
    const studs = 2 * studsPerWall(input.length) + 2 * studsPerWall(input.width)
    const trackLength = withWaste(2 * perimeter, input.waste)
    const wallBoard = Math.max(0, walls - openings)
    supplies = {
      studs,
      studPieces: studs * wholeUp(input.height / pieceLength),
      trackLength,
      trackPieces: wholeUp(trackLength / pieceLength),
      screws: wholeUp(net * SUPPLY_RATES.screwsPerM2),
      // Joints in the board plus the four inside corners (and the ceiling edge, if the ceiling is boarded).
      tape: net * SUPPLY_RATES.tapePerM2 + 4 * input.height + (ceiling > 0 ? perimeter : 0),
      compound: wallBoard * SUPPLY_RATES.compoundWallKg + ceiling * SUPPLY_RATES.compoundCeilingKg,
    }
  }
  return { walls, ceiling, openings, net, withWaste: total, sheets, sheetLabel: sheet.label, cost: sheets * Math.max(0, input.price), supplies }
}

/** Notched-trowel sizes with typical cement adhesive use (kg/m²), from the Ceresit CM 11 PLUS data sheet. */
export const TROWEL_NOTCHES = [
  { mm: 4, kgPerM2: 2.0 },
  { mm: 6, kgPerM2: 2.7 },
  { mm: 8, kgPerM2: 3.4 },
  { mm: 10, kgPerM2: 4.2 },
  { mm: 12, kgPerM2: 4.8 },
]

/** Notch by the tile's longest side in cm: the usual rule from adhesive data sheets. */
export const suggestedNotch = (longestCm: number) => (longestCm <= 10 ? 0 : longestCm <= 15 ? 1 : longestCm <= 25 ? 2 : longestCm <= 31 ? 3 : 4)

/** Grout in kg/m²: (L + W) / (L × W) × joint width × joint depth × 1.6, all in mm.
 *  1.6 kg/l is the density of cement grout (e.g. SikaCeram Tile Grout data sheet; Mapei uses the same method). */
export const groutPerM2 = (lengthMm: number, widthMm: number, jointMm: number, depthMm: number) =>
  ((lengthMm + widthMm) / (lengthMm * widthMm)) * jointMm * depthMm * 1.6

export interface AdhesiveInput {
  area: number
  /** cm */
  tileLength: number
  tileWidth: number
  /** mm */
  thickness: number
  joint: number
  /** -1: pick from the tile size */
  notch: number
  waste: number
  adhesiveBag: number
  groutBag: number
  adhesivePrice: number
  groutPrice: number
}

export interface AdhesiveEstimate {
  areaWithWaste: number
  notchMm: number
  suggested: boolean
  adhesivePerM2: number
  adhesive: number
  adhesiveBags: number
  groutPerM2: number
  grout: number
  groutBags: number
  cost: number
}

export function estimateAdhesive(input: AdhesiveInput): AdhesiveEstimate | null {
  if (!(input.area > 0 && input.tileLength > 0 && input.tileWidth > 0 && input.thickness > 0 && input.adhesiveBag > 0 && input.groutBag > 0)) return null
  const areaWithWaste = withWaste(input.area, input.waste)
  const suggested = input.notch < 0
  const notch = TROWEL_NOTCHES[suggested ? suggestedNotch(Math.max(input.tileLength, input.tileWidth)) : input.notch]
  if (!notch) return null
  const adhesive = areaWithWaste * notch.kgPerM2
  const perM2 = groutPerM2(input.tileLength * 10, input.tileWidth * 10, Math.max(0, input.joint), input.thickness)
  const grout = areaWithWaste * perM2
  const adhesiveBags = wholeUp(adhesive / input.adhesiveBag)
  const groutBags = grout > 0 ? Math.max(1, wholeUp(grout / input.groutBag)) : 0
  return {
    areaWithWaste, notchMm: notch.mm, suggested, adhesivePerM2: notch.kgPerM2, adhesive, adhesiveBags,
    groutPerM2: perM2, grout, groutBags,
    cost: adhesiveBags * Math.max(0, input.adhesivePrice) + groutBags * Math.max(0, input.groutPrice),
  }
}

export interface WallpaperInput {
  length: number
  width: number
  height: number
  /** m² of doors and windows */
  openings: number
  /** cm */
  rollWidth: number
  /** m */
  rollLength: number
  /** cm, 0 for plain paper */
  repeat: number
  price: number
}

export interface WallpaperEstimate {
  perimeter: number
  drop: number
  strips: number
  stripsPerRoll: number
  rolls: number
  cost: number
}

/** Extra length per strip for trimming at the ceiling and the floor. */
export const WALLPAPER_TRIM_M = 0.1

/** Wallpaper by strips, like a decorator counts it: whole strips per roll, the drop in whole pattern repeats,
 *  and doors and windows deducted by their width (area ÷ wall height). */
export function estimateWallpaper(input: WallpaperInput): WallpaperEstimate | null {
  if (!(input.length > 0 && input.width > 0 && input.height > 0 && input.rollWidth > 0 && input.rollLength > 0)) return null
  const perimeter = 2 * (input.length + input.width)
  const wall = Math.max(0, perimeter - Math.max(0, input.openings) / input.height)
  const strips = wholeUp(wall / (input.rollWidth / 100))
  const repeat = Math.max(0, input.repeat) / 100
  const drop = (repeat > 0 ? wholeUp(input.height / repeat) * repeat : input.height) + WALLPAPER_TRIM_M
  const stripsPerRoll = Math.floor(input.rollLength / drop + 1e-6)
  if (stripsPerRoll < 1) return null
  const rolls = wholeUp(strips / stripsPerRoll)
  return { perimeter, drop, strips, stripsPerRoll, rolls, cost: rolls * Math.max(0, input.price) }
}

/** Dry mix per m² for each mm of thickness, from manufacturers' data sheets:
 *  cement screed Baumit Solido E225 (20 kg/m² per cm), self-levelling Ceresit CN 68 BG (1.5) and
 *  Baumit Nivello Quattro / Nivello 20 (1.5–1.6), gypsum plaster Knauf MP 75 (10 kg/m² at 10 mm). */
export const SCREED_MATERIALS = [
  { label: 'Циментова замазка', kgPerM2PerMm: 2.0, bag: 25 },
  { label: 'Саморазливна замазка', kgPerM2PerMm: 1.6, bag: 25 },
  { label: 'Гипсова мазилка', kgPerM2PerMm: 1.0, bag: 30 },
]

export interface ScreedInput {
  area: number
  /** mm */
  thickness: number
  material: number
  /** kg/m² per mm; overrides the material when above 0 */
  consumption: number
  waste: number
  bag: number
  price: number
}

export interface ScreedEstimate {
  volume: number
  rate: number
  custom: boolean
  kg: number
  bags: number
  cost: number
}

export function estimateScreed(input: ScreedInput): ScreedEstimate | null {
  const material = SCREED_MATERIALS[input.material]
  if (!material || !(input.area > 0 && input.thickness > 0 && input.bag > 0)) return null
  const custom = input.consumption > 0
  const rate = custom ? input.consumption : material.kgPerM2PerMm
  const kg = withWaste(input.area * input.thickness * rate, input.waste)
  const bags = wholeUp(kg / input.bag)
  return { volume: (input.area * input.thickness) / 1000, rate, custom, kg, bags, cost: bags * Math.max(0, input.price) }
}

/** Insulation boards common in Bulgarian shops, face area in m². */
export const INSULATION_BOARDS = [
  { label: 'EPS (стиропор) 1 × 0,5 м', area: 0.5 },
  { label: 'XPS 1,25 × 0,6 м', area: 0.75 },
  { label: 'Минерална вата 1,2 × 0,6 м', area: 0.72 },
]

/** Per m² of board: adhesive and base coat from Ceresit CT 85, mesh with 10% overlaps, six anchors. */
export const INSULATION_RATES = { adhesiveKg: 5.5, baseCoatKg: 4.0, meshOverlap: 1.1, anchors: 6 }

export interface InsulationInput {
  area: number
  openings: number
  board: number
  /** cm */
  thickness: number
  waste: number
  supplies: boolean
  /** price per m² of board */
  price: number
}

export interface InsulationEstimate {
  net: number
  boards: number
  boardArea: number
  volume: number
  supplies: null | { adhesive: number; baseCoat: number; bags: number; mesh: number; anchors: number }
  cost: number
}

export function estimateInsulation(input: InsulationInput): InsulationEstimate | null {
  const board = INSULATION_BOARDS[input.board]
  if (!board || !(input.area > 0 && input.thickness > 0)) return null
  const net = Math.max(0, input.area - Math.max(0, input.openings))
  const boards = wholeUp(withWaste(net, input.waste) / board.area)
  const boardArea = boards * board.area
  const r = INSULATION_RATES
  const supplies = input.supplies
    ? { adhesive: net * r.adhesiveKg, baseCoat: net * r.baseCoatKg, bags: wholeUp((net * (r.adhesiveKg + r.baseCoatKg)) / 25), mesh: net * r.meshOverlap, anchors: wholeUp(net * r.anchors) }
    : null
  return { net, boards, boardArea, volume: boardArea * (input.thickness / 100), supplies, cost: boardArea * Math.max(0, input.price) }
}

/** Bricks and blocks common in Bulgaria: face length and height, wall depth and joint, in metres.
 *  headJoints is false for interlocking ends (no mortar in the vertical joints). */
export const MASONRY_UNITS = [
  { label: 'Плътна тухла 25 × 12 × 6,5 см, стена 12 см', length: 0.25, height: 0.065, depth: 0.12, joint: 0.01, headJoints: true },
  { label: 'Плътна тухла 25 × 12 × 6,5 см, стена 25 см', length: 0.12, height: 0.065, depth: 0.25, joint: 0.01, headJoints: true },
  { label: 'Керамичен блок 25 см (Porotherm 25)', length: 0.373, height: 0.238, depth: 0.25, joint: 0.012, headJoints: false },
  { label: 'Керамичен блок 11,5 см (Porotherm 11,5)', length: 0.5, height: 0.238, depth: 0.115, joint: 0.012, headJoints: false },
  { label: 'Газобетон 62,5 × 25 см, стена 25 см', length: 0.625, height: 0.25, depth: 0.25, joint: 0.002, headJoints: false },
  { label: 'Газобетон 62,5 × 25 см, стена 10 см', length: 0.625, height: 0.25, depth: 0.1, joint: 0.002, headJoints: false },
]

/** Units per m² and mortar per m² (m³): bed joints, and head joints when the unit has them, through the wall depth. */
export function masonryPerM2(unit: (typeof MASONRY_UNITS)[number]) {
  const units = 1 / ((unit.length + (unit.headJoints ? unit.joint : 0)) * (unit.height + unit.joint))
  const bed = (unit.depth * unit.joint) / (unit.height + unit.joint)
  const head = unit.headJoints ? units * unit.height * unit.joint * unit.depth : 0
  return { units, mortar: bed + head }
}

export interface MasonryInput {
  length: number
  height: number
  openings: number
  unit: number
  waste: number
  /** litres of mortar from one bag */
  mortarYield: number
  price: number
}

export interface MasonryEstimate {
  net: number
  perM2: number
  units: number
  mortarLitres: number
  bags: number
  headJoints: boolean
  cost: number
}

export function estimateMasonry(input: MasonryInput): MasonryEstimate | null {
  const unit = MASONRY_UNITS[input.unit]
  if (!unit || !(input.length > 0 && input.height > 0 && input.mortarYield > 0)) return null
  const net = Math.max(0, input.length * input.height - Math.max(0, input.openings))
  const rate = masonryPerM2(unit)
  const units = wholeUp(withWaste(net * rate.units, input.waste))
  const mortarLitres = withWaste(net * rate.mortar, input.waste) * 1000
  return {
    net, perM2: rate.units, units, mortarLitres, bags: mortarLitres > 0 ? wholeUp(mortarLitres / input.mortarYield) : 0,
    headJoints: unit.headJoints, cost: units * Math.max(0, input.price),
  }
}

// ---------- Concrete (Bulgarian calculator) ----------

/** Typical site-mixed recipes per 1 m³ of concrete. Approximate: they depend on the cement, sand and aggregate size. */
export const CONCRETE_MIXES = [
  { label: 'C12/15 (B15) – подложка, тротоар', cementKg: 270, sandM3: 0.48, gravelM3: 0.86, waterL: 180 },
  { label: 'C16/20 (B20) – плоча, основи', cementKg: 320, sandM3: 0.45, gravelM3: 0.85, waterL: 180 },
  { label: 'C20/25 (B25) – натоварена плоча, колони', cementKg: 370, sandM3: 0.43, gravelM3: 0.82, waterL: 185 },
] as const

/** Loose bulk density in tonnes per m³, to turn sand and gravel volumes into weight. */
export const SAND_T_PER_M3 = 1.5
export const GRAVEL_T_PER_M3 = 1.6

export interface ConcreteInput {
  shape: 'slab' | 'round'
  /** m */
  length: number
  /** m */
  width: number
  /** cm (slab thickness) */
  thickness: number
  /** cm (round column or post hole) */
  diameter: number
  /** m (round column or post hole) */
  depth: number
  count: number
  waste: number
  mix: number
  /** litres of concrete from one bag of dry pre-mix */
  bagYield: number
  /** kg per bag of cement */
  cementBag: number
  /** price per m³ of ready-mix */
  price: number
}

export interface ConcreteEstimate {
  volume: number
  withWaste: number
  truck: number
  dryBags: number
  cementKg: number
  cementBags: number
  sandM3: number
  gravelM3: number
  waterL: number
  cost: number
}

export function estimateConcrete(input: ConcreteInput): ConcreteEstimate | null {
  const count = Math.max(1, Math.round(input.count) || 1)
  const one = input.shape === 'round'
    ? Math.PI * (input.diameter / 200) ** 2 * input.depth
    : input.length * input.width * (input.thickness / 100)
  if (!(one > 0)) return null
  const volume = one * count
  const total = withWaste(volume, input.waste)
  const mix = CONCRETE_MIXES[input.mix] ?? CONCRETE_MIXES[1]
  const cementKg = total * mix.cementKg
  return {
    volume,
    withWaste: total,
    // Ready-mix plants sell in steps of 0.5 m³.
    truck: wholeUp(total * 2) / 2,
    dryBags: input.bagYield > 0 ? wholeUp((total * 1000) / input.bagYield) : 0,
    cementKg,
    cementBags: input.cementBag > 0 ? wholeUp(cementKg / input.cementBag) : 0,
    sandM3: total * mix.sandM3,
    gravelM3: total * mix.gravelM3,
    waterL: total * mix.waterL,
    cost: input.price > 0 ? (wholeUp(total * 2) / 2) * input.price : 0,
  }
}

// ---------- Gravel, sand and other bulk materials ----------

/** Loose bulk density in tonnes per m³. Suppliers' figures vary with moisture and grading. */
export const BULK_MATERIALS = [
  { label: 'Чакъл (речен или трошен)', tPerM3: 1.6 },
  { label: 'Трошен камък (фракция)', tPerM3: 1.5 },
  { label: 'Тампон (трошен камък 0–63 мм)', tPerM3: 1.8 },
  { label: 'Баластра', tPerM3: 1.8 },
  { label: 'Пясък', tPerM3: 1.5 },
  { label: 'Декоративни камъчета', tPerM3: 1.5 },
  { label: 'Пръст / хумус', tPerM3: 1.3 },
] as const

export interface BulkInput {
  length: number
  width: number
  /** cm */
  depth: number
  material: number
  /** extra % for compaction and spillage */
  extra: number
  /** price per tonne */
  price: number
}

export interface BulkEstimate {
  area: number
  volume: number
  withExtra: number
  tonnes: number
  density: number
  cost: number
}

export function estimateBulk(input: BulkInput): BulkEstimate | null {
  if (!(input.length > 0 && input.width > 0 && input.depth > 0)) return null
  const material = BULK_MATERIALS[input.material] ?? BULK_MATERIALS[0]
  const area = input.length * input.width
  const volume = area * (input.depth / 100)
  const withExtra = withWaste(volume, input.extra)
  const tonnes = withExtra * material.tPerM3
  return { area, volume, withExtra, tonnes, density: material.tPerM3, cost: input.price > 0 ? tonnes * input.price : 0 }
}

// ---------- Paint ----------

/** Common bucket sizes in Bulgarian shops, in litres. */
export const PAINT_CANS = [15, 10, 5, 2.5] as const

/** Cheapest-looking mix of cans: least paint left over, then fewest cans. */
export function paintCans(litres: number, sizes: readonly number[] = PAINT_CANS): { size: number; count: number }[] {
  if (!(litres > 0)) return []
  const [first, ...rest] = sizes
  let best: { cans: { size: number; count: number }[]; bought: number; count: number } | null = null
  for (let count = 0; count <= Math.ceil(litres / first); count += 1) {
    const left = litres - count * first
    const tail = rest.length && left > 1e-6 ? paintCans(left, rest) : left > 1e-6 ? null : []
    if (tail === null) continue
    const cans = count > 0 ? [{ size: first, count }, ...tail] : tail
    const bought = cans.reduce((sum, can) => sum + can.size * can.count, 0)
    const total = cans.reduce((sum, can) => sum + can.count, 0)
    if (!best || bought < best.bought - 1e-6 || (Math.abs(bought - best.bought) < 1e-6 && total < best.count)) best = { cans, bought, count: total }
  }
  // The smallest size always covers what is left, so best is set.
  return best?.cans ?? [{ size: first, count: Math.ceil(litres / first) }]
}

export interface PaintInput {
  length: number
  width: number
  height: number
  openings: number
  ceiling: boolean
  coats: number
  /** m² per litre per coat */
  coverage: number
  primer: boolean
  /** m² per litre of primer */
  primerCoverage: number
  /** price per litre */
  price: number
}

export interface PaintEstimate {
  walls: number
  ceiling: number
  net: number
  litres: number
  cans: { size: number; count: number }[]
  bought: number
  primerLitres: number
  cost: number
}

export function estimatePaint(input: PaintInput): PaintEstimate | null {
  if (!(input.length > 0 && input.width > 0 && input.height > 0 && input.coverage > 0)) return null
  const walls = 2 * (input.length + input.width) * input.height
  const ceiling = input.ceiling ? input.length * input.width : 0
  const net = Math.max(0, walls + ceiling - input.openings)
  const coats = Math.max(1, Math.round(input.coats) || 1)
  const litres = (net * coats) / input.coverage
  const cans = paintCans(litres)
  const bought = cans.reduce((sum, can) => sum + can.size * can.count, 0)
  const primerLitres = input.primer && input.primerCoverage > 0 ? net / input.primerCoverage : 0
  return { walls, ceiling, net, litres, cans, bought, primerLitres, cost: input.price > 0 ? bought * input.price : 0 }
}

// ---------- Tiles ----------

export interface TileInput {
  surface: 'floor' | 'walls'
  /** floor, m */
  length: number
  width: number
  /** walls: total length of the tiled walls and tiling height, m */
  wallLength: number
  wallHeight: number
  openings: number
  /** cm */
  tileLength: number
  tileWidth: number
  /** mm */
  joint: number
  waste: number
  /** m² per box */
  boxArea: number
  /** price per m² */
  price: number
}

export interface TileEstimate {
  area: number
  withWaste: number
  tiles: number
  boxes: number
  bought: number
  cost: number
}

export function estimateTiles(input: TileInput): TileEstimate | null {
  const area = input.surface === 'walls'
    ? Math.max(0, input.wallLength * input.wallHeight - input.openings)
    : input.length * input.width
  if (!(area > 0 && input.tileLength > 0 && input.tileWidth > 0)) return null
  const withWasteArea = withWaste(area, input.waste)
  const face = ((input.tileLength + input.joint / 10) / 100) * ((input.tileWidth + input.joint / 10) / 100)
  const boxes = input.boxArea > 0 ? wholeUp(withWasteArea / input.boxArea) : 0
  const bought = boxes > 0 ? boxes * input.boxArea : withWasteArea
  return { area, withWaste: withWasteArea, tiles: wholeUp(withWasteArea / face), boxes, bought, cost: input.price > 0 ? bought * input.price : 0 }
}

// ---------- Heating: seasonal heat demand and what each fuel costs ----------

/** Seasonal heat need in kWh per m² of heated floor, by how well the home keeps heat. Our own typical values for
 *  Bulgarian homes, in line with EnEffect's examples (about 59 and 105 kWh/m² a year for heating in blocks of flats). */
export const HOME_INSULATION = [
  { label: 'Стара, без изолация', kwhPerM2: 200 },
  { label: 'Само нова дограма', kwhPerM2: 140 },
  { label: 'Изолирана фасада и дограма', kwhPerM2: 90 },
  { label: 'Нова, енергоефективна', kwhPerM2: 55 },
] as const

/** Climate: colder places need more heat over the season. */
export const CLIMATE_ZONES = [
  { label: 'Топло: морето, Пловдив', factor: 0.85 },
  { label: 'Средно: София, Русе', factor: 1 },
  { label: 'Студено: планината', factor: 1.3 },
] as const

/** Neighbours above, below and beside keep an apartment warm. */
export const HOME_TYPES = [
  { label: 'Къща', factor: 1 },
  { label: 'Апартамент, първи или последен етаж', factor: 0.85 },
  { label: 'Апартамент, среден етаж', factor: 0.7 },
] as const

export interface HeatDemandInput {
  area: number
  insulation: number
  climate: number
  homeType: number
  /** share of the home that is heated, % */
  heatedShare: number
}

/** Useful heat for one heating season, kWh. */
export function heatDemand(input: HeatDemandInput): number {
  const insulation = HOME_INSULATION[input.insulation] ?? HOME_INSULATION[1]
  const climate = CLIMATE_ZONES[input.climate] ?? CLIMATE_ZONES[1]
  const type = HOME_TYPES[input.homeType] ?? HOME_TYPES[0]
  const share = input.heatedShare > 0 ? Math.min(100, input.heatedShare) / 100 : 1
  return input.area * share * insulation.kwhPerM2 * climate.factor * type.factor
}

/** Energy and efficiency assumptions per fuel. */
export const FUEL = {
  /** kWh in one stacked cubic metre (пространствен м³) of dry mixed hardwood */
  woodKwhPerStackedM3: 1850,
  woodStoveEfficiency: 0.7,
  pelletKwhPerKg: 4.7,
  pelletEfficiency: 0.85,
  /** seasonal coefficient of performance of an inverter air conditioner in Bulgarian winters */
  airconScop: 3.2,
  gasEfficiency: 0.92,
} as const

export interface HeatingInput extends HeatDemandInput {
  months: number
  woodPrice: number
  pelletPrice: number
  electricityPrice: number
  gasPrice: number
  districtPrice: number
}

export interface HeatingOption {
  key: 'wood' | 'pellets' | 'aircon' | 'electric' | 'gas' | 'district'
  label: string
  cost: number
  amount: string
}

export interface HeatingEstimate {
  demand: number
  options: HeatingOption[]
  cheapest: HeatingOption | null
}

const fmtBg = (value: number, digits = 1) => value.toLocaleString('bg-BG', { maximumFractionDigits: digits, minimumFractionDigits: 0 })

export function estimateHeating(input: HeatingInput): HeatingEstimate | null {
  if (!(input.area > 0)) return null
  const demand = heatDemand(input)
  const options: HeatingOption[] = []
  const woodM3 = demand / (FUEL.woodKwhPerStackedM3 * FUEL.woodStoveEfficiency)
  if (input.woodPrice > 0) options.push({ key: 'wood', label: 'Дърва (печка или камина)', cost: woodM3 * input.woodPrice, amount: `${fmtBg(woodM3)} пр. м³` })
  const pelletTonnes = demand / (FUEL.pelletKwhPerKg * FUEL.pelletEfficiency) / 1000
  if (input.pelletPrice > 0) options.push({ key: 'pellets', label: 'Пелети (котел или камина)', cost: pelletTonnes * input.pelletPrice, amount: `${fmtBg(pelletTonnes, 2)} т` })
  if (input.electricityPrice > 0) {
    const airconKwh = demand / FUEL.airconScop
    options.push({ key: 'aircon', label: 'Климатик или термопомпа', cost: airconKwh * input.electricityPrice, amount: `${fmtBg(airconKwh, 0)} kWh ток` })
    options.push({ key: 'electric', label: 'Ток директно (радиатор, конвектор)', cost: demand * input.electricityPrice, amount: `${fmtBg(demand, 0)} kWh ток` })
  }
  if (input.gasPrice > 0) {
    const gasKwh = demand / FUEL.gasEfficiency
    options.push({ key: 'gas', label: 'Природен газ', cost: gasKwh * input.gasPrice, amount: `${fmtBg(gasKwh, 0)} kWh газ` })
  }
  if (input.districtPrice > 0) options.push({ key: 'district', label: 'Парно', cost: demand * input.districtPrice, amount: `${fmtBg(demand, 0)} kWh` })
  options.sort((a, b) => a.cost - b.cost)
  return { demand, options, cheapest: options[0] ?? null }
}

// ---------- Firewood and pellets for a season ----------

/** Heat in one stacked cubic metre (пространствен м³, 1 m logs) of dry wood (about 20% moisture), kWh.
 *  Beech ≈ 1900 kWh per stacked m³ (LWF Merkblatt 20); others scaled by density (LWF Merkblatt 12). */
export const WOOD_SPECIES = [
  { label: 'Бук', kwhPerStackedM3: 1900 },
  { label: 'Дъб', kwhPerStackedM3: 2000 },
  { label: 'Габър', kwhPerStackedM3: 2000 },
  { label: 'Акация', kwhPerStackedM3: 2100 },
  { label: 'Смесени широколистни', kwhPerStackedM3: 1850 },
  { label: 'Иглолистни (бор, смърч)', kwhPerStackedM3: 1450 },
] as const

/** Wet wood spends heat on boiling off its water. */
export const WOOD_MOISTURE = [
  { label: 'Сухи (под 20% влага, 1–2 години)', factor: 1 },
  { label: 'Полусухи (20–30%, от една година)', factor: 0.85 },
  { label: 'Сурови (над 30%, тази година)', factor: 0.65 },
] as const

/** One stacked m³ holds about 0.7 m³ of solid wood; split wood thrown loose takes about 1.5 times the space
 *  (LWF Merkblatt 20, Bavarian State Institute of Forestry). */
export const STACKED_TO_SOLID = 0.7
export const STACKED_TO_LOOSE = 1.5
/** Dry wood holds about 4 kWh per kg, so the weight follows from the heat. */
export const WOOD_KWH_PER_KG = 4

export interface FuelAmountInput extends HeatDemandInput {
  fuel: 'wood' | 'pellets'
  species: number
  moisture: number
  /** % */
  efficiency: number
  /** wood: € per stacked m³; pellets: € per tonne */
  price: number
  pelletKwhPerKg: number
  /** kg per bag of pellets */
  bag: number
}

export interface FuelAmountEstimate {
  demand: number
  /** wood */
  stacked: number
  solid: number
  loose: number
  /** tonnes of wood or pellets */
  tonnes: number
  /** pellets */
  bags: number
  cost: number
}

export function estimateFuelAmount(input: FuelAmountInput): FuelAmountEstimate | null {
  if (!(input.area > 0 && input.efficiency > 0)) return null
  const demand = heatDemand(input)
  const efficiency = Math.min(100, input.efficiency) / 100
  if (input.fuel === 'pellets') {
    if (!(input.pelletKwhPerKg > 0)) return null
    const kg = demand / (input.pelletKwhPerKg * efficiency)
    return {
      demand, stacked: 0, solid: 0, loose: 0, tonnes: kg / 1000,
      bags: input.bag > 0 ? wholeUp(kg / input.bag) : 0,
      cost: input.price > 0 ? (kg / 1000) * input.price : 0,
    }
  }
  const species = WOOD_SPECIES[input.species] ?? WOOD_SPECIES[0]
  const moisture = WOOD_MOISTURE[input.moisture] ?? WOOD_MOISTURE[0]
  const stacked = demand / (species.kwhPerStackedM3 * moisture.factor * efficiency)
  return {
    demand, stacked, solid: stacked * STACKED_TO_SOLID, loose: stacked * STACKED_TO_LOOSE,
    tonnes: (stacked * species.kwhPerStackedM3) / WOOD_KWH_PER_KG / 1000 / moisture.factor,
    bags: 0, cost: input.price > 0 ? stacked * input.price : 0,
  }
}

// ---------- Air conditioner size (BTU) ----------

/** Peak heat loss in winter, W per m² of a room with 2.6 m ceilings, by insulation (same order as HOME_INSULATION). */
export const AIRCON_HEATING_W_PER_M2 = [140, 110, 80, 55] as const
/** Peak cooling load in summer, W per m², by insulation. */
export const AIRCON_COOLING_W_PER_M2 = [120, 110, 95, 85] as const

/** Usual split-unit sizes on the Bulgarian market (7000 BTU units are rare): BTU and nominal kW. */
export const AIRCON_SIZES = [
  { btu: 9000, kw: 2.6 },
  { btu: 12000, kw: 3.5 },
  { btu: 18000, kw: 5.3 },
  { btu: 24000, kw: 7 },
] as const

export interface AirconInput {
  area: number
  /** m */
  height: number
  insulation: number
  climate: number
  /** 'both' heats and cools; 'cooling' only cools */
  use: 'both' | 'cooling'
  sunny: boolean
  topFloor: boolean
}

export interface AirconEstimate {
  heatingKw: number
  coolingKw: number
  needKw: number
  needBtu: number
  size: (typeof AIRCON_SIZES)[number] | null
}

export function estimateAircon(input: AirconInput): AirconEstimate | null {
  if (!(input.area > 0 && input.height > 0)) return null
  const index = Math.min(3, Math.max(0, input.insulation))
  const climate = CLIMATE_ZONES[input.climate] ?? CLIMATE_ZONES[1]
  const volume = input.height / 2.6
  const roof = input.topFloor ? 1.15 : 1
  const heatingKw = (input.area * AIRCON_HEATING_W_PER_M2[index] * volume * climate.factor * roof) / 1000
  const coolingKw = (input.area * AIRCON_COOLING_W_PER_M2[index] * volume * (input.sunny ? 1.15 : 1) * roof) / 1000
  const needKw = input.use === 'cooling' ? coolingKw : Math.max(heatingKw, coolingKw)
  return {
    heatingKw, coolingKw, needKw, needBtu: needKw * 3412,
    size: AIRCON_SIZES.find((size) => size.kw >= needKw * 0.9) ?? null,
  }
}
