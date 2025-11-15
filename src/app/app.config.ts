import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { httpErrorInterceptor } from '@interceptors';
import { provideIcons, provideNgIconsConfig, withExceptionLogger } from '@ng-icons/core';
import { heroArrowUturnLeft, heroMagnifyingGlass, heroPlus } from '@ng-icons/heroicons/outline';
import { Tokens } from '@styles';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
    provideNgIconsConfig(
      {
        size: '18px',
        color: Tokens.colorIconSubtle,
      },
      withExceptionLogger(),
    ),
    provideIcons({ heroMagnifyingGlass, heroPlus, heroArrowUturnLeft }),
  ],
};
