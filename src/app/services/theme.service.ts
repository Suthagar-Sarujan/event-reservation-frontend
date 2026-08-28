import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { API_BASE_URL } from '../api-config';
import { AuthService } from './auth.service';

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'event_reservation_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  // matchMedia is absent in some test/non-browser environments - fall back to
  // "light" rather than throwing, since that's not what's under test there.
  private readonly media =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : null;

  readonly preference = signal<ThemePreference>(this.readStoredPreference());
  private readonly systemPrefersDark = signal(this.media?.matches ?? false);

  readonly effectiveTheme = computed<'light' | 'dark'>(() => {
    const pref = this.preference();
    return pref === 'system' ? (this.systemPrefersDark() ? 'dark' : 'light') : pref;
  });

  constructor() {
    this.media?.addEventListener('change', (e) => this.systemPrefersDark.set(e.matches));

    effect(() => {
      this.document.documentElement.setAttribute('data-theme', this.effectiveTheme());
    });
  }

  // Called by the theme toggle - applies immediately, caches locally for the
  // next page load, and (when logged in) saves it to the account so it
  // follows the user to other devices/browsers too.
  setPreference(pref: ThemePreference): void {
    this.preference.set(pref);
    localStorage.setItem(STORAGE_KEY, pref);
    if (this.auth.isLoggedIn()) {
      this.http.patch<{ theme: string }>(`${API_BASE_URL}/auth/theme`, { theme: pref }).subscribe();
    }
  }

  // Called right after a successful login/register - the account's saved
  // preference is the source of truth once authenticated, so it overrides
  // whatever theme happened to be showing before (e.g. from a previous
  // user's session on the same browser), without re-saving it right back.
  adoptAccountPreference(theme: string): void {
    const pref = this.normalize(theme);
    this.preference.set(pref);
    localStorage.setItem(STORAGE_KEY, pref);
  }

  private readStoredPreference(): ThemePreference {
    return this.normalize(localStorage.getItem(STORAGE_KEY));
  }

  private normalize(value: string | null): ThemePreference {
    return value === 'light' || value === 'dark' ? value : 'system';
  }
}
