import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { OrganizerDashboard } from './organizer-dashboard';
import { API_BASE_URL } from '../../../../core/api-config';

describe('OrganizerDashboard', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerDashboard],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create and compute totals from loaded events', () => {
    const fixture = TestBed.createComponent(OrganizerDashboard);
    fixture.detectChanges();

    httpMock.expectOne(`${API_BASE_URL}/organizer/events`).flush([
      { eventId: 1, name: 'A', datetimeUtc: '2027-01-01T00:00:00Z', venueName: 'V', status: 'normal', listingCount: 1, ticketsSold: 5, ticketsRemaining: 10, revenue: 100, imageUrl: null },
      { eventId: 2, name: 'B', datetimeUtc: '2027-01-01T00:00:00Z', venueName: 'V', status: 'normal', listingCount: 1, ticketsSold: 3, ticketsRemaining: 10, revenue: 50, imageUrl: null },
    ]);
    httpMock.expectOne((r) => r.url === `${API_BASE_URL}/organizer/sales-trend`).flush([]);

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.loading()).toBe(false);
    expect(fixture.componentInstance.totalRevenue()).toBe(150);
    expect(fixture.componentInstance.totalSold()).toBe(8);
  });

  it('filters the events table by name/venue search and status, without changing the totals', () => {
    const fixture = TestBed.createComponent(OrganizerDashboard);
    fixture.detectChanges();

    httpMock.expectOne(`${API_BASE_URL}/organizer/events`).flush([
      { eventId: 1, name: 'Jazz Night', datetimeUtc: '2027-01-01T00:00:00Z', venueName: 'Blue Room', status: 'normal', listingCount: 1, ticketsSold: 5, ticketsRemaining: 10, revenue: 100, imageUrl: null },
      { eventId: 2, name: 'Rock Show', datetimeUtc: '2027-01-01T00:00:00Z', venueName: 'Arena', status: 'cancelled', listingCount: 1, ticketsSold: 3, ticketsRemaining: 10, revenue: 50, imageUrl: null },
    ]);
    httpMock.expectOne((r) => r.url === `${API_BASE_URL}/organizer/sales-trend`).flush([]);

    const cmp = fixture.componentInstance;
    expect(cmp.filteredEvents().length).toBe(2);

    cmp.search.set('jazz');
    expect(cmp.filteredEvents().map((e) => e.eventId)).toEqual([1]);

    cmp.search.set('');
    cmp.statusFilter.set('cancelled');
    expect(cmp.filteredEvents().map((e) => e.eventId)).toEqual([2]);

    // Totals are computed from the full event list, independent of the table filter.
    expect(cmp.totalRevenue()).toBe(150);
  });
});
