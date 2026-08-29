import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

// A 401 on an authenticated request means the stored token expired or was
// invalidated server-side - the UI otherwise has no way to notice this (auth
// state is just "is there a token in storage") and would keep showing the
// user as logged in while every action silently failed. Login/register calls
// are excluded since a 401 there just means wrong credentials, not session
// expiry, and must surface its own message instead of bouncing the user.
export const sessionExpiryInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: unknown) => {
      const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/register');
      if (err instanceof HttpErrorResponse && err.status === 401 && auth.isLoggedIn() && !isAuthEndpoint) {
        auth.logout();
        router.navigate(['/login'], { queryParams: { sessionExpired: '1' } });
      }
      return throwError(() => err);
    }),
  );
};
