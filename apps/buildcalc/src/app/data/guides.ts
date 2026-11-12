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
];
