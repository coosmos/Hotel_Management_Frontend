import { CanActivateFn } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return false;
  }
  const user = JSON.parse(userStr);
  const allowedRoles = (route.data?.['roles'] as string[]) || [];
  return allowedRoles.includes(user.role);
};
