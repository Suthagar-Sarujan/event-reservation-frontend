import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AdminEvents } from './admin-events';
import { API_BASE_URL } from '../../../../core/api-config';

describe('AdminEvents', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEvents],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  function flushEvents(fixture: ReturnType<typeof TestBed.createComponent<AdminEvents>>) {
    httpMock.expectOne((r) => r.url === `${API_BASE_URL}/admin/events`).flush({
      total: 2,
      page: 1,
      pageSize: 50,
      items: [
        { eventId: 1, name: 'Jazz Night', datetimeUtc: '2027-01-01T00:00:00Z', venueName: 'Blue Room', status: 'normal', source: 'organizer', creatorEmail: 'a@b.com', ticketsSold: 5, revenue: 100, imageUrl: null },
        { eventId: 2, name: 'Rock Show', datetimeUtc: '2027-01-01T00:00:00Z', venueName: 'Arena', status: 'cancelled', source: 'seatgeek', creatorEmail: null, ticketsSold: 3, revenue: 50, imageUrl: null },
      ],
    });
    fixture.detectChanges();
  }

  it('should create and load events on init', () => {
    const fixture = TestBed.createComponent(AdminEvents);
    fixture.detectChanges();
    flushEvents(fixture);

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.events().length).toBe(2);
  });

  it('filters the table by venue text, source, and status independently of the server-side name search', () => {
    const fixture = TestBed.createComponent(AdminEvents);
    fixture.detectChanges();
    flushEvents(fixture);

    const cmp = fixture.componentInstance;
    expect(cmp.filteredEvents().length).toBe(2);

    cmp.venueFilter.set('arena');
    expect(cmp.filteredEvents().map((e) => e.eventId)).toEqual([2]);

    cmp.venueFilter.set('');
    cmp.sourceFilter.set('organizer');
    expect(cmp.filteredEvents().map((e) => e.eventId)).toEqual([1]);

    cmp.sourceFilter.set('');
    cmp.statusFilter.set('cancelled');
    expect(cmp.filteredEvents().map((e) => e.eventId)).toEqual([2]);
  });
});
