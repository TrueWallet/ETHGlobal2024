import { Routes } from '@angular/router';

export const routes: Routes = [{
  path: '',
  loadChildren: () => import('./feature/dashboard/dashboard.module').then(m => m.DashboardModule),
}, {
  path: 'settings',
  loadChildren: () => import('./feature/settings/settings.module').then(m => m.SettingsModule),
}];
