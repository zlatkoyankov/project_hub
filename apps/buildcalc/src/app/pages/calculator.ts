import { boardFor } from '@zyankov/design-system/boards';
import { afterNextRender, Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { track } from '@zyankov/design-system/analytics';
import { SITE_BASE_URL } from '../core/seo.service';
import { UnitPreferenceService, UnitSystem } from '../core/unit-preference.service';
import { GUIDES } from '../data/guides';
import { ARTICLES, CalculatorInfo, CALCULATORS, CalculatorKind, RELATED_SLUGS, SOURCES_CHECKED } from '../data/calculators';
import {
  AdhesiveInput, calculateAdhesive, calculateInsulation, calculateMasonry, MasonryInput, MASONRY_UNITS, InsulationInput, INSULATION_BOARDS, calculateScreed, calculateWallpaper, ScreedInput, WallpaperInput, calculateArea, calculateConcrete, calculateDrywall, calculateFlooring, calculateGravel, calculateMulch, calculatePaint, calculateTile, ConcreteInput, DRYWALL_SHEETS, SCREED_MATERIALS, TROWEL_NOTCHES, DrywallInput, Estimate, EstimateRow, FlooringInput, GravelInput, MulchInput, PaintInput, TileInput, Values,
} from '../utils/calculations';

interface Field {
  key: string;
  label: string;
  unit: string;
  min: number;
  step: number;
  hint?: string;
  optional?: boolean;
  unitKey?: string;
  unitOptions?: { value: number; label: string }[];
  /** Fields shown in a separate, optional section (laminate trim, drywall framing and supplies). */
  group?: 'extra';
}

interface AreaEntry {
  length: number;
  width: number;
  unit: 'ft' | 'in' | 'm' | 'cm';
}

// Trims floating-point noise (6.096000000024) from converted input values.
const tidy = (value: number): number => Number(value.toPrecision(8));

const DISTANCE_UNITS = [
  { value: 0, label: 'ft' },
  { value: 1, label: 'in' },
  { value: 2, label: 'm' },
  { value: 3, label: 'cm' },
];
const US_DISTANCE_UNITS = DISTANCE_UNITS.slice(0, 2);
const METRIC_DISTANCE_UNITS = DISTANCE_UNITS.slice(2);
const INCH_UNITS = [
  { value: 1, label: 'in' },
  { value: 3, label: 'cm' },
  { value: 4, label: 'mm' },
];
const US_SMALL_UNITS = INCH_UNITS.slice(0, 1);
const METRIC_SMALL_UNITS = INCH_UNITS.slice(1);
const AREA_UNITS = [
  { value: 0, label: 'sq ft' },
  { value: 1, label: 'sq in' },
  { value: 2, label: 'sq m' },
  { value: 3, label: 'sq cm' },
];
const US_AREA_UNITS = AREA_UNITS.slice(0, 2);
const METRIC_AREA_UNITS = AREA_UNITS.slice(2);
const DENSITY_UNITS = [{ value: 0, label: 'lb / cu yd' }, { value: 1, label: 'kg / cu m' }];
const YIELD_UNITS = [{ value: 0, label: 'cu ft' }, { value: 1, label: 'L' }];
const WEIGHT_UNITS = [{ value: 0, label: 'lb' }, { value: 1, label: 'kg' }];
const COVERAGE_UNITS = [{ value: 0, label: 'sq ft / gal' }, { value: 1, label: 'sq m / L' }];

const FORM_FIELDS: Record<Exclude<CalculatorKind, 'area'>, Field[]> = {
  gravel: [
    { key: 'length', label: 'Area length', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0.01, step: 0.1 },
    { key: 'width', label: 'Area width', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0.01, step: 0.1 },
    { key: 'depth', label: 'Gravel depth', unit: 'in', unitKey: 'depthUnit', unitOptions: INCH_UNITS, min: 0.01, step: 0.1 },
    { key: 'density', label: 'Material density', unit: 'lb / cu yd', unitKey: 'densityUnit', unitOptions: DENSITY_UNITS, min: 0, step: 1, hint: 'Example only—confirm the density with your supplier.' },
    { key: 'waste', label: 'Waste allowance', unit: '%', min: 0, step: 1 },
    { key: 'price', label: 'Price per unit', unit: '$', min: 0, step: 0.01, optional: true },
  ],
  paint: [
    { key: 'width', label: 'Wall width', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0.01, step: 0.1 },
    { key: 'height', label: 'Wall height', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0.01, step: 0.1 },
    { key: 'openings', label: 'Doors and windows to subtract', unit: 'sq ft', unitKey: 'openingsUnit', unitOptions: AREA_UNITS, min: 0, step: 0.5 },
    { key: 'coats', label: 'Number of coats', unit: 'coats', min: 1, step: 1 },
    { key: 'coverage', label: 'Paint coverage', unit: 'sq ft / gallon', unitKey: 'coverageUnit', unitOptions: COVERAGE_UNITS, min: 0.01, step: 1, hint: 'Check the label for your paint’s stated coverage.' },
    { key: 'waste', label: 'Extra allowance', unit: '%', min: 0, step: 1 },
    { key: 'price', label: 'Price per gallon', unit: '$', min: 0, step: 0.01, optional: true },
  ],
  tile: [
    { key: 'length', label: 'Room length', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0.01, step: 0.1 },
    { key: 'width', label: 'Room width', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0.01, step: 0.1 },
    { key: 'tileLength', label: 'Tile length', unit: 'in', unitKey: 'tileUnit', unitOptions: INCH_UNITS, min: 0.01, step: 0.1 },
    { key: 'tileWidth', label: 'Tile width', unit: 'in', unitKey: 'tileUnit', unitOptions: INCH_UNITS, min: 0.01, step: 0.1 },
    { key: 'grout', label: 'Grout spacing', unit: 'in', unitKey: 'groutUnit', unitOptions: INCH_UNITS, min: 0, step: 0.01 },
    { key: 'waste', label: 'Waste allowance', unit: '%', min: 0, step: 1 },
    { key: 'boxSize', label: 'Tiles per box', unit: 'tiles', min: 0, step: 1, optional: true },
    { key: 'price', label: 'Price per tile or box', unit: '$', min: 0, step: 0.01, optional: true },
  ],
  concrete: [
    { key: 'length', label: 'Slab length', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0.01, step: 0.1 },
    { key: 'width', label: 'Slab width', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0.01, step: 0.1 },
    { key: 'depth', label: 'Slab thickness', unit: 'in', unitKey: 'depthUnit', unitOptions: INCH_UNITS, min: 0.01, step: 0.1 },
    { key: 'waste', label: 'Waste allowance', unit: '%', min: 0, step: 1 },
    { key: 'price', label: 'Price per cubic yard', unit: '$', min: 0, step: 0.01, optional: true },
  ],
  flooring: [
    { key: 'length', label: 'Room length', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0.01, step: 0.1 },
    { key: 'width', label: 'Room width', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0.01, step: 0.1 },
    { key: 'boxArea', label: 'Coverage per box', unit: 'sq ft', unitKey: 'boxAreaUnit', unitOptions: AREA_UNITS, min: 0.01, step: 0.01, hint: 'Printed on the box, for example 20 sq ft or 2.2 m².' },
    { key: 'waste', label: 'Waste allowance', unit: '%', min: 0, step: 1, hint: 'About 10% for a straight layout; more for diagonal or herringbone.' },
    { key: 'price', label: 'Price per box', unit: '$', min: 0, step: 0.01, optional: true },
    { key: 'doorways', label: 'Doorways', unit: 'doors', min: 0, step: 1, group: 'extra', hint: 'Baseboards stop at each door frame.' },
    { key: 'doorWidth', label: 'Doorway width', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0, step: 0.1, group: 'extra' },
    { key: 'pieceLength', label: 'Baseboard piece length', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0.01, step: 0.1, group: 'extra', hint: 'Check what your store sells, for example 8 ft or 2.5 m.' },
    { key: 'insideCorners', label: 'Inside corners', unit: 'corners', min: 0, step: 1, group: 'extra', hint: 'A rectangular room has 4.' },
    { key: 'outsideCorners', label: 'Outside corners', unit: 'corners', min: 0, step: 1, group: 'extra', hint: 'Where a wall sticks out, such as a chimney breast or alcove.' },
    { key: 'transitions', label: 'Transition strips', unit: 'strips', min: 0, step: 1, group: 'extra', hint: 'At doorways where the floor meets a different floor.' },
    { key: 'trimPrice', label: 'Price per baseboard piece', unit: '$', min: 0, step: 0.01, optional: true, group: 'extra' },
  ],
  drywall: [
    { key: 'length', label: 'Room length', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0.01, step: 0.1 },
    { key: 'width', label: 'Room width', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0.01, step: 0.1 },
    { key: 'height', label: 'Wall height', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0.01, step: 0.1 },
    { key: 'openings', label: 'Doors and windows to subtract', unit: 'sq ft', unitKey: 'openingsUnit', unitOptions: AREA_UNITS, min: 0, step: 0.5, hint: 'A standard door is about 21 sq ft (2 m²).' },
    { key: 'waste', label: 'Waste allowance', unit: '%', min: 0, step: 1 },
    { key: 'price', label: 'Price per sheet', unit: '$', min: 0, step: 0.01, optional: true },
    { key: 'studSpacing', label: 'Stud spacing', unit: 'in', unitKey: 'spacingUnit', unitOptions: INCH_UNITS, min: 0.1, step: 1, group: 'extra', hint: 'Center to center: usually 16 or 24 in, or 40 or 60 cm.' },
    { key: 'studLength', label: 'Stud and track length', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0.1, step: 0.1, group: 'extra', hint: 'As sold, for example 8, 10 or 12 ft, or 3 m.' },
  ],
  adhesive: [
    { key: 'surfaceArea', label: 'Area to tile', unit: 'sq ft', unitKey: 'openingsUnit', unitOptions: AREA_UNITS, min: 0.01, step: 0.5, hint: 'Floor or wall area. Add them together if you tile both.' },
    { key: 'tileLength', label: 'Tile length', unit: 'in', unitKey: 'tileUnit', unitOptions: INCH_UNITS, min: 0.01, step: 0.1 },
    { key: 'tileWidth', label: 'Tile width', unit: 'in', unitKey: 'tileUnit', unitOptions: INCH_UNITS, min: 0.01, step: 0.1 },
    { key: 'tileThickness', label: 'Tile thickness', unit: 'in', unitKey: 'tileUnit', unitOptions: INCH_UNITS, min: 0.01, step: 0.01, hint: 'Grout joints are usually filled to the full tile thickness.' },
    { key: 'grout', label: 'Grout joint width', unit: 'in', unitKey: 'groutUnit', unitOptions: INCH_UNITS, min: 0, step: 0.01 },
    { key: 'waste', label: 'Waste allowance', unit: '%', min: 0, step: 1 },
    { key: 'adhesiveBag', label: 'Adhesive bag size', unit: 'lb', unitKey: 'weightUnit', unitOptions: WEIGHT_UNITS, min: 0.1, step: 1, hint: 'Thinset is usually sold in 50 lb or 25 kg bags.' },
    { key: 'groutBag', label: 'Grout bag size', unit: 'lb', unitKey: 'weightUnit', unitOptions: WEIGHT_UNITS, min: 0.1, step: 1, hint: 'Often 25 lb, or 2 to 5 kg.' },
  ],
  masonry: [
    { key: 'length', label: 'Wall length', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0.01, step: 0.1 },
    { key: 'height', label: 'Wall height', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0.01, step: 0.1 },
    { key: 'openings', label: 'Doors and windows', unit: 'sq ft', unitKey: 'openingsUnit', unitOptions: AREA_UNITS, min: 0, step: 1 },
    { key: 'waste', label: 'Waste allowance', unit: '%', min: 0, step: 1, hint: 'About 5% for broken and cut units.' },
    { key: 'mortarYield', label: 'Mortar per bag', unit: 'cu ft', unitKey: 'yieldUnit', unitOptions: YIELD_UNITS, min: 0.01, step: 0.05, hint: 'On the bag: about 0.6 cu ft for 80 lb, or 16 L for 25 kg.' },
    { key: 'packSize', label: 'Bricks per pack', unit: 'units', min: 0, step: 1, optional: true, hint: 'On the merchant’s listing. UK 65 mm bricks often come in packs of 370 to 500.' },
    { key: 'price', label: 'Price per brick or block', unit: '$', min: 0, step: 0.01, optional: true },
  ],
  insulation: [
    { key: 'surfaceArea', label: 'Wall area', unit: 'sq ft', unitKey: 'openingsUnit', unitOptions: AREA_UNITS, min: 0.01, step: 1 },
    { key: 'openings', label: 'Doors and windows', unit: 'sq ft', unitKey: 'openingsUnit', unitOptions: AREA_UNITS, min: 0, step: 1 },
    { key: 'thickness', label: 'Board thickness', unit: 'in', unitKey: 'depthUnit', unitOptions: INCH_UNITS, min: 0.01, step: 0.25 },
    { key: 'waste', label: 'Waste allowance', unit: '%', min: 0, step: 1, hint: 'About 5% for plain walls, more with many corners and openings.' },
    { key: 'price', label: 'Price per board', unit: '$', min: 0, step: 0.01, optional: true },
  ],
  screed: [
    { key: 'surfaceArea', label: 'Area', unit: 'sq ft', unitKey: 'openingsUnit', unitOptions: AREA_UNITS, min: 0.01, step: 0.5 },
    { key: 'thickness', label: 'Average thickness', unit: 'in', unitKey: 'depthUnit', unitOptions: INCH_UNITS, min: 0.01, step: 0.01, hint: 'Measure the gaps under a straightedge in a few places and average them.' },
    { key: 'consumption', label: 'Custom consumption', unit: 'kg/m² per mm', min: 0, step: 0.05, optional: true, hint: 'From the bag or data sheet. Leave empty to use the material’s typical value.' },
    { key: 'waste', label: 'Waste allowance', unit: '%', min: 0, step: 1 },
    { key: 'bagSize', label: 'Bag size', unit: 'lb', unitKey: 'weightUnit', unitOptions: WEIGHT_UNITS, min: 0.1, step: 1, hint: 'Often 50 lb, or 25 to 30 kg.' },
    { key: 'price', label: 'Price per bag', unit: '$', min: 0, step: 0.01, optional: true },
  ],
  wallpaper: [
    { key: 'length', label: 'Room length', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0.01, step: 0.1 },
    { key: 'width', label: 'Room width', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0.01, step: 0.1 },
    { key: 'height', label: 'Wall height', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0.01, step: 0.1 },
    { key: 'openings', label: 'Doors and windows', unit: 'sq ft', unitKey: 'openingsUnit', unitOptions: AREA_UNITS, min: 0, step: 0.5, hint: 'A standard door is about 21 sq ft (2 m²).' },
    { key: 'rollWidth', label: 'Roll width', unit: 'in', unitKey: 'rollUnit', unitOptions: INCH_UNITS, min: 0.1, step: 0.1, hint: 'US rolls are often 20.5 or 27 in wide; European rolls 53 cm.' },
    { key: 'rollLength', label: 'Roll length', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0.1, step: 0.1, hint: 'A US double roll is often 33 ft; a European roll 10.05 m.' },
    { key: 'patternRepeat', label: 'Pattern repeat', unit: 'in', unitKey: 'rollUnit', unitOptions: INCH_UNITS, min: 0, step: 0.1, hint: 'On the label. Use 0 for plain paper or a random match.' },
    { key: 'price', label: 'Price per roll', unit: '$', min: 0, step: 0.01, optional: true },
  ],
  mulch: [
    { key: 'length', label: 'Bed length', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0.01, step: 0.1 },
    { key: 'width', label: 'Bed width', unit: 'ft', unitKey: 'dimensionUnit', unitOptions: DISTANCE_UNITS, min: 0.01, step: 0.1 },
    { key: 'depth', label: 'Mulch depth', unit: 'in', unitKey: 'depthUnit', unitOptions: INCH_UNITS, min: 0.01, step: 0.1 },
    { key: 'waste', label: 'Waste allowance', unit: '%', min: 0, step: 1 },
    { key: 'price', label: 'Price per cubic yard', unit: '$', min: 0, step: 0.01, optional: true },
  ],
};

const DEFAULTS: Record<CalculatorKind, Values> = {
  gravel: { length: 20, width: 10, depth: 3, density: 2700, waste: 10, price: 0, priceUnit: 0, dimensionUnit: 0, depthUnit: 1 },
  paint: { width: 12, height: 8, openings: 20, coats: 2, coverage: 350, waste: 0, price: 0, dimensionUnit: 0, openingsUnit: 0, coverageUnit: 0 },
  tile: { length: 10, width: 12, tileLength: 12, tileWidth: 12, grout: 0.125, waste: 10, boxSize: 10, price: 0, priceUnit: 0, dimensionUnit: 0, tileUnit: 1, groutUnit: 1 },
  concrete: { length: 10, width: 10, depth: 4, waste: 10, price: 0, dimensionUnit: 0, depthUnit: 1 },
  area: {},
  adhesive: { surfaceArea: 120, tileLength: 12, tileWidth: 12, tileThickness: 0.375, grout: 0.125, notch: -1, waste: 10, adhesiveBag: 50, groutBag: 25, openingsUnit: 0, tileUnit: 1, groutUnit: 1, weightUnit: 0 },
  masonry: { length: 20, height: 8, openings: 21, unit: 0, waste: 5, mortarYield: 0.6, packSize: 0, price: 0, dimensionUnit: 0, openingsUnit: 0, yieldUnit: 0 },
  insulation: { surfaceArea: 1000, openings: 150, board: 0, thickness: 2, waste: 5, supplies: 0, price: 0, openingsUnit: 0, depthUnit: 1 },
  screed: { surfaceArea: 150, thickness: 1.5, material: 0, consumption: 0, waste: 10, bagSize: 50, price: 0, openingsUnit: 0, depthUnit: 1, weightUnit: 0 },
  wallpaper: { length: 12, width: 10, height: 8, openings: 21, rollWidth: 20.5, rollLength: 33, patternRepeat: 0, price: 0, dimensionUnit: 0, openingsUnit: 0, rollUnit: 1 },
  mulch: { length: 10, width: 10, depth: 3, waste: 10, price: 0, dimensionUnit: 0, depthUnit: 1 },
  flooring: { length: 14, width: 12, boxArea: 20, waste: 10, price: 0, dimensionUnit: 0, boxAreaUnit: 0, baseboards: 1, doorways: 1, doorWidth: 3, pieceLength: 8, insideCorners: 4, outsideCorners: 0, transitions: 1, trimPrice: 0 },
  drywall: { length: 12, width: 10, height: 8, openings: 21, includeCeiling: 0, sheetSize: 0, waste: 10, price: 0, dimensionUnit: 0, openingsUnit: 0, supplies: 1, studSpacing: 16, spacingUnit: 1, studLength: 8 },
};

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './calculator.html',
  host: { '[class.zy-board]': '!embed()', '[attr.data-board]': 'board()', style: 'display: block' },
})
export class CalculatorPage {
  private readonly route = inject(ActivatedRoute);
  protected readonly calculator = signal<CalculatorInfo | null>(null);
  protected readonly sourcesChecked = SOURCES_CHECKED;
  protected readonly values = signal<Values>({});
  protected readonly board = computed(() => boardFor(this.calculator()?.kind));
  protected readonly result = signal<Estimate | null>(null);
  protected readonly error = signal('');
  protected readonly copied = signal(false);
  protected readonly linkCopied = signal(false);
  /** Values after the last reset, so a shared link carries only what the visitor changed. */
  private defaultValues: Values = {};
  protected readonly embed = signal(false);
  protected readonly embedUnits = signal<UnitSystem>('us');
  protected readonly embedCopied = signal(false);
  protected readonly fullUrl = computed(() => `${SITE_BASE_URL}/${this.calculator()?.slug ?? ''}/`);
  protected readonly embedCode = computed(() => {
    const calculator = this.calculator();
    if (!calculator) return '';
    const units = this.embedUnits() === 'metric' ? '?units=metric' : '';
    return [
      `<iframe src="${SITE_BASE_URL}/embed/${calculator.slug}/${units}" title="${calculator.title} by BuildCalc" width="100%" height="980" style="border:0;max-width:820px" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`,
      `<p style="font-size:14px"><a href="${this.fullUrl()}">${calculator.title}</a> by BuildCalc</p>`,
      // Optional: lets the iframe grow to fit, so visitors never scroll inside it.
      `<script>addEventListener("message",function(e){if(e.origin==="https://zyankov.eu"&&e.data&&e.data.type==="buildcalc-height"){document.querySelectorAll("iframe").forEach(function(f){if(f.contentWindow===e.source)f.style.height=e.data.height+"px"})}})</script>`,
    ].join('\n');
  });
  protected readonly areas = signal<AreaEntry[]>([{ length: 12, width: 10, unit: 'ft' }, { length: 14, width: 11, unit: 'ft' }]);
  private readonly unitPreference = inject(UnitPreferenceService);
  protected readonly unitSystem = this.unitPreference.system;
  private previousUnitSystem: UnitSystem = this.unitPreference.system();
  private readonly allFields = computed(() => {
    const kind = this.calculator()?.kind;
    const system = this.unitPreference.system();
    return kind && kind !== 'area'
      ? FORM_FIELDS[kind].map((field) => ({
        ...field,
        label: this.localizedFieldLabel(field, system),
        unitOptions: field.unitOptions?.filter((unit) => {
          if (field.unitKey === 'dimensionUnit') return system === 'us' ? US_DISTANCE_UNITS.some((item) => item.value === unit.value) : METRIC_DISTANCE_UNITS.some((item) => item.value === unit.value);
          if (field.unitKey === 'depthUnit' || field.unitKey === 'tileUnit' || field.unitKey === 'groutUnit' || field.unitKey === 'spacingUnit' || field.unitKey === 'rollUnit') return system === 'us' ? US_SMALL_UNITS.some((item) => item.value === unit.value) : METRIC_SMALL_UNITS.some((item) => item.value === unit.value);
          if (field.unitKey === 'openingsUnit' || field.unitKey === 'boxAreaUnit') return system === 'us' ? US_AREA_UNITS.some((item) => item.value === unit.value) : METRIC_AREA_UNITS.some((item) => item.value === unit.value);
          if (field.unitKey === 'densityUnit' || field.unitKey === 'coverageUnit' || field.unitKey === 'weightUnit' || field.unitKey === 'yieldUnit') return unit.value === (system === 'us' ? 0 : 1);
          return true;
        }),
      }))
      : [];
  });
  protected readonly fields = computed(() => this.allFields().filter((field) => !field.group));
  /** The optional section of a calculator: its title and the switch that turns it on. */
  protected readonly extra = computed(() => {
    const kind = this.calculator()?.kind;
    if (kind === 'flooring') return { key: 'baseboards', legend: 'Baseboards and trim', label: 'Baseboards', on: 'Include baseboards and trim', off: 'Flooring only' };
    if (kind === 'drywall') return { key: 'supplies', legend: 'Studs and finishing supplies', label: 'Supplies', on: 'Include studs, screws, tape and compound', off: 'Sheets only' };
    if (kind === 'insulation') return { key: 'supplies', legend: 'Exterior insulation supplies', label: 'Supplies', on: 'Include adhesive, base coat, mesh and anchors', off: 'Boards only' };
    return null;
  });
  /** Fields of the optional section: shown only when it is switched on. */
  protected readonly extraFields = computed(() => {
    const extra = this.extra();
    return extra && this.number(this.values(), extra.key) === 1 ? this.allFields().filter((field) => field.group === 'extra') : [];
  });

  protected readonly formattedRows = computed(() => (this.result()?.rows ?? [])
    .filter((row) => !(this.unitPreference.system() === 'metric' && row.label === 'Metric equivalent'))
    .map((row) => {
    const converted = this.convertResultRow(row);
    return { ...converted, displayValue: this.formatRow(converted) };
  }));
  protected readonly resultSummary = computed(() => {
    const result = this.result();
    const calculator = this.calculator();
    if (!result || !calculator || this.unitPreference.system() === 'us') return result?.summary ?? '';
    if (calculator.kind === 'area') return `${this.formattedRows().find((row) => row.label === 'Combined area')?.displayValue ?? ''} combined.`;
    const rows = this.formattedRows();
    const volume = rows.find((row) => row.label === 'Volume with waste');
    const weight = rows.find((row) => row.label === 'Estimated weight');
    const purchase = rows.find((row) => row.label === 'Whole-liter purchase');
    if (calculator.kind === 'paint' && purchase) return `Plan for ${purchase.displayValue}.`;
    if ((calculator.kind === 'concrete' || calculator.kind === 'mulch') && volume) return `${volume.displayValue} including waste.`;
    const boxes = rows.find((row) => row.label === 'Boxes needed');
    const boxed = rows.find((row) => row.label === 'Flooring in those boxes');
    const pieces = rows.find((row) => row.label === 'Baseboard pieces');
    if (calculator.kind === 'flooring' && boxes && boxed) return `Plan for ${boxes.displayValue} (${boxed.displayValue})${pieces ? ` and ${pieces.displayValue} of baseboard` : ''}, including waste.`;
    if (calculator.kind === 'gravel' && volume) return `${volume.displayValue}${weight ? ` (about ${weight.displayValue})` : ''} including waste.`;
    return result.summary;
  });

  constructor() {
    effect(() => {
      const system = this.unitPreference.system();
      if (system !== this.previousUnitSystem) {
        this.convertMeasurements(this.previousUnitSystem, system);
        this.previousUnitSystem = system;
      }
    });
    this.route.data.subscribe((data) => this.embed.set(data['embed'] === true));
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      // A shared link (?length=20&depth=4…) fills in the values and shows the estimate.
      if (this.embed() || !this.calculator() || this.calculator()?.kind === 'area') return;
      const params = this.route.snapshot.queryParamMap;
      const current = this.values();
      const shared: Values = {};
      for (const key of Object.keys(current)) {
        const raw = params.get(key);
        const value = raw === null ? NaN : Number(raw);
        if (Number.isFinite(value) && value >= 0) shared[key] = value;
      }
      if (Object.keys(shared).length === 0) return;
      this.values.set({ ...current, ...shared });
      this.calculate();
      track('open_shared', { calculator: this.calculator()?.kind ?? 'unknown' });
    });
    afterNextRender(() => {
      if (!this.embed()) return;
      // ?units=metric|us picks the units for this visit without touching the visitor's saved choice.
      const units = this.route.snapshot.queryParamMap.get('units');
      if ((units === 'metric' || units === 'us') && units !== this.unitPreference.system()) {
        this.unitPreference.useForVisit(units);
        this.previousUnitSystem = units;
        this.reset();
      }
      track('embed_view', { calculator: this.calculator()?.kind ?? 'unknown', host: this.embedHost() });
      // Tell the host page how tall the calculator is, so its iframe can fit it.
      if (window.parent === window || typeof ResizeObserver === 'undefined') return;
      const post = () => window.parent.postMessage({ type: 'buildcalc-height', height: Math.ceil(document.documentElement.scrollHeight) }, '*');
      const observer = new ResizeObserver(post);
      observer.observe(document.body);
      destroyRef.onDestroy(() => observer.disconnect());
    });
    this.route.paramMap.subscribe((params) => {
      const calculator = CALCULATORS.find((item) => item.slug === params.get('slug')) ?? null;
      this.calculator.set(calculator);
      if (calculator) this.reset();
    });
  }

  protected setValue(key: string, value: number): void {
    this.values.update((current) => ({ ...current, [key]: Number(value) }));
    this.noteEmbedUse();
  }

  /** The site an embedded calculator sits on, from the referrer (browsers send at least the origin). */
  private embedHost(): string {
    try {
      return document.referrer ? new URL(document.referrer).hostname || 'unknown' : 'unknown';
    } catch {
      return 'unknown'
    }
  }

  private embedUsed = false;

  /** Counts an embed as used (once per visit) when someone changes a value, not just opens it. */
  private noteEmbedUse(): void {
    if (!this.embed() || this.embedUsed) return;
    this.embedUsed = true;
    track('embed_use', { calculator: this.calculator()?.kind ?? 'unknown', host: this.embedHost() });
  }

  protected setUnitValue(key: string, value: number): void {
    this.noteEmbedUse();
    const nextUnit = Number(value);
    this.values.update((current) => {
      const updated = { ...current };
      const unitKey = key;
      const previousUnit = this.number(current, unitKey);
      const valueKeys = ({
        dimensionUnit: ['length', 'width', 'height', 'doorWidth', 'pieceLength', 'studLength', 'rollLength'],
        boxAreaUnit: ['boxArea'],
        depthUnit: ['depth', 'thickness'],
        spacingUnit: ['studSpacing'],
        rollUnit: ['rollWidth', 'patternRepeat'],
        tileUnit: ['tileLength', 'tileWidth', 'tileThickness'],
        groutUnit: ['grout'],
        openingsUnit: ['openings', 'surfaceArea'],
        weightUnit: ['adhesiveBag', 'groutBag', 'bagSize'],
        yieldUnit: ['mortarYield'],
        densityUnit: ['density'],
        coverageUnit: ['coverage'],
      }[unitKey] ?? []).filter((candidate) => current[candidate] !== undefined);
      for (const valueKey of valueKeys) {
        const currentValue = this.number(current, valueKey);
        if (unitKey === 'openingsUnit' || unitKey === 'boxAreaUnit') updated[valueKey] = this.convertArea(currentValue, previousUnit, nextUnit);
        else if (unitKey === 'densityUnit') updated[valueKey] = tidy(previousUnit === 0 ? currentValue * 0.593276 : currentValue / 0.593276);
        else if (unitKey === 'yieldUnit') updated[valueKey] = tidy(previousUnit === nextUnit ? currentValue : nextUnit === 1 ? currentValue * 28.3168466 : currentValue / 28.3168466);
        else if (unitKey === 'weightUnit') updated[valueKey] = tidy(previousUnit === nextUnit ? currentValue : nextUnit === 1 ? currentValue * 0.45359237 : currentValue / 0.45359237);
        else if (unitKey === 'coverageUnit') updated[valueKey] = tidy(previousUnit === 0 ? currentValue / 40.745 : currentValue * 40.745);
        else updated[valueKey] = this.convertLength(currentValue, previousUnit, nextUnit);
      }
      updated[unitKey] = nextUnit;
      return updated;
    });
  }

  protected calculate(): void {
    const calculator = this.calculator();
    if (!calculator) return;
    this.error.set('');
    try {
      let estimate: Estimate;
      switch (calculator.kind) {
        case 'gravel': estimate = calculateGravel(this.toGravelInput(this.values())); break;
        case 'paint': estimate = calculatePaint(this.toPaintInput(this.values())); break;
        case 'tile': estimate = calculateTile(this.toTileInput(this.values())); break;
        case 'concrete': estimate = calculateConcrete(this.toConcreteInput(this.values())); break;
        case 'mulch': estimate = calculateMulch(this.toMulchInput(this.values())); break;
        case 'area': estimate = calculateArea(this.areas()); break;
        case 'flooring': estimate = calculateFlooring(this.toFlooringInput(this.values())); break;
        case 'drywall': estimate = calculateDrywall(this.toDrywallInput(this.values())); break;
        case 'adhesive': estimate = calculateAdhesive(this.toAdhesiveInput(this.values())); break;
        case 'wallpaper': estimate = calculateWallpaper(this.toWallpaperInput(this.values())); break;
        case 'screed': estimate = calculateScreed(this.toScreedInput(this.values())); break;
        case 'insulation': estimate = calculateInsulation(this.toInsulationInput(this.values())); break;
        case 'masonry': estimate = calculateMasonry(this.toMasonryInput(this.values())); break;
      }
      this.result.set(estimate);
      this.copied.set(false);
      track('calculate', { calculator: calculator.kind, units: this.unitPreference.system() });
    } catch (error: unknown) {
      this.result.set(null);
      this.error.set(error instanceof Error ? error.message : 'Please check your measurements and try again.');
    }
  }

  protected reset(): void {
    const kind = this.calculator()?.kind;
    if (!kind) return;
    const metric = this.unitPreference.system() === 'metric';
    const defaults = { ...DEFAULTS[kind] };
    if (metric) {
      for (const key of ['length', 'width', 'height']) {
        if (defaults[key] !== undefined) defaults[key] = Number(this.convertLength(defaults[key], 0, 2).toFixed(2));
      }
      if (kind === 'flooring') {
        defaults['doorWidth'] = 0.9;
        defaults['pieceLength'] = 2.5;
      }
      if (kind === 'drywall') {
        defaults['studSpacing'] = 60;
        defaults['spacingUnit'] = 3;
        defaults['studLength'] = 3;
      }
      if (defaults['boxArea'] !== undefined) {
        defaults['boxArea'] = Number(this.convertArea(defaults['boxArea'], 0, 2).toFixed(2));
        defaults['boxAreaUnit'] = 2;
      }
      if (defaults['sheetSize'] !== undefined) defaults['sheetSize'] = 4;
      for (const key of ['depth', 'tileLength', 'tileWidth', 'grout']) {
        if (defaults[key] !== undefined) defaults[key] = Number(this.convertLength(defaults[key], 1, 3).toFixed(key === 'grout' ? 2 : 1));
      }
      if (defaults['openings'] !== undefined) defaults['openings'] = Number(this.convertArea(defaults['openings'], 0, 2).toFixed(2));
      defaults['dimensionUnit'] = 2;
      defaults['depthUnit'] = 3;
      defaults['tileUnit'] = 3;
      defaults['groutUnit'] = 3;
      defaults['openingsUnit'] = 2;
      defaults['densityUnit'] = 1;
      defaults['coverageUnit'] = 1;
      if (kind === 'gravel') defaults['density'] = 1600;
      if (kind === 'masonry') {
        Object.assign(defaults, { length: 10, height: 2.8, openings: 4, unit: 4, mortarYield: 16, yieldUnit: 1 });
      }
      if (kind === 'insulation') {
        Object.assign(defaults, { surfaceArea: 100, openings: 15, board: 2, thickness: 10, depthUnit: 3 });
      }
      if (kind === 'screed') {
        Object.assign(defaults, { surfaceArea: 15, thickness: 40, depthUnit: 4, bagSize: 25, weightUnit: 1 });
      }
      if (kind === 'wallpaper') {
        Object.assign(defaults, { length: 4, width: 3.5, height: 2.6, openings: 1.8, rollWidth: 53, rollLength: 10.05, rollUnit: 3 });
      }
      if (kind === 'adhesive') {
        Object.assign(defaults, { surfaceArea: 12, tileLength: 60, tileWidth: 60, tileThickness: 1, grout: 0.3, adhesiveBag: 25, groutBag: 5, weightUnit: 1 });
      }
      if (kind === 'paint') {
        defaults['coverage'] = 9;
        defaults['openings'] = 1.86;
      }
    }
    this.values.set(defaults);
    this.defaultValues = { ...defaults };
    if (kind === 'area') {
      const unit: AreaEntry['unit'] = metric ? 'm' : 'ft';
      this.areas.set([{ length: metric ? 3.66 : 12, width: metric ? 3.05 : 10, unit }, { length: metric ? 4.27 : 14, width: metric ? 3.35 : 11, unit }]);
    }
    this.result.set(null);
    this.error.set('');
    this.copied.set(false);
  }

  protected addArea(): void {
    const unit: AreaEntry['unit'] = this.unitPreference.system() === 'metric' ? 'm' : 'ft';
    this.areas.update((areas) => [...areas, { length: 0, width: 0, unit }]);
  }

  protected removeArea(index: number): void {
    this.areas.update((areas) => areas.filter((_, itemIndex) => itemIndex !== index));
    this.result.set(null);
  }

  protected setAreaValue(index: number, key: 'length' | 'width', value: number): void {
    this.noteEmbedUse();
    this.areas.update((areas) => areas.map((area, itemIndex) => itemIndex === index ? { ...area, [key]: Number(value) } : area));
  }

  protected setAreaUnit(index: number, event: Event): void {
    const selected = (event.target as HTMLSelectElement).value;
    const unit: AreaEntry['unit'] = selected === 'in' || selected === 'm' || selected === 'cm' ? selected : 'ft';
    this.areas.update((areas) => areas.map((area, itemIndex) => itemIndex === index ? {
      length: this.convertAreaLength(area.length, area.unit, unit),
      width: this.convertAreaLength(area.width, area.unit, unit),
      unit,
    } : area));
  }

  protected guideSlug(slug: string): string | undefined {
    return GUIDES.find((guide) => guide.calculatorSlug === slug)?.slug;
  }

  protected relatedCalculators(slug: string): CalculatorInfo[] {
    const picked = (RELATED_SLUGS[slug] ?? []).map((related) => CALCULATORS.find((item) => item.slug === related)).filter((item): item is CalculatorInfo => Boolean(item));
    return picked.length ? picked : CALCULATORS.filter((item) => item.slug !== slug).slice(0, 3);
  }

  protected article(slug: string) {
    return ARTICLES[slug];
  }

  protected limitationFor(kind: CalculatorKind): string {
    const limitations: Record<CalculatorKind, string> = {
      gravel: 'Gravel density depends on material, moisture, and compaction. Confirm the density and order quantity with your supplier.',
      paint: 'Paint coverage varies by product and surface. This estimate covers one rectangular wall; check the label and account for other surfaces separately.',
      tile: 'Tile coverage is approximate for a basic rectangular layout and does not model complex cuts, patterns, diagonal layouts, or irregular rooms.',
      concrete: 'This estimates volume only. It does not replace structural engineering, local codes, reinforcement design, or placement requirements.',
      area: 'This totals rectangular measurements. Break irregular shapes into separate rectangles without overlap.',
      mulch: 'Depth needs vary with material and intended use. Follow local horticultural guidance and keep mulch clear of plant stems and trunks.',
      flooring: 'This covers a rectangular room. Add closets and alcoves as extra area, check the coverage on your box and follow the manufacturer’s expansion-gap and underlayment instructions.',
      masonry: 'This counts units for a plain wall with standard joints. Corners, lintels, half units and cutting around openings are not modeled, and mortar varies with the joint and the mason: the mortar here is the theoretical joint volume (BIA), while QUIKRETE rates an 80 lb bag of Mason Mix at up to 37 bricks or 13 blocks, so buy extra. It is not a structural design.',
      insulation: 'This counts boards for flat walls. Corners, reveals around windows and starter tracks are not included, and the supply rates are typical values; anchor patterns depend on wind load and building height, so follow the system manufacturer or your designer.',
      screed: 'Consumption is a typical value from manufacturers’ data sheets; your product may differ, so enter its own figure when you have it. Uneven floors and walls vary in thickness, so measure in several places. This is not a structural or moisture assessment.',
      wallpaper: 'This assumes a rectangular room with walls of one height and whole strips from floor to ceiling. Sloped ceilings, alcoves and half-drop patterns can need more; keep a spare roll from the same batch.',
      adhesive: 'Consumption depends on the adhesive, the evenness of the surface and how well the tiles are bedded. The trowel figures are typical values for cement adhesive (Ceresit CM 11); check your product’s data sheet. Grout assumes joints filled to the full tile thickness.',
      drywall: 'This counts sheets for flat walls and ceilings. Studs and tracks are for the four walls only (not ceiling framing or extra studs around openings), and screws, tape and compound use rules of thumb, so check your manufacturer’s figures. Corner bead and building-code requirements such as fire-rated or moisture-resistant board are not included.',
    };
    return limitations[kind];
  }

  protected printResults(): void {
    if (typeof window !== 'undefined') window.print();
  }

  protected async copyResults(): Promise<void> {
    const calculator = this.calculator();
    const result = this.result();
    if (!calculator || !result) return;
    const summary = `${calculator.title}\n${this.resultSummary()}\n${this.formattedRows().map((row) => `${row.label}: ${row.displayValue}`).join('\n')}`;
    try {
      if (!navigator.clipboard) throw new Error('Clipboard access is unavailable.');
      await navigator.clipboard.writeText(summary);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    } catch {
      this.error.set('Your browser could not copy the results. Select and copy them manually.');
    }
  }

  /** Link to this calculator with the changed values; unit choices always travel with them. */
  protected async shareLink(): Promise<void> {
    const calculator = this.calculator();
    if (!calculator || typeof window === 'undefined') return;
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(this.values())) {
      if (key.endsWith('Unit') || value !== this.defaultValues[key]) query.set(key, String(value));
    }
    const path = window.location.pathname.endsWith('/') ? window.location.pathname : `${window.location.pathname}/`;
    const url = `${window.location.origin}${path}?${query.toString()}`;
    try {
      if (!navigator.clipboard) throw new Error('Clipboard access is unavailable.');
      await navigator.clipboard.writeText(url);
      this.linkCopied.set(true);
      setTimeout(() => this.linkCopied.set(false), 2500);
      track('share_link', { calculator: calculator.kind });
    } catch {
      this.error.set(`Your browser could not copy the link. Copy it from here: ${url}`);
    }
  }

  protected setEmbedUnits(event: Event): void {
    this.embedUnits.set((event.target as HTMLSelectElement).value === 'metric' ? 'metric' : 'us');
  }

  protected async copyEmbed(): Promise<void> {
    const calculator = this.calculator();
    if (!calculator) return;
    try {
      if (!navigator.clipboard) throw new Error('Clipboard access is unavailable.');
      await navigator.clipboard.writeText(this.embedCode());
      this.embedCopied.set(true);
      setTimeout(() => this.embedCopied.set(false), 2500);
      track('embed_copy', { calculator: calculator.kind, units: this.embedUnits() });
    } catch {
      this.embedCopied.set(false);
    }
  }

  private convertMeasurements(from: UnitSystem, to: UnitSystem): void {
    const values = { ...this.values() };
    const targetLength = to === 'us' ? 0 : 2;
    const sourceSmall = from === 'us' ? 1 : 3;
    const targetSmall = to === 'us' ? 1 : 3;
    const targetArea = to === 'us' ? 0 : 2;

    for (const key of ['length', 'width', 'height', 'doorWidth', 'pieceLength', 'studLength', 'rollLength']) {
      if (values[key] !== undefined) {
        values[key] = this.convertLength(this.number(values, key), this.number(values, 'dimensionUnit'), targetLength);
      }
    }
    if (values['boxArea'] !== undefined) {
      values['boxArea'] = this.convertArea(this.number(values, 'boxArea'), this.number(values, 'boxAreaUnit'), targetArea);
      values['boxAreaUnit'] = targetArea;
    }
    // Sheet sizes differ by market: switch to the common size for the new system.
    if (values['sheetSize'] !== undefined) values['sheetSize'] = to === 'us' ? 0 : 4;
    // Read every unit before converting: several values share one unit (tile length, width and thickness).
    const sourceUnits = { ...this.values() };
    for (const key of ['depth', 'thickness', 'tileLength', 'tileWidth', 'tileThickness', 'grout', 'studSpacing', 'rollWidth', 'patternRepeat']) {
      const unitKey = key === 'tileLength' || key === 'tileWidth' || key === 'tileThickness' ? 'tileUnit' : key === 'grout' ? 'groutUnit' : key === 'studSpacing' ? 'spacingUnit' : key === 'rollWidth' || key === 'patternRepeat' ? 'rollUnit' : 'depthUnit';
      if (values[key] !== undefined) {
        const currentUnit = sourceUnits[unitKey] ?? sourceSmall;
        values[key] = this.convertLength(this.number(values, key), currentUnit, targetSmall);
        values[unitKey] = targetSmall;
      }
    }
    if (values['dimensionUnit'] !== undefined) values['dimensionUnit'] = targetLength;
    for (const key of ['openings', 'surfaceArea']) {
      if (values[key] !== undefined) values[key] = this.convertArea(this.number(values, key), this.number(values, 'openingsUnit'), targetArea);
    }
    if (values['openingsUnit'] !== undefined) values['openingsUnit'] = targetArea;
    // Bags come in different sizes in each market: switch to the common ones.
    if (values['adhesiveBag'] !== undefined) {
      Object.assign(values, to === 'us' ? { adhesiveBag: 50, groutBag: 25, weightUnit: 0 } : { adhesiveBag: 25, groutBag: 5, weightUnit: 1 });
    }
    if (values['bagSize'] !== undefined) Object.assign(values, to === 'us' ? { bagSize: 50, weightUnit: 0 } : { bagSize: 25, weightUnit: 1 });
    if (values['mortarYield'] !== undefined) Object.assign(values, to === 'us' ? { mortarYield: 0.6, yieldUnit: 0 } : { mortarYield: 16, yieldUnit: 1 });
    if (values['density'] !== undefined) {
      const current = this.number(values, 'density');
      values['density'] = tidy(from === 'us' ? current * 0.593276 : current / 0.593276);
      values['densityUnit'] = to === 'us' ? 0 : 1;
    }
    if (values['coverage'] !== undefined) {
      const current = this.number(values, 'coverage');
      values['coverage'] = tidy(from === 'us' ? current / 40.745 : current * 40.745);
      values['coverageUnit'] = to === 'us' ? 0 : 1;
    }
    const price = this.number(values, 'price');
    if (price > 0) {
      const kind = this.calculator()?.kind;
      const isMetric = to === 'metric';
      if (kind === 'gravel') {
        const rateFactor = values['priceUnit'] === 1 ? 1 / 0.764554858 : 1.10231131;
        values['price'] = tidy(isMetric ? price * rateFactor : price / rateFactor);
      } else if (kind === 'paint') {
        values['price'] = tidy(isMetric ? price / 3.785411784 : price * 3.785411784);
      } else if (kind === 'concrete' || kind === 'mulch') {
        values['price'] = tidy(isMetric ? price / 0.764554858 : price * 0.764554858);
      }
    }
    this.values.set(values);
    this.areas.update((areas) => areas.map((area) => {
      const targetUnit: AreaEntry['unit'] = to === 'us' ? 'ft' : 'm';
      return {
        length: this.convertAreaLength(area.length, area.unit, targetUnit),
        width: this.convertAreaLength(area.width, area.unit, targetUnit),
        unit: targetUnit,
      };
    }));
    this.result.set(null);
  }

  private localizedFieldLabel(field: Field, system: UnitSystem): string {
    if (system === 'us') return field.label;
    const labels: Record<string, string> = {
      'Price per unit': 'Price per metric tonne or cubic meter',
      'Price per gallon': 'Price per liter',
      'Price per cubic yard': 'Price per cubic meter',
    };
    return labels[field.label] ?? field.label;
  }

  private convertLength(value: number, fromUnit: number, toUnit: number): number {
    const feetByUnit: Record<number, number> = { 0: 1, 1: 1 / 12, 2: 3.280839895, 3: 1 / 30.48, 4: 1 / 304.8 };
    const feet = value * (feetByUnit[fromUnit] ?? 1);
    return tidy(feet / (feetByUnit[toUnit] ?? 1));
  }

  private convertArea(value: number, fromUnit: number, toUnit: number): number {
    const sqFtByUnit: Record<number, number> = { 0: 1, 1: 1 / 144, 2: 10.7639104, 3: 1 / 929.0304 };
    const squareFeet = value * (sqFtByUnit[fromUnit] ?? 1);
    return tidy(squareFeet / (sqFtByUnit[toUnit] ?? 1));
  }

  private convertAreaLength(value: number, from: AreaEntry['unit'], to: AreaEntry['unit']): number {
    const feetByUnit: Record<AreaEntry['unit'], number> = { ft: 1, in: 1 / 12, m: 3.280839895, cm: 1 / 30.48 };
    return tidy(value * feetByUnit[from] / feetByUnit[to]);
  }

  private formatRow(row: EstimateRow): string {
    const number = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: row.precision ?? 2,
      maximumFractionDigits: row.precision ?? 2,
    }).format(row.value);
    return row.unit === 'USD' ? `$${number}` : `${number} ${row.unit}`;
  }

  private convertResultRow(row: EstimateRow): EstimateRow {
    if (this.unitPreference.system() === 'us') return row;
    const conversions: Record<string, { label: string; unit: string; factor: number | ((value: number) => number); precision: number }> = {
      'sq ft': { label: row.label, unit: 'sq m', factor: 0.09290304, precision: 2 },
      'sq ft per tile': { label: row.label, unit: 'sq m per tile', factor: 0.09290304, precision: 4 },
      'cu ft': { label: row.label, unit: 'cu m', factor: 0.0283168466, precision: 3 },
      'cu yd': { label: row.label, unit: 'cu m', factor: 0.764554858, precision: 3 },
      'US tons': { label: row.label, unit: 'metric tonnes', factor: 0.90718474, precision: 2 },
      gallons: { label: row.label, unit: 'liters', factor: 3.785411784, precision: 2 },
      ft: { label: row.label, unit: 'm', factor: 0.3048, precision: 2 },
      lb: { label: row.label, unit: 'kg', factor: 0.45359237, precision: 1 },
      'per sq ft': { label: 'Units per sq m', unit: 'per sq m', factor: 10.7639104, precision: 2 },
    };
    const conversion = conversions[row.unit];
    if (!conversion) return row;
    return {
      ...row,
      label: conversion.label,
      value: typeof conversion.factor === 'number' ? row.value * conversion.factor : conversion.factor(row.value),
      unit: conversion.unit,
      precision: conversion.precision,
    };
  }

  private number(values: Values, key: string): number {
    return Number(values[key] ?? 0);
  }

  private toGravelInput(values: Values): GravelInput {
    return {
      length: this.number(values, 'length'),
      width: this.number(values, 'width'),
      depth: this.number(values, 'depth'),
      density: this.number(values, 'density'),
      waste: this.number(values, 'waste'),
      price: this.number(values, 'price'),
      priceUnit: this.number(values, 'priceUnit'),
      dimensionUnit: this.number(values, 'dimensionUnit'),
      depthUnit: this.number(values, 'depthUnit'),
      densityUnit: this.number(values, 'densityUnit'),
      metricPrice: this.unitPreference.system() === 'metric',
    };
  }

  private toPaintInput(values: Values): PaintInput {
    return {
      width: this.number(values, 'width'),
      height: this.number(values, 'height'),
      openings: this.number(values, 'openings'),
      coats: this.number(values, 'coats'),
      coverage: this.number(values, 'coverage'),
      waste: this.number(values, 'waste'),
      price: this.number(values, 'price'),
      dimensionUnit: this.number(values, 'dimensionUnit'),
      openingsUnit: this.number(values, 'openingsUnit'),
      coverageUnit: this.number(values, 'coverageUnit'),
      metricPrice: this.unitPreference.system() === 'metric',
    };
  }

  private toTileInput(values: Values): TileInput {
    return {
      length: this.number(values, 'length'),
      width: this.number(values, 'width'),
      tileLength: this.number(values, 'tileLength'),
      tileWidth: this.number(values, 'tileWidth'),
      grout: this.number(values, 'grout'),
      waste: this.number(values, 'waste'),
      boxSize: this.number(values, 'boxSize'),
      price: this.number(values, 'price'),
      priceUnit: this.number(values, 'priceUnit'),
      dimensionUnit: this.number(values, 'dimensionUnit'),
      tileUnit: this.number(values, 'tileUnit'),
      groutUnit: this.number(values, 'groutUnit'),
    };
  }

  private toConcreteInput(values: Values): ConcreteInput {
    return {
      length: this.number(values, 'length'),
      width: this.number(values, 'width'),
      depth: this.number(values, 'depth'),
      waste: this.number(values, 'waste'),
      price: this.number(values, 'price'),
      dimensionUnit: this.number(values, 'dimensionUnit'),
      depthUnit: this.number(values, 'depthUnit'),
      metricPrice: this.unitPreference.system() === 'metric',
    };
  }

  /** Sheet sizes offered for the current measurement system. */
  protected readonly sheetOptions = computed(() => DRYWALL_SHEETS
    .map((sheet, index) => ({ value: index, label: sheet.label }))
    .filter((sheet) => this.unitPreference.system() === 'us' ? sheet.value < 3 : sheet.value >= 3));

  private toFlooringInput(values: Values): FlooringInput {
    return {
      length: this.number(values, 'length'),
      width: this.number(values, 'width'),
      waste: this.number(values, 'waste'),
      boxArea: this.number(values, 'boxArea'),
      price: this.number(values, 'price'),
      dimensionUnit: this.number(values, 'dimensionUnit'),
      boxAreaUnit: this.number(values, 'boxAreaUnit'),
      baseboards: this.number(values, 'baseboards') === 1,
      doorways: this.number(values, 'doorways'),
      doorWidth: this.number(values, 'doorWidth'),
      pieceLength: this.number(values, 'pieceLength'),
      insideCorners: this.number(values, 'insideCorners'),
      outsideCorners: this.number(values, 'outsideCorners'),
      transitions: this.number(values, 'transitions'),
      trimPrice: this.number(values, 'trimPrice'),
    };
  }

  private toDrywallInput(values: Values): DrywallInput {
    return {
      length: this.number(values, 'length'),
      width: this.number(values, 'width'),
      height: this.number(values, 'height'),
      openings: this.number(values, 'openings'),
      includeCeiling: this.number(values, 'includeCeiling') === 1,
      sheetSize: this.number(values, 'sheetSize'),
      waste: this.number(values, 'waste'),
      price: this.number(values, 'price'),
      dimensionUnit: this.number(values, 'dimensionUnit'),
      openingsUnit: this.number(values, 'openingsUnit'),
      supplies: this.number(values, 'supplies') === 1,
      studSpacing: this.number(values, 'studSpacing'),
      spacingUnit: this.number(values, 'spacingUnit'),
      studLength: this.number(values, 'studLength'),
    };
  }

  /** Trowel notch choices: -1 lets the calculator pick one from the tile size. */
  protected readonly notchOptions = [{ value: -1, label: 'Suggest from tile size' }, ...TROWEL_NOTCHES.map((notch, index) => ({ value: index, label: notch.label }))];

  protected readonly materialOptions = SCREED_MATERIALS.map((material, index) => ({ value: index, label: `${material.label} (about ${material.kgPerM2PerMm} kg/m² per mm)` }));

  protected readonly boardOptions = INSULATION_BOARDS.map((board, index) => ({ value: index, label: board.label }));

  protected readonly unitOptions = MASONRY_UNITS.map((unit, index) => ({ value: index, label: unit.label }));

  private toMasonryInput(values: Values): MasonryInput {
    return {
      length: this.number(values, 'length'),
      height: this.number(values, 'height'),
      openings: this.number(values, 'openings'),
      unit: this.number(values, 'unit'),
      waste: this.number(values, 'waste'),
      mortarYield: this.number(values, 'mortarYield'),
      price: this.number(values, 'price'),
      packSize: this.number(values, 'packSize'),
      dimensionUnit: this.number(values, 'dimensionUnit'),
      openingsUnit: this.number(values, 'openingsUnit'),
      yieldUnit: this.number(values, 'yieldUnit'),
    };
  }

  private toInsulationInput(values: Values): InsulationInput {
    return {
      surfaceArea: this.number(values, 'surfaceArea'),
      openings: this.number(values, 'openings'),
      board: this.number(values, 'board'),
      thickness: this.number(values, 'thickness'),
      waste: this.number(values, 'waste'),
      supplies: this.number(values, 'supplies') === 1,
      price: this.number(values, 'price'),
      openingsUnit: this.number(values, 'openingsUnit'),
      depthUnit: this.number(values, 'depthUnit'),
    };
  }

  private toScreedInput(values: Values): ScreedInput {
    return {
      surfaceArea: this.number(values, 'surfaceArea'),
      thickness: this.number(values, 'thickness'),
      material: this.number(values, 'material'),
      consumption: this.number(values, 'consumption'),
      waste: this.number(values, 'waste'),
      bagSize: this.number(values, 'bagSize'),
      price: this.number(values, 'price'),
      openingsUnit: this.number(values, 'openingsUnit'),
      depthUnit: this.number(values, 'depthUnit'),
      weightUnit: this.number(values, 'weightUnit'),
    };
  }

  private toWallpaperInput(values: Values): WallpaperInput {
    return {
      length: this.number(values, 'length'),
      width: this.number(values, 'width'),
      height: this.number(values, 'height'),
      openings: this.number(values, 'openings'),
      rollWidth: this.number(values, 'rollWidth'),
      rollLength: this.number(values, 'rollLength'),
      patternRepeat: this.number(values, 'patternRepeat'),
      price: this.number(values, 'price'),
      dimensionUnit: this.number(values, 'dimensionUnit'),
      openingsUnit: this.number(values, 'openingsUnit'),
      rollUnit: this.number(values, 'rollUnit'),
    };
  }

  private toAdhesiveInput(values: Values): AdhesiveInput {
    return {
      surfaceArea: this.number(values, 'surfaceArea'),
      tileLength: this.number(values, 'tileLength'),
      tileWidth: this.number(values, 'tileWidth'),
      tileThickness: this.number(values, 'tileThickness'),
      grout: this.number(values, 'grout'),
      notch: this.number(values, 'notch'),
      waste: this.number(values, 'waste'),
      adhesiveBag: this.number(values, 'adhesiveBag'),
      groutBag: this.number(values, 'groutBag'),
      openingsUnit: this.number(values, 'openingsUnit'),
      tileUnit: this.number(values, 'tileUnit'),
      groutUnit: this.number(values, 'groutUnit'),
      weightUnit: this.number(values, 'weightUnit'),
    };
  }

  private toMulchInput(values: Values): MulchInput {
    return {
      length: this.number(values, 'length'),
      width: this.number(values, 'width'),
      depth: this.number(values, 'depth'),
      waste: this.number(values, 'waste'),
      price: this.number(values, 'price'),
      dimensionUnit: this.number(values, 'dimensionUnit'),
      depthUnit: this.number(values, 'depthUnit'),
      metricPrice: this.unitPreference.system() === 'metric',
    };
  }
}
