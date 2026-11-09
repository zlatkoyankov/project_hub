import { ActivatedRouteSnapshot, ResolveFn, Route, Routes, UrlSegment } from '@angular/router';
import { CALCULATORS } from './data/calculators';
import { GUIDES } from './data/guides';

const calculatorForRoute = (route: ActivatedRouteSnapshot) =>
  CALCULATORS.find((calculator) => calculator.slug === route.paramMap.get('slug'));

const calculatorDescriptionResolver: ResolveFn<string> = (route) =>
  calculatorForRoute(route)?.description ?? 'Practical construction and home improvement calculator.';

const guideForRoute = (route: ActivatedRouteSnapshot) =>
  GUIDES.find((guide) => guide.slug === route.paramMap.get('slug'));

const guideDescriptionResolver: ResolveFn<string> = (route) =>
  guideForRoute(route)?.description ?? 'Practical material estimating guides from BuildCalc.';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home').then((module) => module.HomePage),
    title: 'Free Construction & Home Improvement Calculators | BuildCalc',
    data: { description: 'Estimate materials for home improvement, renovation, and landscaping projects with free, practical BuildCalc calculators.' },
  },
  {
    path: 'all-calculators',
    loadComponent: () => import('./pages/directory').then((module) => module.DirectoryPage),
    title: 'All Construction Material Calculators | BuildCalc',
    data: { description: 'Browse free gravel, paint, tile, concrete, square footage, and mulch calculators for your next project.' },
  },
  {
    // Chrome-free copy of a calculator for other sites to show in an iframe.
    path: 'embed/:slug',
    canMatch: [(_route: Route, segments: UrlSegment[]) => segments[0]?.path === 'embed' && CALCULATORS.some((calculator) => calculator.slug === segments[1]?.path)],
    loadComponent: () => import('./pages/calculator').then((module) => module.CalculatorPage),
    title: (route) => `${calculatorForRoute(route)?.title ?? 'Calculator'} | BuildCalc`,
    data: { embed: true, noindex: true },
    resolve: { description: calculatorDescriptionResolver },
  },
  {
    path: ':slug',
    canMatch: [(_route: Route, segments: UrlSegment[]) => CALCULATORS.some((calculator) => calculator.slug === segments[0]?.path)],
    loadComponent: () => import('./pages/calculator').then((module) => module.CalculatorPage),
    title: (route) => `${calculatorForRoute(route)?.seoTitle ?? 'Calculator'} | BuildCalc`,
    resolve: { description: calculatorDescriptionResolver },
  },
  {
    path: 'guides',
    loadComponent: () => import('./pages/content').then((module) => module.ContentPage),
    title: 'Material Guides: How Much to Buy | BuildCalc',
    data: {
      contentKey: 'guides',
      description: 'Practical material guides for estimating gravel, paint, tile, concrete, mulch and area, understanding coverage, and planning your project.',
    },
  },
  {
    path: 'guides/:slug',
    canMatch: [(_route: Route, segments: UrlSegment[]) => GUIDES.some((guide) => guide.slug === segments[1]?.path)],
    loadComponent: () => import('./pages/content').then((module) => module.ContentPage),
    title: (route) => `${guideForRoute(route)?.title ?? 'Guide not found'} | BuildCalc`,
    resolve: { description: guideDescriptionResolver },
  },
  ...[
    { path: 'about', key: 'about', title: 'About BuildCalc: Where the Numbers Come From', description: 'Learn about BuildCalc’s browser-based planning tools and transparent material estimate assumptions.' },
  ].map((page) => ({
    path: page.path,
    loadComponent: () => import('./pages/content').then((module) => module.ContentPage),
    title: page.title,
    data: { contentKey: page.key, description: page.description },
  })),
  {
    path: '**',
    loadComponent: () => import('./pages/not-found').then((module) => module.NotFoundPage),
    title: 'Page not found | BuildCalc',
    data: { description: 'The page you requested could not be found.', noindex: true },
  },
];
