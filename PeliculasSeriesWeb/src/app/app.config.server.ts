import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering() // ESTO es lo que le da la "Plataforma" que el error dice que falta
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);