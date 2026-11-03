import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ContentPage } from './content';

describe('ContentPage contact', () => {
  it('provides the published contact email instead of a non-delivering form', () => {
    TestBed.configureTestingModule({
      imports: [ContentPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: () => null },
              data: { contentKey: 'contact' },
            },
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(ContentPage);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('a[href="mailto:hello@zyankov.eu"]')?.textContent).toContain('hello@zyankov.eu');
    expect(root.querySelector('form.contact-form')).toBeNull();
  });
});
