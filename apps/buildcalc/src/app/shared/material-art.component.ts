import { Component, computed, input } from '@angular/core';

/** What each picture shows, for the alt text (search engines and screen readers). */
const ALT: Record<string, string> = {
  adhesive: 'Tile adhesive spread with a notched trowel',
  area: 'Tape measures and folding rulers',
  concrete: 'Workers placing rebar for a concrete pour',
  drywall: 'Drywall panels on wooden studs',
  flooring: 'Laminate floor planks',
  gravel: 'Close-up of gravel',
  insulation: 'Insulation boards between wooden studs',
  masonry: 'Red brick wall',
  mulch: 'Close-up of wood chip mulch',
  paint: 'Paint roller on a wall',
  screed: 'Smooth screed floor with a straightedge',
  tile: 'Patterned floor tiles in sunlight',
  wallpaper: 'Patterned wallpaper with a curled corner',
};

@Component({
  selector: 'app-material-art',
  standalone: true,
  template: `<img [alt]="alt()" width="900" height="600" decoding="async" [attr.loading]="eager() ? 'eager' : 'lazy'" [attr.fetchpriority]="eager() ? null : 'low'" [attr.sizes]="sizes()" [attr.srcset]="srcset()" [src]="src()" />`,
  styles: `
    :host {
      display: block;
      overflow: hidden;
      background: var(--surface-soft);
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    :host-context(.calculator-card:hover) img {
      transform: scale(1.06);
    }
  `,
})
export class MaterialArtComponent {
  readonly kind = input.required<string>();
  readonly eager = input(false);
  readonly sizes = input('(max-width: 640px) 92vw, 380px');
  protected readonly alt = computed(() => ALT[this.kind()] ?? '');
  protected readonly src = computed(() => `images/${this.kind()}.webp`);
  protected readonly srcset = computed(() => `images/${this.kind()}-480.webp 480w, images/${this.kind()}.webp 900w`);
}
