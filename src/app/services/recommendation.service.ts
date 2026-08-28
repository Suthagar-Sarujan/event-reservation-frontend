import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';
import { RecommendedEvent } from '../models/models';

@Injectable({ providedIn: 'root' })
export class RecommendationService {
  constructor(private http: HttpClient) {}

  forYou(topN = 8): Observable<RecommendedEvent[]> {
    return this.http.get<RecommendedEvent[]>(`${API_BASE_URL}/recommendations/for-you`, {
      params: { topN },
    });
  }

  popular(topN = 8): Observable<RecommendedEvent[]> {
    return this.http.get<RecommendedEvent[]>(`${API_BASE_URL}/recommendations/popular`, {
      params: { topN },
    });
  }
}
