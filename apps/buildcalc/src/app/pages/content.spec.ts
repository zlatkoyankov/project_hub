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
