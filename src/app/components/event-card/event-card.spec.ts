import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EventCard } from './event-card';
import { EventSummary } from '../../models/models';

const mockEvent: EventSummary = {
  eventId: 123,
  name: 'Chicago Cubs at Boston Red Sox',
  type: 'mlb',
  taxonomyName: 'sports',
  taxonomySubName: 'baseball',
  datetimeUtc: '2027-09-26T23:15:00Z',
  venueName: 'Fenway Park',
  venueCity: 'Boston',
  venueState: 'MA',
  minPrice: 31.97,
  ticketsRemaining: 1924,
  performers: ['Chicago Cubs', 'Boston Red Sox'],
  imageUrl: null,
};

describe('EventCard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCard],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(EventCard);
    fixture.componentRef.setInput('event', mockEvent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the event name and venue', () => {
    const fixture = TestBed.createComponent(EventCard);
    fixture.componentRef.setInput('event', mockEvent);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Chicago Cubs at Boston Red Sox');
    expect(text).toContain('Fenway Park');
  });

  it('should have no photo yet on the first render when imageUrl is null', () => {
    const fixture = TestBed.createComponent(EventCard);
    fixture.componentRef.setInput('event', mockEvent);
    fixture.detectChanges();
    expect(fixture.componentInstance.photoImageUrl()).toBeNull();
  });

  it('should use an explicit imageUrl immediately without waiting on a preload', () => {
    const fixture = TestBed.createComponent(EventCard);
    fixture.componentRef.setInput('event', { ...mockEvent, imageUrl: 'https://example.com/photo.jpg' });
    fixture.detectChanges();
    expect(fixture.componentInstance.photoImageUrl()).toBe('https://example.com/photo.jpg');
  });
});
