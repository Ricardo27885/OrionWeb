import { Routes } from '@angular/router';
import SingInComponent from './auth/feature/sing-in/sing-in.component';
import { NoAuthGuard } from './core/noAuth.guard';
import { AuthGuard } from './core/auth.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'api/signIn',
    pathMatch: 'full'  // Importante para que la ruta vacía redireccione
  },
  {
    canActivate: [NoAuthGuard],
    path: 'api/signIn',
    component: SingInComponent
  },
  {
    canActivate: [AuthGuard],
    path: 'api/main',
    loadChildren: () => import('./dashboard/feature/main.routes') 
  }
    
];
