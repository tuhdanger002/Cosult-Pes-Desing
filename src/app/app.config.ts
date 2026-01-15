import { ApplicationConfig } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura'; // Importa el tema Aura

export const appConfig: ApplicationConfig = {
  providers: [
    // ... tus otros providers (http, router)
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.my-app-dark' // Esto activará los estilos oscuros
        }
      }
    })
  ]
};