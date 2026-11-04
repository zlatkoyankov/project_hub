import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SeoService } from './core/seo.service';
import { UnitPreferenceService } from './core/unit-preference.service';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  protected readonly units = inject(UnitPreferenceService);
  protected readonly menuOpen = signal(false);
  // Embedded calculators (/embed/<slug>/) render without the site header and footer note.
  protected readonly embed = signal(false);
  private readonly document = inject(DOCUMENT);

  constructor() {
    this.seo.updateFromRoute(this.router.routerState.snapshot.root);
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.seo.updateFromRoute(this.router.routerState.snapshot.root);
      this.embed.set(this.router.url.startsWith('/embed/'));
      this.document.documentElement.classList.toggle('is-embed', this.embed());
      this.closeMenu();
    });
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected updateUnits(event: Event): void {
    const selected = (event.target as HTMLSelectElement).value;
    this.units.setSystem(selected === 'metric' ? 'metric' : 'us');
  }
}
