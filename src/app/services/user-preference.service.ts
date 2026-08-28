import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';
import { UpdateUserPreferencesRequest, UserPreferences } from '../models/models';

export const EVENT_TYPE_OPTIONS = ['Music Concerts', 'Sports', 'Comedy', 'Theatre', 'Cultural Events', 'Festivals', 'Other'];

export const MUSIC_GENRE_OPTIONS = ['Rock', 'Pop', 'Hip-Hop', 'EDM', 'Classical', 'Jazz', 'R&B', 'Sinhala', 'Tamil', 'Other'];

export const ATMOSPHERE_OPTIONS = ['Large concerts', 'Small/independent concerts', 'Outdoor festivals', 'Indoor concerts'];

export const ATTENDANCE_FREQUENCY_OPTIONS = ['Frequently', 'Occasionally', 'Rarely'];

@Injectable({ providedIn: 'root' })
export class UserPreferenceService {
  constructor(private http: HttpClient) {}

  get(): Observable<UserPreferences> {
    return this.http.get<UserPreferences>(`${API_BASE_URL}/user-preferences`);
  }

  update(request: UpdateUserPreferencesRequest): Observable<UserPreferences> {
    return this.http.put<UserPreferences>(`${API_BASE_URL}/user-preferences`, request);
  }
}
