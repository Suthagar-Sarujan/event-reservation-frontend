import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';
import { FraudOverview } from '../models/models';

@Injectable({ providedIn: 'root' })
export class FraudService {
  constructor(private http: HttpClient) {}

  adminOverview(): Observable<FraudOverview> {
    return this.http.get<FraudOverview>(`${API_BASE_URL}/admin/fraud-overview`);
  }

  organizerOverview(): Observable<FraudOverview> {
    return this.http.get<FraudOverview>(`${API_BASE_URL}/organizer/fraud-overview`);
  }
}
