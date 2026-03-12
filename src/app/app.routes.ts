import { Routes } from '@angular/router';
import { FiltrosComponent } from './components/filtros/filtros';
import { AdminSqlComponent } from './components/admin-sql/admin-sql';
import { MantenimientoProgramadoComponent } from './components/mantenimiento-programado/mantenimiento-programado';

export const routes: Routes = [
    { path: 'admin-sql', component: AdminSqlComponent }, // Ponla de primera
    { path: 'mantenimiento', component: MantenimientoProgramadoComponent },
    { path: 'filtros', component: FiltrosComponent },
    { path: '', component: FiltrosComponent },
    { path: '**', redirectTo: '' }
];