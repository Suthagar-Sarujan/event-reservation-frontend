import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';
import {
  CreateEventRequest,
  CreateListingRequest,
  OrganizerBooking,
  OrganizerEventDetail,
  OrganizerEventSummary,
  TrendPoint,
  VenueOption,
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class OrganizerService {
  constructor(private http: HttpClient) {}

  venues(): Observable<VenueOption[]> {
    return this.http.get<VenueOption[]>(`${API_BASE_URL}/organizer/venues`);
  }

  myEvents(): Observable<OrganizerEventSummary[]> {
    return this.http.get<OrganizerEventSummary[]>(`${API_BASE_URL}/organizer/events`);
  }

  getEvent(eventId: number): Observable<OrganizerEventDetail> {
    return this.http.get<OrganizerEventDetail>(`${API_BASE_URL}/organizer/events/${eventId}`);
  }

  createEvent(request: CreateEventRequest): Observable<OrganizerEventDetail> {
    return this.http.post<OrganizerEventDetail>(`${API_BASE_URL}/organizer/events`, request);
  }

  updateEvent(eventId: number, name: string, datetimeUtc: string, status: string, imageUrl?: string): Observable<void> {
    return this.http.put<void>(`${API_BASE_URL}/organizer/events/${eventId}`, { name, datetimeUtc, status, imageUrl });
  }

  addListing(eventId: number, request: CreateListingRequest): Observable<OrganizerEventDetail> {
    return this.http.post<OrganizerEventDetail>(`${API_BASE_URL}/organizer/events/${eventId}/listings`, request);
  }

  updateListing(listingId: string, quantity: number, unitPrice: number): Observable<void> {
    return this.http.put<void>(`${API_BASE_URL}/organizer/listings/${listingId}`, { quantity, unitPrice });
  }

  eventBookings(eventId: number): Observable<OrganizerBooking[]> {
    return this.http.get<OrganizerBooking[]>(`${API_BASE_URL}/organizer/events/${eventId}/bookings`);
  }

  resendBookingEmail(bookingId: number): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/organizer/bookings/${bookingId}/resend-email`, {});
  }

  salesTrend(days = 30): Observable<TrendPoint[]> {
    const params = new HttpParams().set('days', days);
    return this.http.get<TrendPoint[]>(`${API_BASE_URL}/organizer/sales-trend`, { params });
  }
}
