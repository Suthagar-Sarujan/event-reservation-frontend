import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import {
  ATMOSPHERE_OPTIONS,
  ATTENDANCE_FREQUENCY_OPTIONS,
  EVENT_TYPE_OPTIONS,
  MUSIC_GENRE_OPTIONS,
  UserPreferenceService,
} from '../../services/user-preference.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss',
})
export class Onboarding {
  readonly eventTypeOptions = EVENT_TYPE_OPTIONS;
  readonly musicGenreOptions = MUSIC_GENRE_OPTIONS;
  readonly atmosphereOptions = ATMOSPHERE_OPTIONS;
  readonly frequencyOptions = ATTENDANCE_FREQUENCY_OPTIONS;

  eventTypes = signal<string[]>([]);
  musicGenres = signal<string[]>([]);
  atmosphere = signal<string | null>(null);
  attendanceFrequency = signal<string | null>(null);
  saving = signal(false);

  constructor(
    private preferences: UserPreferenceService,
    private router: Router,
  ) {}

  toggleEventType(option: string): void {
    this.eventTypes.update((current) => toggle(current, option));
  }

  toggleGenre(option: string): void {
    this.musicGenres.update((current) => toggle(current, option));
  }

  selectAtmosphere(option: string): void {
    this.atmosphere.update((current) => (current === option ? null : option));
  }

  selectFrequency(option: string): void {
    this.attendanceFrequency.update((current) => (current === option ? null : option));
  }

  get canSubmit(): boolean {
    return this.eventTypes().length > 0 || this.musicGenres().length > 0;
  }

  submit(): void {
    if (!this.canSubmit || this.saving()) return;
    this.saving.set(true);
    this.preferences
      .update({
        eventTypes: this.eventTypes(),
        musicGenres: this.musicGenres(),
        atmosphere: this.atmosphere(),
        attendanceFrequency: this.attendanceFrequency(),
      })
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: () => this.saving.set(false),
      });
  }

  skip(): void {
    this.router.navigate(['/dashboard']);
  }
}

function toggle(current: string[], option: string): string[] {
  return current.includes(option) ? current.filter((v) => v !== option) : [...current, option];
}
