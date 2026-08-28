import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { OrganizerEventManage } from './organizer-event-manage';
import { API_BASE_URL } from '../../../../core/api-config';

describe('OrganizerEventManage', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerEventManage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '900000001' }) } } },
      ],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create and load the event and its bookings on init', () => {
    const fixture = TestBed.createComponent(OrganizerEventManage);
    fixture.detectChanges();

    httpMock.expectOne(`${API_BASE_URL}/organizer/events/900000001`).flush({
      eventId: 900000001,
      name: 'Downtown Jazz Night',
      taxonomyName: 'jazz',
      taxonomySubName: 'jazz',
      datetimeUtc: '2027-09-20T20:30:00Z',
      status: 'normal',
      venueName: 'The Blue Room',
      performers: [],
      listings: [],
      ticketsSold: 2,
      revenue: 60,
      imageUrl: null,
    });
    httpMock.expectOne(`${API_BASE_URL}/organizer/events/900000001/bookings`).flush([]);

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.loading()).toBe(false);
    expect(fixture.componentInstance.editName).toBe('Downtown Jazz Night');
  });
});
