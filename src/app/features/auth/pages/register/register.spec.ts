import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Register } from './register';
import { API_BASE_URL } from '../../../../core/api-config';

describe('Register', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    const fixture = TestBed.createComponent(Register);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show a "conflict" error on a 409 response', () => {
    const fixture = TestBed.createComponent(Register);
    const component = fixture.componentInstance;
    component.fullName = 'Jane Doe';
    component.email = 'taken@example.com';
    component.password = 'TestPass123!';
    component.submit();

    httpMock.expectOne(`${API_BASE_URL}/auth/register`).flush(
      { message: 'An account with this email already exists.' },
      { status: 409, statusText: 'Conflict' },
    );

    expect(component.loading()).toBe(false);
    expect(component.error()).toBe('An account with this email already exists.');
  });
});
