import { RenderMode, ServerRoute } from '@angular/ssr';
import { CALCULATORS } from './data/calculators';
import { GUIDES } from './data/guides';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'all-calculators', renderMode: RenderMode.Prerender },
  {
    path: ':slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return CALCULATORS.map(({ slug }) => ({ slug }));
    },
  },
  { path: 'guides', renderMode: RenderMode.Prerender },
  {
    path: 'guides/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return GUIDES.map(({ slug }) => ({ slug }));
    },
  },
  ...['about'].map((path): ServerRoute => ({
    path,
    renderMode: RenderMode.Prerender,
  })),
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
