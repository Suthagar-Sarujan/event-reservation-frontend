import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';
import { DemandModelInfo, DemandPrediction } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DemandService {
  constructor(private http: HttpClient) {}

  myPredictions(): Observable<DemandPrediction[]> {
    return this.http.get<DemandPrediction[]>(`${API_BASE_URL}/organizer/demand-predictions`);
  }

  modelInfo(): Observable<DemandModelInfo> {
    return this.http.get<DemandModelInfo>(`${API_BASE_URL}/organizer/demand-predictions/model-info`);
  }

  retrain(): Observable<DemandModelInfo> {
    return this.http.post<DemandModelInfo>(`${API_BASE_URL}/organizer/demand-predictions/retrain`, {});
  }
}
