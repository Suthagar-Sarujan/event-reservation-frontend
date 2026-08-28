import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const organizerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isOrganizer()) {
    return true;
  }
  router.navigate(auth.isLoggedIn() ? ['/'] : ['/login']);
  return false;
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAdmin()) {
    return true;
  }
  router.navigate(auth.isLoggedIn() ? ['/'] : ['/login']);
  return false;
};

// Dashboard/My Bookings are the customer's own panel - Organizer and Admin have
// their own dedicated sidebar panels instead, so they're redirected there rather
// than shown a customer view that doesn't apply to them.
export const customerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
  if (auth.isOrganizer()) {
    router.navigate(['/organizer']);
    return false;
  }
  if (auth.isAdmin()) {
    router.navigate(['/admin']);
    return false;
  }
  return true;
};
