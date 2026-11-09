import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, UrlSerializer, withInMemoryScrolling } from '@angular/router';
import { TrailingSlashUrlSerializer } from './core/trailing-slash-url-serializer';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })),
    provideClientHydration(),
    // Links end with a slash, like the canonical and sitemap URLs, so the server does not have to redirect them.
    { provide: UrlSerializer, useClass: TrailingSlashUrlSerializer },
  ]
};
