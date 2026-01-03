import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { AuthPage } from './pages/auth/auth-page/auth-page';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', component: AuthPage },
  {
    path: 'admin/dashboard',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./pages/admin/admin-dashboard/admin-dashboard')// lazy loaded so admin stuff is not shipped to guest
        .then(m => m.AdminDashboard)
  },
  {
    path: 'manager/dashboard',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['MANAGER'] },
    loadComponent: () =>
      import('./pages/manager/manager-dashboard/manager-dashboard')
        .then(m => m.ManagerDashboard)
  },
  {
    path: 'receptionist/dashboard',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['RECEPTIONIST'] },
    loadComponent: () =>
      import('./pages/receptionist/receptionist-dashboard/receptionist-dashboard')
        .then(m => m.ReceptionistDashboard)
  },
  {
    path: 'guest/dashboard',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['GUEST'] },
    loadComponent: () =>
      import('./pages/guest/guest-dashboard/guest-dashboard')
        .then(m => m.GuestDashboard)
  },
  {
    path: 'search-results',
    loadComponent: () =>
      import('./pages/guest/search-results/search-results')
        .then(m => m.SearchResultsComponent)
  },
  {
    path: 'hotel-details/:hotelId',
    loadComponent: () =>
      import('./pages/guest/hotel-details/hotel-details')
        .then(m => m.HotelDetails)
  },
  {
    path: 'booking-confirm',
    loadComponent: () =>
      import('./pages/guest/booking-confirm/booking-confirm')
        .then(m => m.BookingConfirm)
  }

];
