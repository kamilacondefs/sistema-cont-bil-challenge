import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LancamentoFormComponent } from './features/lancamento-form/lancamento-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'lancamento/novo', component: LancamentoFormComponent },
  { path: 'lancamento/editar/:id', component: LancamentoFormComponent }
];
