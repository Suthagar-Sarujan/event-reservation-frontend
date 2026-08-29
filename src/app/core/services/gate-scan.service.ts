import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';
import { Gate, GateScanRequest, GateScanResult } from '../models/models';

// Gate-User-facing runtime endpoints - the mobile scanning flow.
@Injectable({ providedIn: 'root' })
export class GateScanService {
  constructor(private http: HttpClient) {}

  myGates(): Observable<Gate[]> {
    return this.http.get<Gate[]>(`${API_BASE_URL}/gate/my-gates`);
  }

  scan(request: GateScanRequest): Observable<GateScanResult> {
    return this.http.post<GateScanResult>(`${API_BASE_URL}/gate/scan`, request);
  }
}
