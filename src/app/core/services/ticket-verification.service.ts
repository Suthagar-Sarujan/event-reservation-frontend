import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';
import { VerifyTicketResult } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TicketVerificationService {
  constructor(private http: HttpClient) {}

  verify(code: string): Observable<VerifyTicketResult> {
    return this.http.post<VerifyTicketResult>(`${API_BASE_URL}/ticket-verification`, { code });
  }
}
