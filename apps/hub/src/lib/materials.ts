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

/** Notched-trowel sizes with typical cement adhesive use (kg/m²), from Ceresit CM 11's data sheet. */
export const TROWEL_NOTCHES = [
  { mm: 4, kgPerM2: 2.0 },
  { mm: 6, kgPerM2: 2.7 },
  { mm: 8, kgPerM2: 3.4 },
  { mm: 10, kgPerM2: 4.2 },
  { mm: 12, kgPerM2: 4.8 },
]

/** Notch by the tile's longest side in cm: the usual rule from adhesive data sheets. */
export const suggestedNotch = (longestCm: number) => (longestCm <= 10 ? 0 : longestCm <= 15 ? 1 : longestCm <= 25 ? 2 : longestCm <= 31 ? 3 : 4)

/** Grout in kg/m²: (L + W) / (L × W) × joint width × joint depth × 1.6, all in mm. */
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

/** Dry mix per m² for each mm of thickness, from manufacturers' data sheets. */
export const SCREED_MATERIALS = [
  { label: 'Циментова замазка', kgPerM2PerMm: 2.0, bag: 25 },
  { label: 'Саморазливна замазка', kgPerM2PerMm: 1.8, bag: 25 },
  { label: 'Гипсова мазилка', kgPerM2PerMm: 0.9, bag: 30 },
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
