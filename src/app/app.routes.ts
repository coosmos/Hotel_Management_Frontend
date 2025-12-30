import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AuthPage } from './pages/auth/auth-page/auth-page';

export const routes: Routes = [
  {path: '', component: Home},
  {path: 'auth', component: AuthPage}
];
