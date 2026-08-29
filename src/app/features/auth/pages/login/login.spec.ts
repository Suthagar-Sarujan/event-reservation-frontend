import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Login } from './login';
import { API_BASE_URL } from '../../../../core/api-config';

describe('Login', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    const fixture = TestBed.createComponent(Login);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show an "invalid credentials" error on a 401 response', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;
    component.email = 'test@example.com';
    component.password = 'wrong';
    component.submit();

    httpMock.expectOne(`${API_BASE_URL}/auth/login`).flush({ message: 'Invalid email or password.' }, { status: 401, statusText: 'Unauthorized' });

    expect(component.loading()).toBe(false);
    expect(component.error()).toBe('Invalid email or password.');
  });

  it('should redirect a GateUser straight to /gate instead of /dashboard', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.email = 'gate.staff@example.com';
    component.password = 'correct-password';
    component.submit();

    httpMock.expectOne(`${API_BASE_URL}/auth/login`).flush({
      token: 'tok',
      userId: 42,
      fullName: 'Gate Staff',
      email: 'gate.staff@example.com',
      role: 'GateUser',
      theme: 'light',
      hasPreferences: true,
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/gate']);
  });
});
