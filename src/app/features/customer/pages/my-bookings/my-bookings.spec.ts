import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MyBookings } from './my-bookings';
import { API_BASE_URL } from '../../../../core/api-config';

describe('MyBookings', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyBookings],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create and load bookings on init', () => {
    const fixture = TestBed.createComponent(MyBookings);
    fixture.detectChanges();

    httpMock.expectOne(`${API_BASE_URL}/bookings/me`).flush([]);

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('filters bookings by event/reference search and by status', () => {
    const fixture = TestBed.createComponent(MyBookings);
    fixture.detectChanges();

    httpMock.expectOne(`${API_BASE_URL}/bookings/me`).flush([
      { bookingId: 1, bookingReference: 'BKG-AAA', eventId: 1, eventName: 'Jazz Night', eventDatetimeUtc: '2099-01-01T00:00:00Z', status: 'Confirmed', totalAmount: 50, createdAt: '2026-01-01T00:00:00Z', items: [] },
      { bookingId: 2, bookingReference: 'BKG-BBB', eventId: 2, eventName: 'Rock Show', eventDatetimeUtc: '2099-01-01T00:00:00Z', status: 'Cancelled', totalAmount: 30, createdAt: '2026-01-01T00:00:00Z', items: [] },
    ]);

    const cmp = fixture.componentInstance;
    expect(cmp.filteredBookings().length).toBe(2);

    cmp.search.set('jazz');
    expect(cmp.filteredBookings().map((b) => b.bookingId)).toEqual([1]);

    cmp.search.set('');
    cmp.statusFilter.set('Cancelled');
    expect(cmp.filteredBookings().map((b) => b.bookingId)).toEqual([2]);
  });
});
