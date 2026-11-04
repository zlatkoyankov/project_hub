import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { UnitPreferenceService } from '../core/unit-preference.service';
import { CalculatorPage } from './calculator';

function render(slug: string, system: 'us' | 'metric' = 'us', data: Record<string, unknown> = {}) {
  localStorage.clear();
  TestBed.configureTestingModule({
    imports: [CalculatorPage],
    providers: [
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: { paramMap: of(convertToParamMap({ slug })), data: of(data), snapshot: { queryParamMap: convertToParamMap({}) } },
      },
    ],
  });
  TestBed.inject(UnitPreferenceService).setSystem(system);
  const fixture = TestBed.createComponent(CalculatorPage);
  fixture.detectChanges();
  return fixture;
}

const submit = (fixture: ReturnType<typeof render>) => {
  (fixture.nativeElement as HTMLElement).querySelector('form')!.dispatchEvent(new Event('submit'));
  fixture.detectChanges();
};

describe('CalculatorPage', () => {
  it('offers embed code that links back to the full calculator', () => {
    const fixture = render('gravel-calculator');
    const code = (fixture.nativeElement as HTMLElement).querySelector<HTMLTextAreaElement>('#embed-code')!.value;
    expect(code).toContain('src="https://zyankov.eu/calculators/embed/gravel-calculator/"');
    expect(code).toContain('href="https://zyankov.eu/calculators/gravel-calculator/"');
  });

  it('renders only the calculator and a credit link when embedded', () => {
    const element = render('gravel-calculator', 'us', { embed: true }).nativeElement as HTMLElement;
    expect(element.querySelector('form.calculator-form')).not.toBeNull();
    expect(element.querySelector('.calc-head, .embed-section, .related-section, .calculator-faq')).toBeNull();
    expect(element.querySelector('.embed-credit a')?.getAttribute('target')).toBe('_blank');
  });

  it('shows metric units only in the combined area summary when metric is selected', () => {
    const fixture = render('square-footage-calculator', 'metric');
    submit(fixture);
    const text = (fixture.nativeElement as HTMLElement).querySelector('.results-card')!.textContent!;
    expect(text).toContain('sq m');
    expect(text).not.toMatch(/square feet|sq ft/);
    expect(text.match(/Metric equivalent/g)).toBeNull();
  });

  it('reports whole liters for metric paint', () => {
    const fixture = render('paint-calculator', 'metric');
    submit(fixture);
    const text = (fixture.nativeElement as HTMLElement).querySelector('.results-card')!.textContent!;
    expect(text).toMatch(/Whole-liter purchase/);
    expect(text).not.toMatch(/gallon/);
  });

  it('shows a validation error and clears results for invalid input', async () => {
    const fixture = render('concrete-calculator');
    await fixture.whenStable();
    fixture.detectChanges();
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('#calc-length')!;
    input.value = '0';
    input.dispatchEvent(new Event('input'));
    submit(fixture);
    expect((fixture.nativeElement as HTMLElement).querySelector('[role="alert"]')?.textContent).toMatch(/greater than zero/i);
  });

  it('does not render an empty advertisement placeholder', () => {
    const fixture = render('gravel-calculator');
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('app-ad-slot, .ad-slot-wrap, .ad-slot')).toBeNull();
  });
});

describe('UnitPreferenceService', () => {
  it('persists the selected system', () => {
    localStorage.clear();
    TestBed.inject(UnitPreferenceService).setSystem('metric');
    expect(localStorage.getItem('buildcalc-units')).toBe('metric');
  });
});

describe('CalculatorPage unit conversion', () => {
  it('shows tidy converted values when switching to metric', async () => {
    const fixture = render('gravel-calculator');
    await fixture.whenStable();
    TestBed.inject(UnitPreferenceService).setSystem('metric');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const length = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('#calc-length')!;
    expect(length.value).toBe('6.096');
  });
});
