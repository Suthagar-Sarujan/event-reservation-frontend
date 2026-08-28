import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Dashboard } from './dashboard';
import { API_BASE_URL } from '../../../../core/api-config';

describe('Dashboard', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create and load bookings and recommendations on init', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();

    httpMock.expectOne(`${API_BASE_URL}/bookings/me`).flush([]);
    httpMock.expectOne((r) => r.url === `${API_BASE_URL}/recommendations/for-you`).flush([]);

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.loadingBookings()).toBe(false);
    expect(fixture.componentInstance.loadingRecommended()).toBe(false);
  });

  it('computes total spent from confirmed bookings only', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();

    httpMock.expectOne(`${API_BASE_URL}/bookings/me`).flush([
      { bookingId: 1, bookingReference: 'BKG-1', eventId: 1, eventName: 'A', eventDatetimeUtc: '2099-01-01T00:00:00Z', status: 'Confirmed', totalAmount: 50, createdAt: '2026-01-01T00:00:00Z', items: [] },
      { bookingId: 2, bookingReference: 'BKG-2', eventId: 2, eventName: 'B', eventDatetimeUtc: '2099-01-01T00:00:00Z', status: 'Cancelled', totalAmount: 999, createdAt: '2026-01-01T00:00:00Z', items: [] },
    ]);
    httpMock.expectOne((r) => r.url === `${API_BASE_URL}/recommendations/for-you`).flush([]);

    expect(fixture.componentInstance.totalSpent()).toBe(50);
  });
});
