import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { UserConfigService } from './services/user-config.service';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes,withComponentInputBinding()), provideClientHydration(withEventReplay()),provideHttpClient(withFetch()),
     provideAppInitializer(() => {
        const userConfigService = inject(UserConfigService);
        return userConfigService.loadConfigFromStorage(); 
    }),
  ]
};
