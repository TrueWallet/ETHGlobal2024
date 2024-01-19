import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { userProvider } from "./core/providers";
import { twInitProvider } from "./core/providers/tw-init-provider";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    userProvider,
    twInitProvider,
  ]
};
