import { Routes } from '@angular/router';
import { FiltrosComponent } from './components/filtros/filtros'; // Verifica la ruta

export const routes: Routes = [
  { path: '', component: FiltrosComponent }, // Esto hace que sea la página principal
  { path: 'filtros', component: FiltrosComponent }
];