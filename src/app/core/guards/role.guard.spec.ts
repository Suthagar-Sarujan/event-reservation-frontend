import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { gateUserGuard, customerGuard } from './role.guard';
import { AuthResponse } from '../models/models';

function seedAuth(role: string): void {
  const auth: AuthResponse = {
    token: 'test-token',
    userId: 1,
    fullName: 'Test User',
    email: 'test@example.com',
    role,
    theme: 'light',
    hasPreferences: true,
  };
  localStorage.setItem('event_reservation_auth', JSON.stringify(auth));
}

describe('gateUserGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('allows a GateUser through', () => {
    seedAuth('GateUser');
    const result = TestBed.runInInjectionContext(() => gateUserGuard({} as never, {} as never));
    expect(result).toBe(true);
  });

  it('redirects a logged-in non-GateUser to the home page', () => {
    seedAuth('Customer');
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    const result = TestBed.runInInjectionContext(() => gateUserGuard({} as never, {} as never));
    expect(result).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('redirects an anonymous visitor to /login', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    const result = TestBed.runInInjectionContext(() => gateUserGuard({} as never, {} as never));
    expect(result).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});

describe('customerGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('redirects a GateUser to /gate instead of showing the customer dashboard', () => {
    seedAuth('GateUser');
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    const result = TestBed.runInInjectionContext(() => customerGuard({} as never, {} as never));
    expect(result).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/gate']);
  });

  it('allows a plain customer through', () => {
    seedAuth('Customer');
    const result = TestBed.runInInjectionContext(() => customerGuard({} as never, {} as never));
    expect(result).toBe(true);
  });
});
