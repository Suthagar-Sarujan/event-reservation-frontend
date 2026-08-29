import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../api-config';
import { AuthResponse } from '../models/models';

const STORAGE_KEY = 'event_reservation_auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authState = signal<AuthResponse | null>(this.readFromStorage());

  readonly currentUser = computed(() => this.authState());
  readonly isLoggedIn = computed(() => this.authState() !== null);
  // Roles are strictly separate - each user sees and can access only their
  // own panel. Admin does not implicitly get organizer access (or vice versa);
  // admin has its own oversight tools (Admin > Events) for moderating any event.
  readonly isOrganizer = computed(() => this.authState()?.role === 'Organizer');
  readonly isAdmin = computed(() => this.authState()?.role === 'Admin');
  // Gate staff scan tickets at their assigned gate(s) only - a separate,
  // stripped-down mobile experience, not one of the DashboardShell panels.
  readonly isGateUser = computed(() => this.authState()?.role === 'GateUser');
  // Organizer/Admin are back-office roles - they manage events, they don't
  // browse/book as a customer would. Browsing is for anonymous visitors and
  // customers only.
  readonly isStaff = computed(() => this.isOrganizer() || this.isAdmin());

  constructor(private http: HttpClient) {}

  private readFromStorage(): AuthResponse | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthResponse) : null;
  }

  private persist(auth: AuthResponse | null) {
    if (auth) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    this.authState.set(auth);
  }

  register(fullName: string, email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_BASE_URL}/auth/register`, { fullName, email, password })
      .pipe(tap((auth) => this.persist(auth)));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_BASE_URL}/auth/login`, { email, password })
      .pipe(tap((auth) => this.persist(auth)));
  }

  logout(): void {
    this.persist(null);
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${API_BASE_URL}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/auth/reset-password`, { token, newPassword });
  }

  get token(): string | null {
    return this.authState()?.token ?? null;
  }
}
