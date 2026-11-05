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
