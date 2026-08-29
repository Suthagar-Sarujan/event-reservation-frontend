import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';
import { AdminBooking, AdminEvent, AdminStats, AdminUser, PagedResult, TrendPoint } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  stats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${API_BASE_URL}/admin/stats`);
  }

  users(search?: string, page = 1, pageSize = 25): Observable<PagedResult<AdminUser>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (search) params = params.set('search', search);
    return this.http.get<PagedResult<AdminUser>>(`${API_BASE_URL}/admin/users`, { params });
  }

  updateUserRole(userId: number, role: string): Observable<void> {
    return this.http.patch<void>(`${API_BASE_URL}/admin/users/${userId}/role`, { role });
  }

  events(search?: string, page = 1, pageSize = 25): Observable<PagedResult<AdminEvent>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (search) params = params.set('search', search);
    return this.http.get<PagedResult<AdminEvent>>(`${API_BASE_URL}/admin/events`, { params });
  }

  cancelEvent(eventId: number): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/admin/events/${eventId}/cancel`, {});
  }

  updateEvent(eventId: number, name: string, datetimeUtc: string, status: string, imageUrl?: string): Observable<void> {
    return this.http.put<void>(`${API_BASE_URL}/admin/events/${eventId}`, { name, datetimeUtc, status, imageUrl });
  }

  bookings(search?: string, page = 1, pageSize = 25): Observable<PagedResult<AdminBooking>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (search) params = params.set('search', search);
    return this.http.get<PagedResult<AdminBooking>>(`${API_BASE_URL}/admin/bookings`, { params });
  }

  resendBookingEmail(bookingId: number): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/admin/bookings/${bookingId}/resend-email`, {});
  }

  bookingTrend(days = 30): Observable<TrendPoint[]> {
    const params = new HttpParams().set('days', days);
    return this.http.get<TrendPoint[]>(`${API_BASE_URL}/admin/stats/trend`, { params });
  }
}
