import { Routes } from '@angular/router';
import { FiltrosComponent } from './components/filtros/filtros';
import { AdminSqlComponent } from './components/admin-sql/admin-sql';

export const routes: Routes = [
    { path: 'admin-sql', component: AdminSqlComponent }, // Ponla de primera
    { path: 'filtros', component: FiltrosComponent },
    { path: '', component: FiltrosComponent },
    { path: '**', redirectTo: '' }
];