export type CalculatorKind = 'gravel' | 'paint' | 'tile' | 'concrete' | 'area' | 'mulch' | 'flooring' | 'drywall' | 'adhesive' | 'wallpaper' | 'screed' | 'insulation' | 'masonry';

export interface CalculatorInfo {
  slug: string;
  title: string;
  /** Title for the browser tab and search results: the name plus what it answers, under about 48 characters so it
   *  fits with " | BuildCalc". The page heading stays `title`. */
  seoTitle: string;
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
  /** Where the default figures come from, shown under the calculation. */
  sources?: { label: string; href: string }[];
  /** The answer in two or three sentences with one worked example, shown under the intro. Search engines and AI
   *  assistants quote this paragraph, so every number in it must come from utils/calculations.ts (see the spec). */
  answer?: string;
}

/** Date the sources and figures were last checked (ISO). Used in dateModified. */
export const SOURCES_CHECKED_ISO = '2026-11-12';
/** The same date as shown on the page, e.g. "7 November 2026". */
export const SOURCES_CHECKED = new Date(SOURCES_CHECKED_ISO).toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const src = (...items: [string, string][]) => items.map(([label, href]) => ({ label, href }));


export const CALCULATORS: CalculatorInfo[] = [
  {
    slug: 'gravel-calculator', bg: '/bg/kalkulator-chakal/', title: 'Gravel Calculator', seoTitle: 'Gravel Calculator: Cubic Yards and Tons', shortTitle: 'Gravel', category: 'Landscaping',
    description: 'Estimate gravel volume, weight, and material cost for a driveway, path, or garden bed.',
    intro: 'Plan a gravel delivery with a practical estimate of volume and weight. Enter your project dimensions and adjust the example density to match your supplier’s material.',
    sources: src(['Aggregate Markets: loose density of gravel, sand and crushed stone, about 1.35 tons per cubic yard', 'https://aggregatemarkets.com/en/calculators']), kind: 'gravel', icon: 'gravel', keywords: ['stone', 'driveway', 'aggregate', 'rock', 'tons'],
    example: 'A 20 ft × 10 ft area at 3 in deep holds about 1.85 cubic yards before waste.',
    formula: 'Length × width gives area. Area × depth in feet gives cubic feet; divide by 27 for cubic yards. Weight uses your entered density, and waste is added to volume.',
    faqs: [
      { question: 'How many cubic yards are in a ton of gravel?', answer: 'About 0.7 to 0.75. Loose gravel weighs roughly 1.35 to 1.4 US tons per cubic yard, so one ton is about 0.74 cubic yards (1 ÷ 1.35) and 10 tons about 7.4. The exact figure depends on the stone and how wet it is: ask the supplier, and enter their density in the calculator.' },
      { question: 'How much does a cubic yard of gravel weigh?', answer: 'It varies by aggregate, grading, moisture, and compaction. Use a supplier-provided density for a better weight estimate; the default is only an example.' },
      { question: 'How much extra gravel should I order?', answer: 'A waste allowance can account for uneven ground and handling. The right amount depends on site conditions, so confirm your depth and quantity with the supplier.' },
    ],
  },
  {
    slug: 'paint-calculator', bg: '/bg/kalkulator-boya/', title: 'Paint Calculator', seoTitle: 'Paint Calculator: How Many Gallons Do I Need?', shortTitle: 'Paint', category: 'Painting',
    description: 'Estimate paint coverage and the number of gallons needed for your walls.',
    intro: 'Estimate paint for rectangular walls, subtract doors and windows, and plan for multiple coats. Check the label for the coverage of your exact paint.',
    answer: 'Net wall area × coats ÷ the coverage on the label, rounded up to whole gallons. A 12 × 10 ft room with 8 ft walls has 352 sq ft of wall; minus 32 sq ft for a door and a window, that is 320 sq ft. Two coats at 350 sq ft per gallon need 1.83 gallons, so buy 2.',
    sources: src(['Sherwin-Williams: a gallon covers about 350 to 400 sq ft', 'https://www.sherwin-williams.com/en-us/color/color-tools/paint-calculator']), kind: 'paint', icon: 'paint', keywords: ['walls', 'gallons', 'coverage', 'painting', 'coats'],
    example: 'A 12 ft × 8 ft wall is 96 square feet before subtracting openings.',
    formula: 'Net wall area × coats ÷ coverage per gallon = estimated gallons. Whole-gallon purchasing rounds that quantity up.',
    faqs: [
      { question: 'How many coats of paint should I plan for?', answer: 'Two coats are common, but coverage depends on color change, surface condition, primer, and the product. Follow the paint manufacturer’s instructions.' },
      { question: 'Does the calculator include ceilings and trim?', answer: 'No. Add each wall area to the dimensions and openings inputs as appropriate; ceilings, trim, and unusual surfaces need separate estimates.' },
    ],
  },
  {
    slug: 'tile-calculator', bg: '/bg/kalkulator-plochki/', title: 'Tile Calculator', seoTitle: 'Tile Calculator: How Many Tiles and Boxes?', shortTitle: 'Tile', category: 'Flooring & Tile',
    description: 'Calculate approximate tile quantity and boxes for a rectangular floor or wall.',
    intro: 'Estimate tiles for a simple rectangular layout, including a configurable waste allowance. Complex patterns and irregular spaces require additional planning.',
    sources: src(['Tiles UK: 10% waste for a straight layout, 15% diagonal, up to 20% herringbone', 'https://tiles.uk.com/how-many-tiles-do-i-need/'], ['Buildmat: 10% straight or brick layout, 15% diagonal or herringbone', 'https://www.buildmat.com.au/blogs/help-centre/how-to-calculate-how-many-tiles-you-need']), kind: 'tile', icon: 'tile', keywords: ['floor', 'bathroom', 'boxes', 'ceramic', 'backsplash'],
    example: 'A 10 ft × 12 ft room has 120 square feet of floor area before waste.',
    formula: 'Room area ÷ tile face area gives the base tile count. Apply waste, then round tiles and boxes up to whole units.',
    faqs: [
      { question: 'Does tile spacing change the estimate?', answer: 'Grout spacing is included as an approximate addition to each tile’s face dimensions. Real layouts can differ at edges and around cuts.' },
      { question: 'Does this estimate account for tile patterns?', answer: 'No. The estimate is for a basic rectangular layout and does not account for diagonal layouts, intricate patterns, or irregular rooms.' },
    ],
  },
  {
    slug: 'concrete-calculator', bg: '/bg/kalkulator-beton/', title: 'Concrete Calculator', seoTitle: 'Concrete Calculator: Cubic Yards for a Slab', shortTitle: 'Concrete', category: 'Concrete & Masonry',
    description: 'Estimate concrete volume for a slab and optionally calculate material cost.',
    intro: 'Estimate the volume of concrete for a rectangular slab. The result is a planning estimate, not a structural design or placement specification.',
    sources: src(['QUIKRETE Concrete Mix 80 lb: about 0.6 cu ft per bag', 'https://www.pacesupply.com/Product/MORCONCRETE80']), kind: 'concrete', icon: 'concrete', keywords: ['slab', 'cement', 'patio', 'cubic yards', 'foundation'],
    example: 'A 10 ft × 10 ft slab that is 4 in thick is about 1.23 cubic yards before waste.',
    formula: 'Length × width × thickness in feet gives cubic feet; divide by 27 to convert to cubic yards. Apply waste to the volume.',
    faqs: [
      { question: 'How much concrete should I order?', answer: 'Use the adjusted volume as a starting estimate, then confirm the order quantity with your concrete supplier and account for site conditions.' },
      { question: 'Does this calculator size a foundation?', answer: 'No. It estimates volume only and does not replace structural engineering, code requirements, reinforcement design, or local construction guidance.' },
    ],
  },
  {
    slug: 'square-footage-calculator', title: 'Square Footage Calculator', seoTitle: 'Square Footage Calculator: Add Up Several Rooms', shortTitle: 'Square footage', category: 'General Construction',
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
    slug: 'mulch-calculator', title: 'Mulch Calculator', seoTitle: 'Mulch Calculator: Cubic Yards for Garden Beds', shortTitle: 'Mulch', category: 'Landscaping',
    description: 'Estimate mulch for garden beds and landscaping in cubic feet and cubic yards, with a waste allowance and an optional cost.',
    intro: 'Estimate mulch in cubic feet and cubic yards from the bed dimensions and planned depth. Depth recommendations vary by material and use.',
    sources: src(['Mississippi State University Extension: 2 to 3 inches of mulch for landscape beds', 'https://extension.msstate.edu/news/southern-gardening/2022/use-mulch-for-beauty-and-weed-temperature-control']), kind: 'mulch', icon: 'mulch', keywords: ['garden', 'landscape', 'cubic yards', 'bark', 'beds'],
    example: 'A 10 ft × 10 ft bed at 3 in deep holds about 0.93 cubic yards before waste.',
    formula: 'Length × width gives area. Multiply by depth in feet for cubic feet, divide by 27 for cubic yards, then apply waste.',
    faqs: [
      { question: 'What mulch depth should I use?', answer: 'The appropriate depth depends on mulch type, plants, and the purpose of the layer. Follow local horticultural guidance and avoid piling mulch against stems or trunks.' },
      { question: 'How many bags are in a cubic yard?', answer: 'Bag volumes vary. Divide the required cubic feet by the volume printed on the bag to estimate the number of bags, rounding up.' },
    ],
  },
  {
    slug: 'laminate-flooring-calculator', bg: '/bg/kalkulator-laminat/', title: 'Laminate Flooring Calculator', seoTitle: 'Laminate Flooring Calculator: Boxes and Waste', shortTitle: 'Laminate flooring', category: 'Flooring & Tile',
    description: 'Work out how many boxes of laminate or vinyl plank flooring you need for a room, with waste and cost.',
    intro: 'Enter the room size and the coverage printed on the box. The estimate adds a waste allowance for cuts and rounds up to whole boxes.',
    sources: src(['EGGER: order about 10% extra laminate', 'https://www.egger.com/en/blog/how-much-laminate-flooring-do-i-need?country=GB'], ['Pergo installation guide: acclimatize planks for 48 hours', 'https://cdn2.pergo.com/-/media/imported%20assets/flooring/5/b/b/pginstallationlmpherringboneenpdf288141.ashx']), kind: 'flooring', icon: 'flooring', keywords: ['laminate', 'vinyl plank', 'LVP', 'floor', 'boxes', 'hardwood', 'underlayment'],
    example: 'A 14 ft × 12 ft room is 168 square feet of floor before waste.',
    formula: 'Length × width gives the floor area. Add the waste allowance, divide by the coverage per box and round up to whole boxes.',
    faqs: [
      { question: 'How much extra laminate should I buy?', answer: 'Around 10% is a common allowance for a straight layout in a simple room. Diagonal or herringbone layouts and rooms with many corners need more. Keep a spare box for future repairs.' },
      { question: 'Do I need underlayment?', answer: 'Most floating floors need an underlayment unless one is attached to the planks. Plan for roughly the floor area and follow the flooring manufacturer’s instructions.' },
    ],
  },
  {
    slug: 'drywall-calculator', bg: '/bg/kalkulator-gipsokarton/', title: 'Drywall Calculator', seoTitle: 'Drywall Calculator: Sheets for Walls and Ceiling', shortTitle: 'Drywall', category: 'General Construction',
    description: 'Estimate drywall sheets for the walls and ceiling of a room, minus doors and windows, with waste and cost.',
    intro: 'Enter the room size and wall height, subtract doors and windows, and choose a sheet size. The estimate adds waste and rounds up to whole sheets.',
    sources: src(['Screw spacing per IRC R702.3.5 (8 in edges, 16 in field): about 1 screw per sq ft on walls', 'https://drywallcalcs.pages.dev/how-many-screws-per-sheet-of-drywall/'], ['USG Sheetrock joint tape: about 370 ft per 1,000 sq ft of panels', 'https://images.homedepot-static.com/catalog/pdfImages/7a/7a2ad9f3-62c7-45ef-b58e-869ccdbca0c6.pdf'], ['USG: about two 4.5-gallon pails of lightweight compound per 1,000 sq ft (about 10 gallons of all-purpose)', 'https://assemblies-tools.usg.com/content/usgcom/en/resource-center/faqs/1977.html'], ['Knauf Type A 12.5 mm: sheet sizes 1.2 × 2.0 to 3.0 m', 'https://knauf.com/bg-BG/p/produkt/gipskartoneni-ploskosti-tip-a-12-5-mm-10003_0102']), kind: 'drywall', icon: 'drywall', keywords: ['plasterboard', 'gypsum board', 'sheetrock', 'walls', 'ceiling', 'sheets'],
    example: 'A 12 ft × 10 ft room with 8 ft walls has 352 square feet of wall before openings.',
    formula: 'Room perimeter × wall height gives the wall area; add the ceiling if needed and subtract openings. Add waste, divide by the sheet area and round up.',
    faqs: [
      { question: 'Should I subtract doors and windows?', answer: 'Subtracting them gives the net area. Many installers subtract only large openings, because offcuts from small ones are rarely usable; the waste allowance covers the rest.' },
      { question: 'Which sheet size should I use?', answer: 'Larger sheets mean fewer joints to tape but are heavier to handle. Choose a length that matches your wall height where possible and check what your supplier stocks.' },
    ],
  },
  {
    slug: 'tile-adhesive-grout-calculator', bg: '/bg/lepilo-i-fuga/', title: 'Tile Adhesive & Grout Calculator', seoTitle: 'Tile Adhesive & Grout Calculator: Bags Needed', shortTitle: 'Tile adhesive & grout', category: 'Flooring & Tile',
    description: 'Estimate bags of tile adhesive (thinset) and grout from the area, tile size, joint width and trowel notch.',
    intro: 'Enter the area to tile, the tile size and thickness and the joint width. The estimate picks a trowel notch for the tile size, adds waste and rounds up to whole bags.',
    sources: src(['Kiesel Servoflex K-Plus SuperTec data sheet: about 1.0, 1.6 and 2.2 kg/m² by notch', 'https://mosafil.com/media/8d/e6/29/1721730157/datenblatt_servoflex-k-plus-supertec_en.pdf'], ['Kiesel Servoflex F data sheet (DE): grout about 0.5 kg/m² for 30 × 30 cm tiles', 'https://www.fliesengigant.de/out/media/datenblatt_servoflex-f_de(1).pdf'], ['Ceresit CM 11 PLUS data sheet: adhesive per trowel notch, 4 to 12 mm', 'https://datasheets.tdx.henkel.com/CERESIT-CM-11-PLUS-sk_SK.pdf'], ['SikaCeram Tile Grout data sheet: grout density about 1.6 kg/L and coverage formula', 'https://twn.sika.com/dam/dms/tw01/d/sikaceram_tile_groutf1t.pdf']), kind: 'adhesive', icon: 'tile', keywords: ['thinset', 'mortar', 'grout', 'tile adhesive', 'trowel', 'bags'],
    example: 'Grout for 12 × 12 in tiles with 1/8 in joints, 3/8 in thick, is about 0.32 kg per m² (0.065 lb per sq ft).',
    formula: 'Adhesive = area × the usual consumption for the trowel notch. Grout per m² = (tile length + width) ÷ (length × width) × joint width × tile thickness × 1.6, with sizes in mm. Waste is added and bags are rounded up.',
    faqs: [
      { question: 'What about Kiesel and other brands?', answer: 'Use the consumption on your product’s data sheet. Flexible adhesives can be lighter than the cement adhesive used here: Kiesel Servoflex K SuperTec is about 1.0 kg/m² with a 4 mm notch, 1.6 kg/m² with 6 mm and 2.2 kg/m² with 8 mm or more, and Kiesel Servoflex F grout about 0.5 kg/m² for 30 × 30 cm tiles. Pick the notch here and compare with the brand’s figure before you buy.' },
      { question: 'Which trowel notch should I use?', answer: 'Bigger tiles need a deeper notch so the adhesive covers the whole back of the tile. Leave “Suggest from tile size” on, or pick the notch your adhesive’s data sheet recommends.' },
      { question: 'Why does grout depend on tile size?', answer: 'Small tiles have many more joints per square foot, so mosaics use far more grout than large-format tiles with the same joint width.' },
    ],
  },
  {
    slug: 'wallpaper-calculator', bg: '/bg/kalkulator-tapeti/', title: 'Wallpaper Calculator', seoTitle: 'Wallpaper Calculator: How Many Rolls?', shortTitle: 'Wallpaper', category: 'Paint & Finishes',
    description: 'Estimate rolls of wallpaper for a room from the wall size, roll size and pattern repeat, counted strip by strip.',
    intro: 'Enter the room size and wall height, doors and windows, and the size of one roll. The estimate counts the strips you can cut from each roll, allowing for the pattern repeat.',
    sources: src(['Morris & Co: 10 cm (4 in) trim allowance per drop', 'https://wmorrisandco.com/uk/wallpaper-quantity-calculator'], ['Etoffe: count wallpaper in drops, height + trim + pattern repeat', 'https://www.etoffe.com/en/content/16-calculate-the-number-of-rolls-of-wallpaper']), kind: 'wallpaper', icon: 'paint', keywords: ['wall covering', 'rolls', 'pattern repeat', 'drop', 'strips', 'feature wall'],
    example: 'A 12 ft × 10 ft room with 8 ft walls needs about 25 strips of 20.5 in wallpaper, or 9 rolls of 33 ft.',
    formula: 'Strips = (room perimeter − opening width) ÷ roll width. Strips per roll = roll length ÷ (wall height in whole pattern repeats + trim). Rolls = strips ÷ strips per roll, rounded up.',
    faqs: [
      { question: 'Why not just divide the wall area by the roll area?', answer: 'Wallpaper is hung in full-height strips, and the offcut at the end of each roll is often too short for another strip. Counting strips per roll is what decides how many rolls you need.' },
      { question: 'What is a pattern repeat?', answer: 'The distance after which the pattern repeats down the roll. Each strip has to start at the same point in the pattern, so strips are cut in whole repeats and a large repeat wastes more paper.' },
    ],
  },
  {
    slug: 'screed-plaster-calculator', bg: '/bg/zamazka-i-mazilka/', title: 'Screed & Plaster Calculator', seoTitle: 'Screed & Plaster Calculator: Bags Needed', shortTitle: 'Screed & plaster', category: 'Concrete & Masonry',
    description: 'Estimate bags of floor screed, self-leveling compound or gypsum plaster from the area, thickness and the mix’s consumption.',
    intro: 'Enter the area and the average thickness, and choose the material. The estimate multiplies by the consumption per millimeter from manufacturers’ data sheets, adds waste and rounds up to whole bags.',
    sources: src(['Baumit Solido E225: cement screed, about 20 kg/m² per cm', 'https://baumit.pl/files/pl/pdf_files/pds_solido___5___estrich_e___5_bpl_pl_13262.pdf'], ['Ceresit CN 68: self-leveling, about 1.5 kg/m² per mm', 'https://datasheets.tdx.henkel.com/CERESIT-CN-68-bg_BG.pdf'], ['Baumit Nivello Quattro: self-leveling, about 1.5 kg/m² per mm', 'https://media.hornbach.at/hb/technicaldatasheet/as.187261153.pdf'], ['Knauf MP 75: gypsum plaster, 10 kg/m² at 10 mm', 'https://bauhaus.bg/upload/files/120030/2605_MP%2075_2020.pdf']), kind: 'screed', icon: 'concrete', keywords: ['floor leveler', 'self-leveling', 'underlayment', 'screed', 'plaster', 'bags', 'thickness'],
    example: 'A 15 m² floor with 40 mm of cement screed takes about 1,200 kg of dry mix before waste.',
    formula: 'Dry mix = area (m²) × thickness (mm) × consumption (kg per m² per mm). Add waste, divide by the bag weight and round up.',
    faqs: [
      { question: 'How do I measure the thickness of an uneven floor?', answer: 'Use the average. Check the level at several points, for example with a long straightedge or a laser, and average the gaps. The calculator works with one average thickness.' },
      { question: 'Where do I find the consumption?', answer: 'On the bag or the product data sheet, usually as kg per m² per mm (or per cm). Enter it as a custom consumption to match your product exactly.' },
    ],
  },
  {
    slug: 'insulation-board-calculator', bg: '/bg/kalkulator-izolatsiya/', title: 'Insulation Board Calculator', seoTitle: 'Insulation Board Calculator: Boards and EIFS', shortTitle: 'Insulation boards', category: 'General Construction',
    description: 'Estimate rigid foam or mineral wool boards for a wall, and the adhesive, base coat, mesh and anchors for exterior insulation (EIFS).',
    intro: 'Enter the wall area, subtract doors and windows, and choose a board size and thickness. Optionally add the supplies for an exterior insulation system.',
    sources: src(['Ceresit CT 85 data sheet: adhesive 5.0 kg/m², base coat 4.0 kg/m²', 'https://datasheets.tdx.henkel.com/CERESIT-CT-85-en_GB.pdf'], ['Ceresit CT 325: mesh, about 1.1 m per m²', 'https://datasheets.tdx.henkel.com/CERESIT-CT-325-mk_MK.pdf'], ['ETA 22/0366: at least 6 anchors per m², 8 on buildings over 24 m', 'https://dit.ietcc.csic.es/2022/12/03/ete-22-0366-sistema-de-aislamiento-termico-por-el-exterior-sistema-ferro-term-sistema-chem-term/?lang=en']), kind: 'insulation', icon: 'drywall', keywords: ['rigid foam', 'EPS', 'XPS', 'mineral wool', 'EIFS', 'ETICS', 'facade', 'boards'],
    example: '85 m² of wall with 1 × 0.5 m boards needs about 179 boards with 5% waste.',
    formula: 'Boards = (wall area − openings) × (1 + waste) ÷ board area, rounded up. Supplies use typical rates per m² of board.',
    faqs: [
      { question: 'How thick should the insulation be?', answer: 'That depends on your climate, the wall and local energy rules. This calculator counts boards for a thickness you choose; it does not size the insulation.' },
      { question: 'Are the adhesive and anchor figures exact?', answer: 'No. They are typical values from a common system (Ceresit CT 85) and a usual six anchors per m². Wind load, building height and the wall material change the anchor pattern, so follow the system manufacturer or your designer.' },
    ],
  },
  {
    slug: 'brick-block-calculator', bg: '/bg/kalkulator-tuhli/', title: 'Brick & Block Calculator', seoTitle: 'Brick & Block Calculator: Units and Mortar', shortTitle: 'Bricks & blocks', category: 'Concrete & Masonry',
    description: 'Estimate bricks or blocks for a wall, and the mortar and mortar bags, from the wall size and the unit you build with.',
    intro: 'Enter the wall length and height, subtract doors and windows, and choose the brick or block. The estimate counts units per square foot with their joints and works out the mortar in the joints.',
    sources: src(['Travis Perkins brick guide: about 60 UK bricks per m² for a half-brick wall, 120 for one brick', 'https://www.travisperkins.co.uk/content/brick-calculator'], ['Designing Buildings: UK brick 215 × 102.5 × 65 mm, co-ordinating size 225 × 112.5 × 75 mm', 'https://www.designingbuildings.co.uk/wiki/Brick_sizes'], ['Travis Perkins: Ibstock 65 mm brick, pack of 500', 'https://www.travisperkins.co.uk/ibstock-chesterton-tradesman-heather-mixture-65mm-brick-pack-of-500/p/790777'], ['MKM: Ibstock 65 mm common brick, pack of 370', 'https://mkm.com/product/65mm-chailey-stock-common-brick-370-pack-b116140'], ['BIA Technical Note 10: modular brick about 6.75 per sq ft, mortar per 1,000 brick', 'https://gobrick.com/media/file/10-dimensioning-and-estimating-brick-masonry.pdf'], ['Titan America block guide: 1.125 block per sq ft for 8 × 16 in CMU', 'https://titanamerica.com/wp-content/uploads/2025/01/Titan-America-Block-Estimating-Guide.pdf'], ['QUIKRETE Mason Mix: an 80 lb bag lays up to 37 bricks or 13 blocks', 'https://www.Quikrete.com/PDFs/DATA_SHEET-Mason%20Mix%201136.pdf'], ['Wienerberger Porotherm 25: 375 × 250 × 238 mm, 11 per m² (data sheet)', 'https://www.masterhaus.bg/files/pdf-docs/11/03/01/1103010048-tuhla-poroterm-25-light-plus-375h250h238mm.pdf'], ['Ytong 625 × 250 mm: 6.4 per m², thin-bed joint (data sheet)', 'https://www.baubook.info/m/Daten/Infos/SI2142723510/AT87/ID147470/2023_Ytong_Planstein_gelb_PP2_050_250.pdf']), kind: 'masonry', icon: 'concrete', keywords: ['bricks', 'blocks', 'CMU', 'mortar', 'wall', 'masonry', 'Porotherm', 'aerated concrete'],
    example: 'A wall of modular brick with 3/8 in joints takes about 6.9 bricks per sq ft; 8 × 16 in concrete blocks about 1.125 per sq ft.',
    formula: 'Units per area = 1 ÷ ((unit length + joint) × (unit height + joint)). Mortar fills the bed joints, and the head joints when the units have them, through the wall depth.',
    faqs: [
      { question: 'Why are no head joints counted for some blocks?', answer: 'Clay blocks such as Porotherm and many aerated concrete blocks have interlocking tongue-and-groove ends, so only the horizontal bed joints take mortar.' },
      { question: 'How many bricks are in a pack?', answer: 'It depends on the maker and the range, so check the listing. UK 65 mm bricks are usually sold in packs of 370 to 500 (Ibstock packs at UK merchants are often 500, some 475, 404 or 370, and mini packs 250). Enter the pack size and the calculator rounds up to whole packs.' },
      { question: 'How many UK bricks per square metre?', answer: 'About 60 for a half-brick wall of standard 215 × 102.5 × 65 mm bricks with 10 mm joints, because each brick with its joints covers 225 × 75 mm. A one-brick wall takes about 120. Choose the UK brick in the list to get the exact figure (59.3 per m²).' },
      { question: 'How much mortar does one bag make?', answer: 'It is printed on the bag. An 80 lb bag of premixed mortar makes about 0.6 to 0.7 cu ft; a 25 kg bag of dry mortar about 16 L. Thin-bed adhesive for aerated concrete yields differently, so check the bag.' },
    ],
  },
];

/** Calculators that go together, for the "Related calculators" block (slugs). */
export const RELATED_SLUGS: Record<string, string[]> = {
  'gravel-calculator': ['concrete-calculator', 'mulch-calculator', 'square-footage-calculator'],
  'paint-calculator': ['wallpaper-calculator', 'drywall-calculator', 'square-footage-calculator'],
  'tile-calculator': ['tile-adhesive-grout-calculator', 'laminate-flooring-calculator', 'square-footage-calculator'],
  'concrete-calculator': ['gravel-calculator', 'brick-block-calculator', 'screed-plaster-calculator'],
  'square-footage-calculator': ['laminate-flooring-calculator', 'paint-calculator', 'tile-calculator'],
  'mulch-calculator': ['gravel-calculator', 'square-footage-calculator', 'concrete-calculator'],
  'laminate-flooring-calculator': ['screed-plaster-calculator', 'tile-calculator', 'square-footage-calculator'],
  'drywall-calculator': ['paint-calculator', 'insulation-board-calculator', 'brick-block-calculator'],
  'tile-adhesive-grout-calculator': ['tile-calculator', 'screed-plaster-calculator', 'laminate-flooring-calculator'],
  'wallpaper-calculator': ['paint-calculator', 'drywall-calculator', 'square-footage-calculator'],
  'screed-plaster-calculator': ['laminate-flooring-calculator', 'tile-calculator', 'concrete-calculator'],
  'insulation-board-calculator': ['brick-block-calculator', 'drywall-calculator', 'paint-calculator'],
  'brick-block-calculator': ['insulation-board-calculator', 'concrete-calculator', 'drywall-calculator'],
};

/** The hub article (in English) that explains each calculator in depth. */
export const ARTICLES: Record<string, { href: string; title: string }> = {
  'gravel-calculator': { href: '/blog/how-much-gravel-for-a-driveway/', title: 'How much gravel do I need for a driveway?' },
  'paint-calculator': { href: '/blog/how-much-paint-for-a-room/', title: 'How much paint do I need for a room?' },
  'tile-calculator': { href: '/blog/tile-waste-percentage/', title: 'How much extra tile should I buy?' },
  'concrete-calculator': { href: '/blog/how-much-concrete-for-a-slab/', title: 'How much concrete do I need for a slab?' },
  'square-footage-calculator': { href: '/blog/how-to-measure-square-footage/', title: 'How to measure square footage' },
  'mulch-calculator': { href: '/blog/how-much-mulch-do-i-need/', title: 'How much mulch do I need?' },
  'laminate-flooring-calculator': { href: '/blog/how-much-laminate-flooring-do-i-need/', title: 'How much laminate flooring do I need?' },
  'drywall-calculator': { href: '/blog/how-many-drywall-sheets-do-i-need/', title: 'How many drywall sheets do I need?' },
  'tile-adhesive-grout-calculator': { href: '/blog/how-much-tile-adhesive-and-grout-do-i-need/', title: 'How much tile adhesive and grout do I need?' },
  'wallpaper-calculator': { href: '/blog/how-much-wallpaper-do-i-need/', title: 'How much wallpaper do I need?' },
  'screed-plaster-calculator': { href: '/blog/how-much-self-leveling-compound-do-i-need/', title: 'How much self-leveling compound or screed do I need?' },
  'insulation-board-calculator': { href: '/blog/how-many-insulation-boards-do-i-need/', title: 'How many insulation boards do I need for a wall?' },
  'brick-block-calculator': { href: '/blog/how-many-bricks-do-i-need/', title: 'How many bricks or blocks do I need for a wall?' },
};

export const FEATURED_SLUGS = [
  'gravel-calculator', 'paint-calculator', 'tile-calculator',
  'concrete-calculator', 'square-footage-calculator', 'mulch-calculator',
  'laminate-flooring-calculator', 'drywall-calculator', 'tile-adhesive-grout-calculator', 'wallpaper-calculator', 'screed-plaster-calculator', 'insulation-board-calculator', 'brick-block-calculator',
];

export const CATEGORIES = [...new Set(CALCULATORS.map((calculator) => calculator.category))];
