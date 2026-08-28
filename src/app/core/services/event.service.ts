import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';
import { EventDetail, EventFilters, EventListResponse, RecommendedEvent } from '../models/models';

export interface EventQuery {
  search?: string;
  type?: string;
  taxonomySubName?: string;
  page?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(private http: HttpClient) {}

  list(query: EventQuery): Observable<EventListResponse> {
    let params = new HttpParams();
    if (query.search) params = params.set('search', query.search);
    if (query.type) params = params.set('type', query.type);
    if (query.taxonomySubName) params = params.set('taxonomySubName', query.taxonomySubName);
    params = params.set('page', query.page ?? 1).set('pageSize', query.pageSize ?? 12);
    return this.http.get<EventListResponse>(`${API_BASE_URL}/events`, { params });
  }

  filters(): Observable<EventFilters> {
    return this.http.get<EventFilters>(`${API_BASE_URL}/events/filters`);
  }

  get(eventId: number): Observable<EventDetail> {
    return this.http.get<EventDetail>(`${API_BASE_URL}/events/${eventId}`);
  }

  similar(eventId: number, topN = 6): Observable<RecommendedEvent[]> {
    return this.http.get<RecommendedEvent[]>(`${API_BASE_URL}/events/${eventId}/similar`, {
      params: { topN },
    });
  }
}
