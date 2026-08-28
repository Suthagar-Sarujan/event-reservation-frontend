import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { UserMenu } from './user-menu';
import { AuthResponse } from '../../models/models';

function seedAuth(role: string): void {
  const auth: AuthResponse = {
    token: 'test-token',
    userId: 1,
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    role,
    theme: 'light',
  };
  localStorage.setItem('event_reservation_auth', JSON.stringify(auth));
}

describe('UserMenu', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [UserMenu],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(UserMenu);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should build initials from the current user\'s full name', () => {
    seedAuth('Customer');
    const fixture = TestBed.createComponent(UserMenu);
    expect(fixture.componentInstance.initials()).toBe('JD');
  });

  it('should include Dashboard and My Bookings for a customer, not Organizer/Admin panels', () => {
    seedAuth('Customer');
    const fixture = TestBed.createComponent(UserMenu);
    const labels = fixture.componentInstance.items().map((i) => i.label);
    expect(labels).toContain('Dashboard');
    expect(labels).toContain('My Bookings');
    expect(labels).not.toContain('Organizer Panel');
    expect(labels).not.toContain('Admin Panel');
    expect(labels).toContain('Log out');
  });

  it('should show the Admin Panel link and hide Dashboard/My Bookings for an admin', () => {
    seedAuth('Admin');
    const fixture = TestBed.createComponent(UserMenu);
    const labels = fixture.componentInstance.items().map((i) => i.label);
    expect(labels).toContain('Admin Panel');
    expect(labels).not.toContain('Dashboard');
    expect(labels).not.toContain('My Bookings');
  });
});
