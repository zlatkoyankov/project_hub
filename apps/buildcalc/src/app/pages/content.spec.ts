import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ContentPage } from './content';

describe('ContentPage', () => {
  it('renders the About page and points feedback to the published email address', () => {
    TestBed.configureTestingModule({
      imports: [ContentPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: () => null },
              data: { contentKey: 'about' },
            },
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(ContentPage);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('h1')?.textContent).toContain('About BuildCalc');
    expect(root.textContent).toContain('hello@zyankov.eu');
  });
});

describe('RELATED_GUIDES', () => {
  it('only names existing guides, never the guide itself, and gives every guide at least one inbound link', async () => {
    const { RELATED_GUIDES } = await import('./content');
    const { GUIDES } = await import('../data/guides');
    const slugs = GUIDES.map((guide) => guide.slug);
    const inbound = new Map(slugs.map((slug) => [slug, 0]));
    for (const [slug, targets] of Object.entries(RELATED_GUIDES)) {
      expect(slugs).toContain(slug);
      expect(new Set(targets).size).toBe(targets.length);
      for (const target of targets) {
        expect(slugs).toContain(target);
        expect(target).not.toBe(slug);
        inbound.set(target, (inbound.get(target) ?? 0) + 1);
      }
    }
    for (const slug of slugs) {
      expect(RELATED_GUIDES[slug]?.length).toBeGreaterThan(1);
      expect(inbound.get(slug)).toBeGreaterThan(0);
    }
  });
});
