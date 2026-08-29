import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';
import { Gate, GateDetail, GateScanHistoryEntry, GateUserSummary, PagedResult } from '../models/models';

export interface ScanHistoryFilters {
  gateId?: number;
  status?: 'Success' | 'Failed';
  fromUtc?: string;
  toUtc?: string;
}

// Admin-facing gate management - mirrors AdminService's thin-wrapper style,
// one method per /api/admin/gates endpoint.
@Injectable({ providedIn: 'root' })
export class GateService {
  constructor(private http: HttpClient) {}

  gates(search?: string, status?: string, page = 1, pageSize = 25): Observable<PagedResult<Gate>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (search) params = params.set('search', search);
    if (status) params = params.set('status', status);
    return this.http.get<PagedResult<Gate>>(`${API_BASE_URL}/admin/gates`, { params });
  }

  gate(id: number): Observable<GateDetail> {
    return this.http.get<GateDetail>(`${API_BASE_URL}/admin/gates/${id}`);
  }

  createGate(name: string, description?: string): Observable<Gate> {
    return this.http.post<Gate>(`${API_BASE_URL}/admin/gates`, { name, description });
  }

  updateGate(id: number, name: string, description?: string): Observable<void> {
    return this.http.put<void>(`${API_BASE_URL}/admin/gates/${id}`, { name, description });
  }

  setGateStatus(id: number, active: boolean): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/admin/gates/${id}/${active ? 'activate' : 'deactivate'}`, {});
  }

  deleteGate(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/admin/gates/${id}`);
  }

  gateUsers(search?: string, page = 1, pageSize = 25): Observable<PagedResult<GateUserSummary>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (search) params = params.set('search', search);
    return this.http.get<PagedResult<GateUserSummary>>(`${API_BASE_URL}/admin/gates/users`, { params });
  }

  createGateUser(fullName: string, email: string, password: string, gateIds: number[]): Observable<GateUserSummary> {
    return this.http.post<GateUserSummary>(`${API_BASE_URL}/admin/gates/users`, { fullName, email, password, gateIds });
  }

  assignGateUser(gateId: number, userId: number): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/admin/gates/${gateId}/users`, { userId });
  }

  removeGateUser(gateId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/admin/gates/${gateId}/users/${userId}`);
  }

  scanHistory(filters: ScanHistoryFilters, page = 1, pageSize = 25): Observable<PagedResult<GateScanHistoryEntry>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (filters.gateId) params = params.set('gateId', filters.gateId);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.fromUtc) params = params.set('fromUtc', filters.fromUtc);
    if (filters.toUtc) params = params.set('toUtc', filters.toUtc);
    return this.http.get<PagedResult<GateScanHistoryEntry>>(`${API_BASE_URL}/admin/gates/scan-history`, { params });
  }
}
