import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';
import { Booking, Ticket } from '../models/models';

@Injectable({ providedIn: 'root' })
export class BookingService {
  constructor(private http: HttpClient) {}

  myBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${API_BASE_URL}/bookings/me`);
  }

  book(listingId: string, quantity: number): Observable<Booking> {
    return this.http.post<Booking>(`${API_BASE_URL}/bookings`, { listingId, quantity });
  }

  getTicket(bookingId: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${API_BASE_URL}/bookings/${bookingId}/ticket`);
  }

  cancel(bookingId: number): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {});
  }
}
