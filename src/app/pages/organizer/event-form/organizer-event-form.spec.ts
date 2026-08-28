import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { OrganizerEventForm } from './organizer-event-form';
import { API_BASE_URL } from '../../../api-config';

describe('OrganizerEventForm', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerEventForm],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create and load venues on init', () => {
    const fixture = TestBed.createComponent(OrganizerEventForm);
    fixture.detectChanges();

    httpMock.expectOne(`${API_BASE_URL}/organizer/venues`).flush([{ venueId: 1, name: 'Test Venue', addressCity: 'Boston', addressState: 'MA' }]);

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.venues().length).toBe(1);
    expect(fixture.componentInstance.selectedVenueId).toBe(1);
  });

  it('should reject submission when required fields are missing', () => {
    const fixture = TestBed.createComponent(OrganizerEventForm);
    fixture.detectChanges();
    httpMock.expectOne(`${API_BASE_URL}/organizer/venues`).flush([]);

    fixture.componentInstance.submit();

    expect(fixture.componentInstance.error()).toBe('Please fill in the event name, category and date.');
    httpMock.expectNone(`${API_BASE_URL}/organizer/events`);
  });

  it('should add and remove listing rows', () => {
    const fixture = TestBed.createComponent(OrganizerEventForm);
    fixture.detectChanges();
    httpMock.expectOne(`${API_BASE_URL}/organizer/venues`).flush([]);

    const component = fixture.componentInstance;
    expect(component.listings.length).toBe(1);
    component.addListingRow();
    expect(component.listings.length).toBe(2);
    component.removeListingRow(0);
    expect(component.listings.length).toBe(1);
  });
});
