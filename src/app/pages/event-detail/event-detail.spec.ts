import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EventDetailPage } from './event-detail';
import { API_BASE_URL } from '../../api-config';

describe('EventDetailPage', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [EventDetailPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '123' }) } } },
      ],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create and load the event and similar events on init', () => {
    const fixture = TestBed.createComponent(EventDetailPage);
    fixture.detectChanges();

    httpMock.expectOne(`${API_BASE_URL}/events/123`).flush({
      eventId: 123,
      name: 'Test Event',
      type: 'mlb',
      taxonomyName: 'sports',
      taxonomySubName: 'baseball',
      datetimeUtc: '2027-01-01T00:00:00Z',
      venueName: 'Test Venue',
      venueAddress: null,
      venueCity: 'Boston',
      venueState: 'MA',
      venueCountry: 'US',
      venueCapacity: null,
      performers: [],
      listings: [],
      imageUrl: null,
    });
    httpMock.expectOne((r) => r.url === `${API_BASE_URL}/events/123/similar`).flush([]);

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.loading()).toBe(false);
    expect(fixture.componentInstance.event()?.name).toBe('Test Event');
  });

  it('filters listings by section/row search text and by delivery type', () => {
    const fixture = TestBed.createComponent(EventDetailPage);
    fixture.detectChanges();

    httpMock.expectOne(`${API_BASE_URL}/events/123`).flush({
      eventId: 123,
      name: 'Test Event',
      type: 'mlb',
      taxonomyName: 'sports',
      taxonomySubName: 'baseball',
      datetimeUtc: '2027-01-01T00:00:00Z',
      venueName: 'Test Venue',
      venueAddress: null,
      venueCity: 'Boston',
      venueState: 'MA',
      venueCountry: 'US',
      venueCapacity: null,
      performers: [],
      listings: [
        { listingId: 'l1', section: '101', sectionFull: 'Section 101', rowLabel: 'A', quantityRemaining: 4, deliveryType: 'sg_app', unitPrice: 50 },
        { listingId: 'l2', section: '202', sectionFull: 'Section 202', rowLabel: 'B', quantityRemaining: 2, deliveryType: 'email', unitPrice: 30 },
      ],
      imageUrl: null,
    });
    httpMock.expectOne((r) => r.url === `${API_BASE_URL}/events/123/similar`).flush([]);
    fixture.detectChanges();

    const cmp = fixture.componentInstance;
    expect(cmp.filteredListings().length).toBe(2);
    expect(cmp.deliveryTypes()).toEqual(['email', 'sg_app']);

    cmp.listingSearch.set('202');
    expect(cmp.filteredListings().map((l) => l.listingId)).toEqual(['l2']);

    cmp.listingSearch.set('');
    cmp.deliveryFilter.set('sg_app');
    expect(cmp.filteredListings().map((l) => l.listingId)).toEqual(['l1']);
  });
});
