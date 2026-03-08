import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore }     from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';

import { environment } from '../enviroments/enviroment';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),

    // ── Firebase ──────────────────────────────────────────────
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ]
};
