export type CalculatorKind = 'gravel' | 'paint' | 'tile' | 'concrete' | 'area' | 'mulch' | 'flooring' | 'drywall' | 'adhesive' | 'wallpaper' | 'screed' | 'insulation';

export interface CalculatorInfo {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  description: string;
  intro: string;
  kind: CalculatorKind;
  icon: string;
  keywords: string[];
  example: string;
  formula: string;
  faqs: { question: string; answer: string }[];
  /** Path of the Bulgarian version on the hub, for hreflang links. */
  bg?: string;
}

export const CALCULATORS: CalculatorInfo[] = [
  {
    slug: 'gravel-calculator', title: 'Gravel Calculator', shortTitle: 'Gravel', category: 'Landscaping',
    description: 'Estimate gravel volume, weight, and material cost for a driveway, path, or garden bed.',
    intro: 'Plan a gravel delivery with a practical estimate of volume and weight. Enter your project dimensions and adjust the example density to match your supplier’s material.',
    kind: 'gravel', icon: 'gravel', keywords: ['stone', 'driveway', 'aggregate', 'rock', 'tons'],
    example: 'A 20 ft × 10 ft area at 3 in deep holds about 1.85 cubic yards before waste.',
    formula: 'Length × width gives area. Area × depth in feet gives cubic feet; divide by 27 for cubic yards. Weight uses your entered density, and waste is added to volume.',
    faqs: [
      { question: 'How much does a cubic yard of gravel weigh?', answer: 'It varies by aggregate, grading, moisture, and compaction. Use a supplier-provided density for a better weight estimate; the default is only an example.' },
      { question: 'How much extra gravel should I order?', answer: 'A waste allowance can account for uneven ground and handling. The right amount depends on site conditions, so confirm your depth and quantity with the supplier.' },
    ],
  },
  {
    slug: 'paint-calculator', title: 'Paint Calculator', shortTitle: 'Paint', category: 'Painting',
    description: 'Estimate paint coverage and the number of gallons needed for your walls.',
    intro: 'Estimate paint for rectangular walls, subtract doors and windows, and plan for multiple coats. Check the label for the coverage of your exact paint.',
    kind: 'paint', icon: 'paint', keywords: ['walls', 'gallons', 'coverage', 'painting', 'coats'],
    example: 'A 12 ft × 8 ft wall is 96 square feet before subtracting openings.',
    formula: 'Net wall area × coats ÷ coverage per gallon = estimated gallons. Whole-gallon purchasing rounds that quantity up.',
    faqs: [
      { question: 'How many coats of paint should I plan for?', answer: 'Two coats are common, but coverage depends on color change, surface condition, primer, and the product. Follow the paint manufacturer’s instructions.' },
      { question: 'Does the calculator include ceilings and trim?', answer: 'No. Add each wall area to the dimensions and openings inputs as appropriate; ceilings, trim, and unusual surfaces need separate estimates.' },
    ],
  },
  {
    slug: 'tile-calculator', title: 'Tile Calculator', shortTitle: 'Tile', category: 'Flooring & Tile',
    description: 'Calculate approximate tile quantity and boxes for a rectangular floor or wall.',
    intro: 'Estimate tiles for a simple rectangular layout, including a configurable waste allowance. Complex patterns and irregular spaces require additional planning.',
    kind: 'tile', icon: 'tile', keywords: ['floor', 'bathroom', 'boxes', 'ceramic', 'backsplash'],
    example: 'A 10 ft × 12 ft room has 120 square feet of floor area before waste.',
    formula: 'Room area ÷ tile face area gives the base tile count. Apply waste, then round tiles and boxes up to whole units.',
    faqs: [
      { question: 'Does tile spacing change the estimate?', answer: 'Grout spacing is included as an approximate addition to each tile’s face dimensions. Real layouts can differ at edges and around cuts.' },
      { question: 'Does this estimate account for tile patterns?', answer: 'No. The estimate is for a basic rectangular layout and does not account for diagonal layouts, intricate patterns, or irregular rooms.' },
    ],
  },
  {
    slug: 'concrete-calculator', title: 'Concrete Calculator', shortTitle: 'Concrete', category: 'Concrete & Masonry',
    description: 'Estimate concrete volume for a slab and optionally calculate material cost.',
    intro: 'Estimate the volume of concrete for a rectangular slab. The result is a planning estimate, not a structural design or placement specification.',
    kind: 'concrete', icon: 'concrete', keywords: ['slab', 'cement', 'patio', 'cubic yards', 'foundation'],
    example: 'A 10 ft × 10 ft slab that is 4 in thick is about 1.23 cubic yards before waste.',
    formula: 'Length × width × thickness in feet gives cubic feet; divide by 27 to convert to cubic yards. Apply waste to the volume.',
    faqs: [
      { question: 'How much concrete should I order?', answer: 'Use the adjusted volume as a starting estimate, then confirm the order quantity with your concrete supplier and account for site conditions.' },
      { question: 'Does this calculator size a foundation?', answer: 'No. It estimates volume only and does not replace structural engineering, code requirements, reinforcement design, or local construction guidance.' },
    ],
  },
  {
    slug: 'square-footage-calculator', title: 'Square Footage Calculator', shortTitle: 'Square footage', category: 'General Construction',
    description: 'Add multiple rectangular rooms or spaces to find their combined square footage.',
    intro: 'Add rectangular areas one at a time to total a home, room, or project footprint. Choose feet or inches for each measurement.',
    kind: 'area', icon: 'area', keywords: ['room', 'square feet', 'floor area', 'measurement', 'square meters'],
    example: 'A 12 ft × 10 ft room is 120 square feet.',
    formula: 'For each rectangle, multiply length by width. Convert inch measurements to feet first, then add each area.',
    faqs: [
      { question: 'Can I combine several rooms?', answer: 'Yes. Add a separate row for each rectangular space; the total is the sum of all room areas.' },
      { question: 'Does this handle L-shaped rooms?', answer: 'Not directly. Divide an irregular room into non-overlapping rectangles and add each section as a separate area.' },
    ],
  },
  {
    slug: 'mulch-calculator', title: 'Mulch Calculator', shortTitle: 'Mulch', category: 'Landscaping',
    description: 'Estimate mulch volume for garden beds and landscaping areas.',
    intro: 'Estimate mulch in cubic feet and cubic yards from the bed dimensions and planned depth. Depth recommendations vary by material and use.',
    kind: 'mulch', icon: 'mulch', keywords: ['garden', 'landscape', 'cubic yards', 'bark', 'beds'],
    example: 'A 10 ft × 10 ft bed at 3 in deep holds about 0.93 cubic yards before waste.',
    formula: 'Length × width gives area. Multiply by depth in feet for cubic feet, divide by 27 for cubic yards, then apply waste.',
    faqs: [
      { question: 'What mulch depth should I use?', answer: 'The appropriate depth depends on mulch type, plants, and the purpose of the layer. Follow local horticultural guidance and avoid piling mulch against stems or trunks.' },
      { question: 'How many bags are in a cubic yard?', answer: 'Bag volumes vary. Divide the required cubic feet by the volume printed on the bag to estimate the number of bags, rounding up.' },
    ],
  },
  {
    slug: 'laminate-flooring-calculator', bg: '/bg/kalkulator-laminat/', title: 'Laminate Flooring Calculator', shortTitle: 'Laminate flooring', category: 'Flooring & Tile',
    description: 'Work out how many boxes of laminate or vinyl plank flooring you need for a room, with waste and cost.',
    intro: 'Enter the room size and the coverage printed on the box. The estimate adds a waste allowance for cuts and rounds up to whole boxes.',
    kind: 'flooring', icon: 'flooring', keywords: ['laminate', 'vinyl plank', 'LVP', 'floor', 'boxes', 'hardwood', 'underlayment'],
    example: 'A 14 ft × 12 ft room is 168 square feet of floor before waste.',
    formula: 'Length × width gives the floor area. Add the waste allowance, divide by the coverage per box and round up to whole boxes.',
    faqs: [
      { question: 'How much extra laminate should I buy?', answer: 'Around 10% is a common allowance for a straight layout in a simple room. Diagonal or herringbone layouts and rooms with many corners need more. Keep a spare box for future repairs.' },
      { question: 'Do I need underlayment?', answer: 'Most floating floors need an underlayment unless one is attached to the planks. Plan for roughly the floor area and follow the flooring manufacturer’s instructions.' },
    ],
  },
  {
    slug: 'drywall-calculator', bg: '/bg/kalkulator-gipsokarton/', title: 'Drywall Calculator', shortTitle: 'Drywall', category: 'General Construction',
    description: 'Estimate drywall sheets for the walls and ceiling of a room, minus doors and windows, with waste and cost.',
    intro: 'Enter the room size and wall height, subtract doors and windows, and choose a sheet size. The estimate adds waste and rounds up to whole sheets.',
    kind: 'drywall', icon: 'drywall', keywords: ['plasterboard', 'gypsum board', 'sheetrock', 'walls', 'ceiling', 'sheets'],
    example: 'A 12 ft × 10 ft room with 8 ft walls has 352 square feet of wall before openings.',
    formula: 'Room perimeter × wall height gives the wall area; add the ceiling if needed and subtract openings. Add waste, divide by the sheet area and round up.',
    faqs: [
      { question: 'Should I subtract doors and windows?', answer: 'Subtracting them gives the net area. Many installers subtract only large openings, because offcuts from small ones are rarely usable; the waste allowance covers the rest.' },
      { question: 'Which sheet size should I use?', answer: 'Larger sheets mean fewer joints to tape but are heavier to handle. Choose a length that matches your wall height where possible and check what your supplier stocks.' },
    ],
  },
  {
    slug: 'tile-adhesive-grout-calculator', bg: '/bg/lepilo-i-fuga/', title: 'Tile Adhesive & Grout Calculator', shortTitle: 'Tile adhesive & grout', category: 'Flooring & Tile',
    description: 'Estimate bags of tile adhesive (thinset) and grout from the area, tile size, joint width and trowel notch.',
    intro: 'Enter the area to tile, the tile size and thickness and the joint width. The estimate picks a trowel notch for the tile size, adds waste and rounds up to whole bags.',
    kind: 'adhesive', icon: 'tile', keywords: ['thinset', 'mortar', 'grout', 'tile adhesive', 'trowel', 'bags'],
    example: 'Grout for 12 × 12 in tiles with 1/8 in joints, 3/8 in thick, is about 0.32 kg per m² (0.065 lb per sq ft).',
    formula: 'Adhesive = area × the usual consumption for the trowel notch. Grout per m² = (tile length + width) ÷ (length × width) × joint width × tile thickness × 1.6, with sizes in mm. Waste is added and bags are rounded up.',
    faqs: [
      { question: 'Which trowel notch should I use?', answer: 'Bigger tiles need a deeper notch so the adhesive covers the whole back of the tile. Leave “Suggest from tile size” on, or pick the notch your adhesive’s data sheet recommends.' },
      { question: 'Why does grout depend on tile size?', answer: 'Small tiles have many more joints per square foot, so mosaics use far more grout than large-format tiles with the same joint width.' },
    ],
  },
  {
    slug: 'wallpaper-calculator', bg: '/bg/kalkulator-tapeti/', title: 'Wallpaper Calculator', shortTitle: 'Wallpaper', category: 'Paint & Finishes',
    description: 'Estimate rolls of wallpaper for a room from the wall size, roll size and pattern repeat, counted strip by strip.',
    intro: 'Enter the room size and wall height, doors and windows, and the size of one roll. The estimate counts the strips you can cut from each roll, allowing for the pattern repeat.',
    kind: 'wallpaper', icon: 'paint', keywords: ['wall covering', 'rolls', 'pattern repeat', 'drop', 'strips', 'feature wall'],
    example: 'A 12 ft × 10 ft room with 8 ft walls needs about 25 strips of 20.5 in wallpaper, or 9 rolls of 33 ft.',
    formula: 'Strips = (room perimeter − opening width) ÷ roll width. Strips per roll = roll length ÷ (wall height in whole pattern repeats + trim). Rolls = strips ÷ strips per roll, rounded up.',
    faqs: [
      { question: 'Why not just divide the wall area by the roll area?', answer: 'Wallpaper is hung in full-height strips, and the offcut at the end of each roll is often too short for another strip. Counting strips per roll is what decides how many rolls you need.' },
      { question: 'What is a pattern repeat?', answer: 'The distance after which the pattern repeats down the roll. Each strip has to start at the same point in the pattern, so strips are cut in whole repeats and a large repeat wastes more paper.' },
    ],
  },
  {
    slug: 'screed-plaster-calculator', bg: '/bg/zamazka-i-mazilka/', title: 'Screed & Plaster Calculator', shortTitle: 'Screed & plaster', category: 'Concrete & Masonry',
    description: 'Estimate bags of floor screed, self-leveling compound or gypsum plaster from the area, thickness and the mix’s consumption.',
    intro: 'Enter the area and the average thickness, and choose the material. The estimate multiplies by the consumption per millimeter from manufacturers’ data sheets, adds waste and rounds up to whole bags.',
    kind: 'screed', icon: 'concrete', keywords: ['floor leveler', 'self-leveling', 'underlayment', 'screed', 'plaster', 'bags', 'thickness'],
    example: 'A 15 m² floor with 40 mm of cement screed takes about 1,200 kg of dry mix before waste.',
    formula: 'Dry mix = area (m²) × thickness (mm) × consumption (kg per m² per mm). Add waste, divide by the bag weight and round up.',
    faqs: [
      { question: 'How do I measure the thickness of an uneven floor?', answer: 'Use the average. Check the level at several points, for example with a long straightedge or a laser, and average the gaps. The calculator works with one average thickness.' },
      { question: 'Where do I find the consumption?', answer: 'On the bag or the product data sheet, usually as kg per m² per mm (or per cm). Enter it as a custom consumption to match your product exactly.' },
    ],
  },
  {
    slug: 'insulation-board-calculator', bg: '/bg/kalkulator-izolatsiya/', title: 'Insulation Board Calculator', shortTitle: 'Insulation boards', category: 'General Construction',
    description: 'Estimate rigid foam or mineral wool boards for a wall, and the adhesive, base coat, mesh and anchors for exterior insulation (EIFS).',
    intro: 'Enter the wall area, subtract doors and windows, and choose a board size and thickness. Optionally add the supplies for an exterior insulation system.',
    kind: 'insulation', icon: 'drywall', keywords: ['rigid foam', 'EPS', 'XPS', 'mineral wool', 'EIFS', 'ETICS', 'facade', 'boards'],
    example: '85 m² of wall with 1 × 0.5 m boards needs about 179 boards with 5% waste.',
    formula: 'Boards = (wall area − openings) × (1 + waste) ÷ board area, rounded up. Supplies use typical rates per m² of board.',
    faqs: [
      { question: 'How thick should the insulation be?', answer: 'That depends on your climate, the wall and local energy rules. This calculator counts boards for a thickness you choose; it does not size the insulation.' },
      { question: 'Are the adhesive and anchor figures exact?', answer: 'No. They are typical values from a common system (Ceresit CT 85) and a usual six anchors per m². Wind load, building height and the wall material change the anchor pattern, so follow the system manufacturer or your designer.' },
    ],
  },
];

export const FEATURED_SLUGS = [
  'gravel-calculator', 'paint-calculator', 'tile-calculator',
  'concrete-calculator', 'square-footage-calculator', 'mulch-calculator',
  'laminate-flooring-calculator', 'drywall-calculator', 'tile-adhesive-grout-calculator', 'wallpaper-calculator', 'screed-plaster-calculator', 'insulation-board-calculator',
];

export const CATEGORIES = [...new Set(CALCULATORS.map((calculator) => calculator.category))];
