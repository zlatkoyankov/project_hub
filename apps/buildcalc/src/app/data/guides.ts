import { CALCULATORS } from './calculators';

export interface GuideSection {
  title: string;
  paragraphs: string[];
}

/** One worked example. Every number in it must come from utils/calculations.ts: guides.spec.ts recomputes them. */
export interface GuideExample {
  title: string;
  intro: string;
  steps: string[];
  result: string;
}

export interface Guide {
  slug: string;
  calculatorSlug: string;
  kind: string;
  title: string;
  shortTitle: string;
  kicker: string;
  intro: string;
  description: string;
  sections: GuideSection[];
  example: GuideExample;
  mistakes: string[];
  /** Where the figures in the guide come from. Shown with SOURCES_CHECKED. */
  sources: { label: string; href: string }[];
}

const NIST = {
  label: 'NIST Handbook 44, Appendix C: 27 cu ft = 1 cu yd, 144 sq in = 1 sq ft, 1 m² = 10.76391 sq ft, 1 gal = 3.785 L',
  href: 'https://www.nist.gov/document/2026-nist-handbook-44-appendix-c',
};

/** The sources listed on a calculator's page, so a guide cites exactly what its calculator uses. */
const sourcesOf = (slug: string) => CALCULATORS.find((c) => c.slug === slug)?.sources ?? [];

export const GUIDES: Guide[] = [
  {
    slug: 'gravel-calculator-guide', calculatorSlug: 'gravel-calculator', kind: 'gravel',
    title: 'Gravel estimating guide', shortTitle: 'Gravel', kicker: 'LANDSCAPING MATERIALS',
    intro: 'Gravel is measured by volume and usually sold by weight. A good estimate needs both: the cubic yards that fill your area, and the density that turns them into tons.',
    description: 'How to estimate gravel in cubic yards and tons: the formula, a worked example for a garden path, the density to use and common mistakes.',
    sections: [
      { title: 'The formula', paragraphs: ['Length × width gives the area in square feet. Multiply by the depth in feet (inches ÷ 12) for cubic feet, and divide by 27 for cubic yards, because a cubic yard is 3 × 3 × 3 feet. Add your waste allowance to the volume.', 'For weight, multiply the cubic yards by the density in pounds per cubic yard and divide by 2,000 for US tons. Loose gravel, sand and crushed stone weigh about 1.35 US tons per cubic yard (2,700 lb), which is the calculator’s default.'] },
      { title: 'Measure the area and depth', paragraphs: ['Split curved or L-shaped areas into rectangles and add them up. Measure depth as the finished layer you want, not the depth of the hole: if you dig 6 inches and lay 2 inches of base and 4 inches of gravel, enter 4 inches for the gravel and estimate the base on its own.', 'Depth matters more than people expect. Every extra inch over a 120 sq ft path adds about 0.4 cubic yards with a 10% allowance, so decide the depth before you ask for prices.'] },
      { title: 'Use your supplier’s density', paragraphs: ['There is no single weight for “gravel”. Grading, stone type and moisture change it, and wet material weighs more. If the supplier sells by the ton, ask what density they use for that product and enter it in the calculator, in lb per cubic yard or kg per cubic meter.', 'If they sell by the cubic yard or cubic meter, you do not need the density at all: order the volume with your allowance and use the weight only to check that a trailer or a truck can carry it.'] },
    ],
    example: {
      title: 'Worked example: a garden path',
      intro: 'A path 30 ft long and 4 ft wide, 3 inches of gravel, a 10% allowance and the default density of 2,700 lb per cubic yard.',
      steps: [
        'Area: 30 × 4 = 120 sq ft.',
        'Volume: 120 × 3 ÷ 12 = 30 cu ft, and 30 ÷ 27 = 1.11 cu yd.',
        'With 10% allowance: 1.11 × 1.1 = 1.22 cu yd (0.93 m³).',
        'Weight: 1.22 × 2,700 ÷ 2,000 = 1.65 US tons.',
      ],
      result: 'Order about 1.25 cubic yards, or 1.65 tons at the default density. The same path at 2 inches needs 0.81 cu yd and at 4 inches 1.63 cu yd.',
    },
    mistakes: [
      'Entering the depth in feet when the field expects inches, or the other way round. Three inches is 0.25 ft, not 3 ft.',
      'Using a generic density for a product sold by the ton. Ask the supplier for theirs, or the weight can be off by a fair margin.',
      'Forgetting the base layer. A sub-base of crushed stone is a separate material with its own depth and estimate.',
      'Ordering exactly the calculated volume. Uneven ground and spreading losses use some of it, which is what the allowance is for.',
    ],
    sources: [
      NIST,
      { label: 'Aggregate Markets: loose density of gravel, sand and crushed stone, about 1.35 tons per cubic yard', href: 'https://aggregatemarkets.com/en/calculators' },
    ],
  },
  {
    slug: 'paint-calculator-guide', calculatorSlug: 'paint-calculator', kind: 'paint',
    title: 'Paint estimating guide', shortTitle: 'Paint', kicker: 'PAINTING PROJECTS',
    intro: 'Paint is estimated from three numbers: the wall area you will actually paint, the number of coats, and the coverage printed on the can.',
    description: 'How to estimate wall paint in gallons: net wall area, coats and label coverage, with a worked example for a bedroom and common mistakes.',
    sections: [
      { title: 'The formula', paragraphs: ['Gallons = net wall area × coats ÷ coverage per gallon, then round up to whole cans. Net area is the gross wall area minus doors, windows and anything else you will not paint.', 'Sherwin-Williams puts a gallon at about 350 to 400 sq ft per coat. The calculator uses 350, the lower end, so the estimate errs towards enough paint. Use the figure on your own can if it differs.'] },
      { title: 'Measure the walls', paragraphs: ['For a room, add up the widths of all walls (the perimeter) and multiply by the wall height. That gives the gross area in one step. Then subtract the openings: measure each door and window, or use their nominal sizes if they are standard.', 'Small openings can stay in the total as a margin. Ceilings, trim and doors are separate jobs with different paint and often different coverage, so estimate them on their own.'] },
      { title: 'Coats and coverage', paragraphs: ['Two coats are the usual plan for a new colour. A strong colour change, fresh plaster or a porous surface can need a primer or a third coat; the paint’s instructions say which.', 'Coverage on the can assumes a smooth, sealed surface. Rough or textured walls take more paint per square foot, so lower the coverage in the calculator for them.'] },
    ],
    example: {
      title: 'Worked example: a bedroom',
      intro: 'A 14 × 12 ft room with 8 ft walls, one door (3 × 7 ft), two windows (3 × 5 ft each) and two coats.',
      steps: [
        'Perimeter: 14 + 12 + 14 + 12 = 52 ft. Gross wall area: 52 × 8 = 416 sq ft.',
        'Openings: 21 + 15 + 15 = 51 sq ft. Net area: 416 − 51 = 365 sq ft.',
        'Two coats: 365 × 2 = 730 sq ft of coverage.',
        'At 350 sq ft per gallon: 730 ÷ 350 = 2.09 gallons. At 400 sq ft per gallon: 1.83 gallons.',
      ],
      result: 'Buy 3 gallons if your can says 350 sq ft, or 2 gallons if it says 400. The label decides, which is why the calculator lets you change the coverage.',
    },
    mistakes: [
      'Counting the floor area instead of the wall area. A 14 × 12 ft room has 168 sq ft of floor but 416 sq ft of wall.',
      'Forgetting the second coat, which doubles the paint.',
      'Buying for the exact decimal. Paint comes in whole cans, and a few extra ounces are better than a second trip and a colour that does not match.',
      'Using the best-case coverage for a textured or unpainted wall.',
    ],
    sources: [
      { label: 'Sherwin-Williams: a gallon covers about 350 to 400 sq ft', href: 'https://www.sherwin-williams.com/en-us/color/color-tools/paint-calculator' },
      NIST,
    ],
  },
  {
    slug: 'tile-calculator-guide', calculatorSlug: 'tile-calculator', kind: 'tile',
    title: 'Tile estimating guide', shortTitle: 'Tile', kicker: 'FLOORING & TILE',
    intro: 'Tile quantities depend on the area, the tile size, the grout joint and how much material is lost to cuts.',
    description: 'How to estimate floor or wall tile: area, tile plus joint, waste by layout and whole boxes, with a worked bathroom example.',
    sections: [
      { title: 'The formula', paragraphs: ['Tiles = area ÷ area of one tile including its grout joint, plus the waste allowance, rounded up. Boxes = tiles ÷ tiles per box, rounded up again.', 'The joint matters because each tile effectively covers its own face plus half a joint on every side. A 12 in tile with a 1/8 in joint covers 12.125 × 12.125 in, about 1.021 sq ft.'] },
      { title: 'Allow for cuts by layout', paragraphs: ['Tiles are cut at walls and around fixtures, and some break. Tile retailers put the allowance at about 10% for a straight layout, 15% for a diagonal one and up to 20% for herringbone.', 'Large tiles in a small room waste more than the percentage suggests, because each cut leaves an offcut that is too small to reuse. In a room with many corners, go to the upper end.'] },
      { title: 'Buy whole boxes from one lot', paragraphs: ['Tile is sold by the box, so round up. Check that all boxes carry the same batch or shade code: colour and size can vary slightly between production runs.', 'Keep a few spare tiles after the job. A cracked tile is much easier to replace when the spare comes from the same lot.'] },
    ],
    example: {
      title: 'Worked example: a bathroom floor',
      intro: 'An 8 × 5 ft floor, 12 × 12 in tiles, 1/8 in joints, a straight layout with 10% waste and 10 tiles per box.',
      steps: [
        'Area: 8 × 5 = 40 sq ft.',
        'One tile with its joint: 12.125 × 12.125 ÷ 144 = 1.021 sq ft.',
        'Tiles: 40 ÷ 1.021 = 39.2, plus 10% = 43.1, so 44 tiles.',
        'Boxes: 44 ÷ 10 = 4.4, so 5 boxes.',
      ],
      result: 'Plan for 44 tiles in 5 boxes. Laid diagonally with 15% waste the same floor needs 46 tiles, still 5 boxes; herringbone at 20% needs 48.',
    },
    mistakes: [
      'Leaving the grout joint out. With small tiles and wide joints the count changes noticeably.',
      'Using a straight-layout allowance for a diagonal or herringbone pattern.',
      'Mixing boxes from different batches, which can show as a visible change in shade.',
      'Not checking how many tiles a box actually holds. Two boxes of the same size can cover different areas.',
    ],
    sources: [
      { label: 'Tiles UK: 10% waste for a straight layout, 15% diagonal, up to 20% herringbone', href: 'https://tiles.uk.com/how-many-tiles-do-i-need/' },
      { label: 'Buildmat: 10% straight or brick layout, 15% diagonal or herringbone', href: 'https://www.buildmat.com.au/blogs/help-centre/how-to-calculate-how-many-tiles-you-need' },
      NIST,
    ],
  },
  {
    slug: 'concrete-calculator-guide', calculatorSlug: 'concrete-calculator', kind: 'concrete',
    title: 'Concrete estimating guide', shortTitle: 'Concrete', kicker: 'CONCRETE & MASONRY',
    intro: 'A slab estimate is a volume calculation. Getting the thickness, the units and the allowance right avoids a short pour or an expensive over-order.',
    description: 'How to estimate concrete for a slab in cubic yards or 80 lb bags: the formula, a worked shed-slab example and common mistakes.',
    sections: [
      { title: 'The formula', paragraphs: ['Length × width × thickness, all in feet, gives cubic feet. Divide by 27 for cubic yards, the unit ready-mix is ordered in. Thickness is usually in inches, so divide it by 12 first.', 'For bagged concrete, divide the cubic feet by the yield printed on the bag. An 80 lb bag of QUIKRETE Concrete Mix makes about 0.6 cu ft.'] },
      { title: 'Choose the thickness', paragraphs: ['QUIKRETE’s guide for sidewalks and small slabs uses at least 4 inches for walks and 4 to 6 inches for simple slabs, depending on the load. Slabs that carry vehicles, structures or heavy equipment need a design, and local code may set a minimum.', 'Thickened edges, footings and steps are extra volume. Estimate each as its own rectangle and add it: a 12 × 10 ft slab with an edge 8 in wide and 8 in deeper all round adds roughly 0.7 cu yd.'] },
      { title: 'Plan the allowance and the delivery', paragraphs: ['Subgrades are rarely flat, forms bow slightly and some concrete stays in the truck or the mixer. A modest allowance covers this; your supplier can say what is usual for the job.', 'Ready-mix plants often have a minimum load, and bags are practical only for small pours. For anything larger than a small pad, compare the bag count with a delivered load before deciding.'] },
    ],
    example: {
      title: 'Worked example: a shed slab',
      intro: 'A 12 × 10 ft slab, 4 inches thick, with a 10% allowance.',
      steps: [
        'Area: 12 × 10 = 120 sq ft.',
        'Volume: 120 × 4 ÷ 12 = 40 cu ft, and 40 ÷ 27 = 1.48 cu yd.',
        'With 10% allowance: 1.48 × 1.1 = 1.63 cu yd.',
        'In 80 lb bags at 0.6 cu ft each: 40 ÷ 0.6 = 66.7, so 67 bags without allowance, 74 with it.',
      ],
      result: 'Order about 1.63 cubic yards of ready-mix, or 74 bags of 80 lb. At that size a delivered load is usually less work than mixing 74 bags by hand.',
    },
    mistakes: [
      'Multiplying by the thickness in inches instead of feet, which makes the volume twelve times too large.',
      'Dividing cubic feet by 9 instead of 27. Nine converts square feet to square yards, not volume.',
      'Forgetting thickened edges, footings or steps.',
      'Treating the estimate as a design. It does not size reinforcement, the mix or the base; that is for local code and a qualified contractor.',
    ],
    sources: [
      NIST,
      { label: 'QUIKRETE Concrete Mix 80 lb: about 0.6 cu ft per bag', href: 'https://www.pacesupply.com/Product/MORCONCRETE80' },
      { label: 'QUIKRETE: concrete sidewalks and small slabs, 4 in walks and 4 to 6 in slabs', href: 'https://www.quikrete.com/PDFs/Projects/ConcreteSidewalksAndSmallSlabs.pdf' },
    ],
  },
  {
    slug: 'square-footage-calculator-guide', calculatorSlug: 'square-footage-calculator', kind: 'area',
    title: 'Square footage measuring guide', shortTitle: 'Square footage', kicker: 'GENERAL CONSTRUCTION',
    intro: 'Almost every material estimate starts with area. Measuring consistently and breaking a space into simple shapes keeps it accurate.',
    description: 'How to measure square footage: rectangles, L-shaped rooms, feet and inches, and square meters, with worked examples and common mistakes.',
    sections: [
      { title: 'The formula', paragraphs: ['Area of a rectangle = length × width. For any other shape, split it into rectangles that do not overlap, work out each one and add them up.', 'One square meter is 10.76391 square feet and one square foot is 0.0929 square meters. Both factors come from the unit definitions in NIST Handbook 44.'] },
      { title: 'Measure like a builder', paragraphs: ['Measure each wall at floor level and write the numbers down as you go. Rooms are rarely perfectly square, so measure both opposite walls and use the longer one: the extra goes into your margin.', 'Use one unit for the whole room. Convert inches to feet by dividing by 12 before you multiply; 10 ft 6 in is 10.5 ft, not 10.6 ft.'] },
      { title: 'From area to materials', paragraphs: ['Area is the input for flooring, tile, paint and many other materials. Each of them adds its own allowance for cuts and waste, so keep the measured area clean and add the allowance in the material calculator.', 'Measurements on site beat plans. Plans show the design; the room you are buying for is what was actually built.'] },
    ],
    example: {
      title: 'Worked examples',
      intro: 'An L-shaped living room, and a metric room converted to square feet.',
      steps: [
        'Main part: 12 × 10 ft = 120 sq ft.',
        'Alcove: 6 × 4 ft = 24 sq ft.',
        'Total: 120 + 24 = 144 sq ft, which is 13.38 m².',
        'A room of 4 × 3 m is 12 m², which is 12 × 10.76391 = 129.17 sq ft.',
      ],
      result: 'The L-shaped room is 144 sq ft. Enter each rectangle as its own row in the calculator and it adds them and converts the total.',
    },
    mistakes: [
      'Mixing feet and inches in one multiplication, such as 10.6 for 10 ft 6 in.',
      'Overlapping two rectangles in an L-shaped room, which counts the corner twice.',
      'Converting square meters with 3.28 (the factor for length) instead of 10.76 (the factor for area).',
      'Adding waste to the measured area and then again in the material calculator.',
    ],
    sources: [NIST],
  },
  {
    slug: 'mulch-calculator-guide', calculatorSlug: 'mulch-calculator', kind: 'mulch',
    title: 'Mulch estimating guide', shortTitle: 'Mulch', kicker: 'LANDSCAPING MATERIALS',
    intro: 'Mulch is sold by volume. Bed area and depth determine how many cubic yards or bags you need.',
    description: 'How to estimate mulch in cubic yards or bags from bed area and depth, with a worked example for two garden beds and common mistakes.',
    sections: [
      { title: 'The formula', paragraphs: ['Area × depth in feet gives cubic feet; divide by 27 for cubic yards. For bags, divide the cubic feet by the volume printed on the bag and round up.', 'Mississippi State University Extension recommends 2 to 3 inches of mulch for landscape beds. The depth drives the order: 3 inches needs half as much again as 2 inches.'] },
      { title: 'Bags or bulk', paragraphs: ['Bags are labeled in cubic feet and are easy for small beds. Bulk mulch is sold by the cubic yard and is often cheaper for larger areas, but delivery minimums and charges apply.', 'Compare prices per cubic foot, not per bag. Bag sizes differ between brands, and a cubic yard is 27 cubic feet whichever way you buy it.'] },
      { title: 'Curves, trees and top-ups', paragraphs: ['Treat a curved bed as the rectangle around it, or as two or three smaller rectangles. The rectangle slightly overestimates, which acts as a margin.', 'Keep mulch away from trunks and stems. Mulch also settles and breaks down, so beds usually need a thinner top-up later rather than a full new layer.'] },
    ],
    example: {
      title: 'Worked example: two garden beds',
      intro: 'One bed 20 × 4 ft and one 10 × 6 ft, both at 3 inches, no extra allowance.',
      steps: [
        'Area: 20 × 4 + 10 × 6 = 80 + 60 = 140 sq ft.',
        'Volume: 140 × 3 ÷ 12 = 35 cu ft, and 35 ÷ 27 = 1.30 cu yd.',
        'In 2 cu ft bags: 35 ÷ 2 = 17.5, so 18 bags.',
      ],
      result: 'Order 1.30 cubic yards in bulk, or 18 bags of 2 cu ft. With a 10% allowance for curves and settling it is 1.43 cu yd.',
    },
    mistakes: [
      'Dividing by 27 when the mulch is sold in cubic feet. Bags are labeled in cubic feet, so divide the cubic feet by the bag size directly.',
      'Spreading deeper than planned. Four inches instead of three needs a third more mulch.',
      'Piling mulch against trunks and stems.',
      'Comparing bag prices without checking the bag volume.',
    ],
    sources: [
      { label: 'Mississippi State University Extension: 2 to 3 inches of mulch for landscape beds', href: 'https://extension.msstate.edu/news/southern-gardening/2022/use-mulch-for-beauty-and-weed-temperature-control' },
      NIST,
    ],
  },
  {
    slug: 'laminate-flooring-calculator-guide', calculatorSlug: 'laminate-flooring-calculator', kind: 'flooring',
    title: 'Laminate and vinyl plank flooring guide', shortTitle: 'Flooring', kicker: 'FLOORING & TILE',
    intro: 'Floating floors are sold by the box, and each box covers a stated area. The estimate is floor area plus a cutting allowance, rounded up to whole boxes, plus the baseboards around the room.',
    description: 'How to estimate laminate or vinyl plank flooring in boxes, with the cutting allowance, baseboard pieces and a worked example for a 14 × 12 ft room.',
    sections: [
      { title: 'The formula', paragraphs: ['Boxes = floor area × (1 + allowance) ÷ coverage per box, rounded up. The coverage is printed on the box in square feet or square meters: it is the floor the laid planks cover, so the tongue and groove need no adjustment.', 'EGGER recommends ordering about 10% extra laminate for a straight layout. Diagonal or herringbone layouts and rooms with many corners and door frames need more, because more planks are cut and fewer offcuts are reused.'] },
      { title: 'Measure the floor', paragraphs: ['Measure the room wall to wall at floor level. Include the space under doors where the floor will continue, and leave out areas covered by fixed cabinets or a bathtub. Split an L-shaped room into rectangles.', 'Do not subtract the expansion gap along the walls. It is only about the thickness of a spacer and is hidden under the baseboard; the allowance covers it.'] },
      { title: 'Baseboards and trim', paragraphs: ['Baseboard length = the room’s perimeter minus the width of the doorways, plus the same allowance. Divide by the length of one piece and round up. Joints along long walls need connectors in some systems, and baseboards that stop at a door frame need end caps.', 'Doorways to a different floor need a transition strip. Count them separately; they are sold by the piece.'] },
      { title: 'Before you lay it', paragraphs: ['Pergo’s installation guide asks for the planks to acclimatize in the room for 48 hours before installation, in unopened boxes. Plan the delivery with that in mind.', 'Most floating floors need an underlayment unless one is attached to the planks. Estimate it at roughly the floor area and follow the flooring manufacturer’s instructions.'] },
    ],
    example: {
      title: 'Worked example: a 14 × 12 ft bedroom',
      intro: 'Planks in boxes of 20 sq ft, a straight layout with 10% allowance, one 3 ft doorway and baseboards in 8 ft pieces.',
      steps: [
        'Floor area: 14 × 12 = 168 sq ft. With 10%: 184.8 sq ft.',
        'Boxes: 184.8 ÷ 20 = 9.24, so 10 boxes (200 sq ft of flooring).',
        'Perimeter: 2 × (14 + 12) = 52 ft. Minus the doorway and plus 10%: 53.9 ft of baseboard.',
        'Baseboard pieces: 53.9 ÷ 8 = 6.7, so 7 pieces, plus 2 end caps at the door frame.',
      ],
      result: 'Buy 10 boxes and 7 baseboard pieces. Without any allowance it would be 9 boxes, which leaves no room for a damaged plank; even at 15% the room still fits in 10 boxes.',
    },
    mistakes: [
      'Ordering the exact floor area. Every row ends in a cut, and the last plank of a row is rarely reusable in the next.',
      'Buying boxes from different production batches, which can differ slightly in shade.',
      'Forgetting the transition strips at doorways and the end caps where baseboards meet a door frame.',
      'Using a 10% allowance for a herringbone or diagonal layout.',
    ],
    sources: [...sourcesOf('laminate-flooring-calculator')],
  },
  {
    slug: 'drywall-calculator-guide', calculatorSlug: 'drywall-calculator', kind: 'drywall',
    title: 'Drywall estimating guide', shortTitle: 'Drywall', kicker: 'WALLS & CEILINGS',
    intro: 'Drywall is counted in sheets, and the supplies follow from the board area: about one screw per square foot, a known length of tape and a few boxes of compound.',
    description: 'How to estimate drywall sheets, screws, joint tape, compound and studs for a room, with a worked example and the rates behind each number.',
    sections: [
      { title: 'The formula', paragraphs: ['Wall area = room perimeter × wall height. Add the ceiling (length × width) if you are boarding it, subtract doors and windows, add the waste allowance, and divide by the area of one sheet. Round up.', 'A 4 × 8 ft sheet is 32 sq ft, 4 × 10 ft is 40 and 4 × 12 ft is 48. Metric boards such as Knauf’s 1.2 m wide sheets come in lengths of 2.0 to 3.0 m.'] },
      { title: 'Choosing the sheet size', paragraphs: ['Longer sheets mean fewer joints to tape and finish, which saves more time than material. Choose a length that matches the wall height or the room’s length, and check whether you can carry it up the stairs.', 'The count of sheets is an area estimate. Plan the actual layout so that joints are staggered and do not line up with the corners of doors and windows; the allowance pays for those cuts.'] },
      { title: 'Screws, tape and compound', paragraphs: ['With screws every 8 in on the edges and 16 in in the field, as in IRC R702.3.5, a wall takes about one screw per square foot of board. USG puts joint tape at about 370 ft per 1,000 sq ft, and all-purpose compound at about 10 gallons per 1,000 sq ft, which is one 4.5-gallon box for every 450 sq ft.', 'These rates are for a standard finish. A higher finish level or a skim coat over the whole surface takes more compound.'] },
      { title: 'Studs and track', paragraphs: ['For a new wall the calculator counts studs at your spacing along each wall, plus one at each end, and two runs of track (floor and ceiling) around the room. Real framing needs extra studs at door and window openings, corners and anywhere a cabinet will hang.'] },
    ],
    example: {
      title: 'Worked example: walls and ceiling of a 12 × 10 ft room',
      intro: 'Walls 8 ft high, one door and one window (36 sq ft together), the ceiling included and a 10% allowance.',
      steps: [
        'Walls: 2 × (12 + 10) × 8 = 352 sq ft. Ceiling: 12 × 10 = 120 sq ft.',
        'Minus openings: 352 + 120 − 36 = 436 sq ft. With 10%: 479.6 sq ft.',
        '4 × 8 ft sheets: 479.6 ÷ 32 = 15.0, so 15 sheets. With 4 × 12 ft sheets: 10 sheets.',
        'Supplies: about 436 screws, 161 ft of tape and 1 box of compound.',
      ],
      result: 'Buy 15 sheets of 4 × 8 ft, or 10 of 4 × 12 ft, with about 436 screws, 161 ft of tape and one box of compound. Studs at 16 in for new walls: 38.',
    },
    mistakes: [
      'Forgetting the ceiling, which in a small room is a third of the board.',
      'Subtracting every small opening. Offcuts from small openings are rarely usable, so many installers subtract only large ones.',
      'Buying sheets too long to get into the room.',
      'Underestimating compound for a high finish level.',
    ],
    sources: [...sourcesOf('drywall-calculator')],
  },
  {
    slug: 'tile-adhesive-grout-calculator-guide', calculatorSlug: 'tile-adhesive-grout-calculator', kind: 'adhesive',
    title: 'Tile adhesive and grout guide', shortTitle: 'Tile adhesive and grout', kicker: 'FLOORING & TILE',
    intro: 'Tile adhesive is used by area, and the amount depends on the trowel notch. Grout depends on the tile size, the joint width and the tile’s thickness.',
    description: 'How much tile adhesive and grout you need: consumption by trowel notch, the grout formula and a worked example for 10 m² of 30 × 60 cm tile.',
    sections: [
      { title: 'Adhesive: area × consumption for the notch', paragraphs: ['A notched trowel leaves ridges of a known height, so the data sheet can give the consumption per notch. For Ceresit CM 11, a cement adhesive, it is about 2.0 kg/m² with a 4 mm notch, 2.7 with 6 mm, 3.4 with 8 mm, 4.2 with 10 mm and 4.8 with 12 mm.', 'Bigger tiles need a bigger notch to get full contact. The usual rule from the data sheets: up to 10 cm a 4 mm notch, up to 15 cm 6 mm, up to 25 cm 8 mm, up to 31 cm 10 mm and larger tiles 12 mm. The calculator picks the notch from the tile size unless you choose one.'] },
      { title: 'Grout: the joint volume', paragraphs: ['Grout per m² = (tile length + tile width) ÷ (length × width) × joint width × tile thickness × density, with sizes in millimeters. SikaCeram gives this formula with a density of about 1.6 kg per liter.', 'Small tiles with wide joints take far more grout than large tiles with narrow ones, because there is much more joint per square meter. That is why grout can be a few hundred grams per m² or more than a kilogram.'] },
      { title: 'Different products', paragraphs: ['Flexible and lightweight adhesives use less per notch than a standard cement adhesive. Kiesel Servoflex K SuperTec, for example, gives about 1.0, 1.6 and 2.2 kg/m² for its notch sizes. Always use your product’s data sheet; the calculator lets you choose the notch and change the bag sizes.'] },
    ],
    example: {
      title: 'Worked example: 10 m² of 30 × 60 cm tile',
      intro: 'Tiles 9 mm thick, 3 mm joints, a 10% allowance, adhesive in 25 kg bags and grout in 5 kg bags.',
      steps: [
        'Area with 10%: 10 × 1.1 = 11 m².',
        'Notch: the longest side is 60 cm, so a 12 mm notch at about 4.8 kg/m².',
        'Adhesive: 11 × 4.8 = 52.8 kg, which is 3 bags of 25 kg.',
        'Grout: (300 + 600) ÷ (300 × 600) × 3 × 9 × 1.6 = 0.216 kg/m², and 11 × 0.216 = 2.38 kg, so 1 bag of 5 kg.',
      ],
      result: 'Buy 3 bags of adhesive and 1 bag of grout. The same floor in 10 × 10 cm tiles with the same joints would need four times as much grout per m²: 0.864 kg.',
    },
    mistakes: [
      'Using a small notch for large tiles to save adhesive, which leaves hollow spots under the tile.',
      'Taking the grout figure from the bag without checking the tile size and joint it assumes.',
      'Forgetting that a wall and a floor with different tiles need separate calculations.',
      'Mixing more adhesive than you can use within its open time, which wastes the rest of the batch.',
    ],
    sources: [...sourcesOf('tile-adhesive-grout-calculator')],
  },
  {
    slug: 'wallpaper-calculator-guide', calculatorSlug: 'wallpaper-calculator', kind: 'wallpaper',
    title: 'Wallpaper estimating guide', shortTitle: 'Wallpaper', kicker: 'PAINTING PROJECTS',
    intro: 'Wallpaper is hung in full-height strips, so the number of rolls depends on how many strips you need and how many whole strips fit in one roll, not on the wall area alone.',
    description: 'How many rolls of wallpaper you need: strips, strips per roll, pattern repeat and trim, with a worked example for a 12 × 10 ft room.',
    sections: [
      { title: 'Why strips, not area', paragraphs: ['A roll that is 33 ft long does not give 33 ft of wall. Each strip is cut to the wall height plus a trim allowance, and whatever is left at the end of the roll is usually too short for another strip. Etoffe and other makers count wallpaper in drops for this reason.', 'Dividing the wall area by the roll’s area therefore underestimates: for the room below it gives 6 rolls instead of 8.'] },
      { title: 'The formula', paragraphs: ['Strips = (room perimeter − width of doors and windows) ÷ roll width, rounded up. Strip length = wall height, rounded up to whole pattern repeats, plus trim. Strips per roll = roll length ÷ strip length, rounded down. Rolls = strips ÷ strips per roll, rounded up.', 'Morris & Co recommends about 10 cm (4 in) of trim per drop for cutting at the ceiling and the skirting, which is what the calculator adds.'] },
      { title: 'Pattern repeat', paragraphs: ['With a patterned paper each strip has to start at the same point in the pattern, so its length is rounded up to whole repeats. A large repeat can turn three strips per roll into two, which changes the order by a third.', 'Papers without a pattern, or with a random match, need no repeat: enter 0. Buy one spare roll from the same batch number, because colour can vary between batches.'] },
    ],
    example: {
      title: 'Worked example: a 12 × 10 ft room',
      intro: 'Walls 8 ft high, one door and one window (36 sq ft together), rolls 20.5 in wide and 33 ft long.',
      steps: [
        'Perimeter: 2 × (12 + 10) = 44 ft. The openings are about 36 ÷ 8 = 4.5 ft wide.',
        'Strips: (44 − 4.5) × 12 ÷ 20.5 = 23.1, so 24 strips.',
        'Strip length: 8 ft + 4 in of trim = 8.33 ft. Strips per roll: 33 ÷ 8.33 = 3.96, so 3 whole strips.',
        'Rolls: 24 ÷ 3 = 8 rolls.',
      ],
      result: 'Buy 8 rolls plus one spare from the same batch. Without deducting the door and window it would be 26 strips and 9 rolls; with a 21 in pattern repeat each strip grows to 9.08 ft, but 3 still fit in a roll.',
    },
    mistakes: [
      'Dividing the wall area by the roll area, which ignores the waste at the end of each roll.',
      'Forgetting the pattern repeat on a patterned paper.',
      'Buying rolls from different batches.',
      'Measuring the height at one point only. Old rooms are rarely the same height all round; use the highest point.',
    ],
    sources: [...sourcesOf('wallpaper-calculator')],
  },
  {
    slug: 'screed-plaster-calculator-guide', calculatorSlug: 'screed-plaster-calculator', kind: 'screed',
    title: 'Screed, floor leveler and plaster guide', shortTitle: 'Screed and plaster', kicker: 'CONCRETE & MASONRY',
    intro: 'Bagged screed, self-leveling compound and plaster are estimated the same way: area × thickness × the product’s consumption per millimeter.',
    description: 'How many bags of screed, self-leveling compound or plaster you need: consumption per mm, a worked example and the mistakes that leave you short.',
    sections: [
      { title: 'The formula', paragraphs: ['Dry mix (kg) = area (m²) × thickness (mm) × consumption (kg per m² per mm). Add an allowance, divide by the bag weight and round up. In US units the calculator converts square feet and inches for you.', 'The consumption is on every data sheet. Baumit gives its Solido E225 cement screed at about 20 kg/m² per cm, which is 2.0 per mm. Ceresit CN 68 and Baumit Nivello Quattro self-leveling compounds are about 1.5 kg/m² per mm; the calculator uses 1.6 to stay on the safe side. Knauf MP 75 gypsum plaster is about 10 kg/m² at 10 mm, or 1.0 per mm.'] },
      { title: 'Measure the real thickness', paragraphs: ['Floors are rarely flat, so the average thickness is what counts. Set a laser or a long level, measure the depth at several points across the room and take the average; the deepest point alone overestimates, the shallowest underestimates.', 'Each product has a minimum and maximum layer thickness on its data sheet. Outside that range it may crack or not cure properly, so choose the product for the thickness you have.'] },
      { title: 'Bags and time', paragraphs: ['Self-leveling compound has to be poured in one go, so all the bags should be on site and someone should be mixing while another pours. Running out halfway leaves a visible joint.', 'Screed needs time to dry before the floor covering goes down. The data sheet says how long to wait; plan the job around it.'] },
    ],
    example: {
      title: 'Worked examples: a 12 m² floor',
      intro: 'A 12 m² room, 25 kg bags and a 5% allowance.',
      steps: [
        'Cement screed 50 mm thick: 12 × 50 × 2.0 = 1,200 kg, plus 5% = 1,260 kg, which is 50.4, so 51 bags.',
        'Self-leveling compound 5 mm thick: 12 × 5 × 1.6 = 96 kg, plus 5% = 100.8 kg, so 5 bags.',
      ],
      result: 'Screed: 51 bags. Leveler: 5 bags. The leveler is a good example of rounding: 100.8 kg is just over 4 bags, so the fifth bag is mostly spare, which is welcome for a pour that cannot stop.',
    },
    mistakes: [
      'Using the deepest point as the thickness for the whole floor.',
      'Taking consumption for a different product. A cement screed is about twice as heavy per millimeter as gypsum plaster.',
      'Mixing up centimeters and millimeters: 5 cm is 50 mm, which needs ten times as much as 5 mm.',
      'Starting a self-leveling pour without all the bags on site.',
    ],
    sources: [...sourcesOf('screed-plaster-calculator')],
  },
  {
    slug: 'insulation-board-calculator-guide', calculatorSlug: 'insulation-board-calculator', kind: 'insulation',
    title: 'Insulation board estimating guide', shortTitle: 'Insulation boards', kicker: 'WALLS & CEILINGS',
    intro: 'Facade insulation is counted in boards, and the system around it — adhesive, base coat, mesh and anchors — follows from the area covered.',
    description: 'How to estimate EPS, XPS or mineral wool boards and the ETICS supplies (adhesive, base coat, mesh, anchors), with a worked example for a house facade.',
    sections: [
      { title: 'The formula', paragraphs: ['Boards = (wall area − doors and windows) × (1 + allowance) ÷ area of one board, rounded up. A 1 × 0.5 m EPS facade board is 0.5 m², a 1.25 × 0.6 m XPS board 0.75 m², a 1.2 × 0.6 m mineral wool slab 0.72 m².', 'Window reveals are insulated too, with thinner strips. Add their area if you are doing them, or keep a larger allowance.'] },
      { title: 'The supplies', paragraphs: ['For an external insulation system (ETICS or EIFS) the calculator uses Ceresit’s rates: about 5.0 kg/m² of adhesive to fix the boards and 4.0 kg/m² of base coat over them (CT 85), and about 1.1 m² of reinforcing mesh per m² to allow for overlaps (CT 325).', 'European approvals for these systems, such as ETA 22/0366, require at least 6 anchors per m², and 8 on buildings over 24 m. Corners and edges usually need more; follow the system’s fixing plan.'] },
      { title: 'Thickness is a separate decision', paragraphs: ['The calculator counts boards for a thickness you choose; it does not size the insulation. That depends on the climate, the wall and the energy rules where you live. Check the U-value you need with a designer or the local requirements, then use the calculator for the quantities.'] },
    ],
    example: {
      title: 'Worked example: a house facade',
      intro: '120 m² of wall with 18 m² of windows and doors, 1 × 0.5 m EPS boards 10 cm thick, a 5% allowance.',
      steps: [
        'Area to insulate: 120 − 18 = 102 m². With 5%: 107.1 m².',
        'Boards: 107.1 ÷ 0.5 = 214.2, so 215 boards (10.75 m³ of EPS at 10 cm).',
        'Adhesive: 102 × 5.0 = 510 kg. Base coat: 102 × 4.0 = 408 kg.',
        'Mesh: 102 × 1.1 = 112.2 m². Anchors: 102 × 6 = 612.',
      ],
      result: 'Plan for 215 boards, about 510 kg of adhesive (21 bags of 25 kg), 408 kg of base coat, 113 m² of mesh and at least 612 anchors.',
    },
    mistakes: [
      'Forgetting the window reveals.',
      'Using the minimum number of anchors everywhere, including corners and tall walls where the fixing plan asks for more.',
      'Counting the boards but not the system: adhesive and base coat weigh several times as much as the boards.',
      'Choosing the thickness from the calculator instead of from the energy requirements.',
    ],
    sources: [...sourcesOf('insulation-board-calculator')],
  },
  {
    slug: 'brick-block-calculator-guide', calculatorSlug: 'brick-block-calculator', kind: 'masonry',
    title: 'Brick and block estimating guide', shortTitle: 'Bricks and blocks', kicker: 'CONCRETE & MASONRY',
    intro: 'The number of bricks or blocks comes from the face of one unit plus its mortar joint. Mortar is harder: the theory and the bag on site rarely agree.',
    description: 'How many bricks or blocks per square foot or m², how much mortar, and why bags run out sooner than the theory says. With a worked example.',
    sections: [
      { title: 'The formula', paragraphs: ['Units per area = 1 ÷ ((unit length + joint) × (unit height + joint)). A modular brick (7-5/8 × 2-1/4 in) with 3/8 in joints is about 6.9 per sq ft; the Brick Industry Association’s Technical Note 10 gives 6.75 for the same brick in its tables. An 8 × 16 in concrete block is 1.125 per sq ft.', 'In metric, a UK brick of 215 × 65 mm with 10 mm joints is about 60 per m² in a half-brick wall (Travis Perkins), and a Porotherm 25 clay block about 11 per m² (Wienerberger’s data sheet). Blocks with interlocking ends and thin-bed systems have no mortar in the vertical joints.'] },
      { title: 'Mortar: theory and practice', paragraphs: ['The calculator works out the volume of the joints through the wall’s depth, which is the theoretical minimum. On site some mortar always falls, is scraped off or stiffens in the tub.', 'QUIKRETE rates an 80 lb bag of Mason Mix at up to 37 bricks or 13 blocks. For a few hundred bricks that is about twice the theoretical joint volume, so buy closer to the practical figure and return unopened bags.'] },
      { title: 'Packs and openings', paragraphs: ['Bricks are sold in packs (Travis Perkins sells 500, MKM 370 for some lines). Round up to whole packs if you are buying them, and keep the spares: bricks from a later batch rarely match.', 'Subtract doors and windows from the wall area, but remember that lintels and the bricks cut around openings take extra; that is what the allowance is for.'] },
    ],
    example: {
      title: 'Worked example: a garden wall',
      intro: 'A wall 20 ft long and 6 ft high in modular brick with 3/8 in joints, a 5% allowance and mortar bags that make 0.6 cu ft each.',
      steps: [
        'Area: 20 × 6 = 120 sq ft.',
        'Bricks: 120 × 6.86 = 823 before waste, and 864 with 5%.',
        'Mortar in the joints: about 6.97 cu ft with the allowance, which is 12 bags at 0.6 cu ft.',
        'By QUIKRETE’s practical rate of 37 bricks per bag: 864 ÷ 37 = 23.4, so 24 bags.',
      ],
      result: 'Buy 864 bricks and plan for 12 to 24 bags of mortar: the theoretical figure is the floor, the bag rating is closer to what a mason uses. Buy near the higher number and return the bags you do not open.',
    },
    mistakes: [
      'Counting bricks from the brick size without the joint, which overestimates by about a fifth for small bricks.',
      'Trusting the theoretical mortar volume. Real use is higher.',
      'Using single-skin numbers for a wall two bricks thick. A one-brick wall needs twice the bricks of a half-brick wall.',
      'Buying the exact count of a brick that may not be available in the same batch later.',
    ],
    sources: [...sourcesOf('brick-block-calculator')],
  },
];
