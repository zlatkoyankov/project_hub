import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-material-art',
  standalone: true,
  template: `<img alt="" width="900" height="600" decoding="async" [attr.loading]="eager() ? 'eager' : 'lazy'" [attr.fetchpriority]="eager() ? null : 'low'" [attr.sizes]="sizes()" [attr.srcset]="srcset()" [src]="src()" />`,
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
  protected readonly src = computed(() => `images/${this.kind()}.webp`);
  protected readonly srcset = computed(() => `images/${this.kind()}-480.webp 480w, images/${this.kind()}.webp 900w`);
}
