import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../../core/services/event.service';
import { RecommendationService } from '../../../../core/services/recommendation.service';
import { UserPreferenceService } from '../../../../core/services/user-preference.service';
import { AuthService } from '../../../../core/services/auth.service';
import { EventFilters, EventSummary, RecommendedEvent } from '../../../../core/models/models';
import { EventCard } from '../../../../shared/components/event-card/event-card';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { SkeletonCards } from '../../../../shared/components/skeleton/skeleton';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, EventCard, EmptyState, SkeletonCards],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  recommended = signal<RecommendedEvent[]>([]);
  recommendedLoading = signal(true);

  // "Because You Like X" - a slice of `recommended` whose reason names the
  // user's top onboarding interest, rather than a second recommender call.
  topInterest = signal<string | null>(null);
  becauseYouLike = signal<RecommendedEvent[]>([]);

  popular = signal<RecommendedEvent[]>([]);
  popularLoading = signal(true);

  events = signal<EventSummary[]>([]);
  total = signal(0);
  page = signal(1);
  pageSize = 12;
  loading = signal(true);

  filters = signal<EventFilters>({ types: [], subCategories: [] });
  search = '';
  selectedType = '';
  selectedSubCategory = '';

  constructor(
    private eventService: EventService,
    private recommendationService: RecommendationService,
    private preferenceService: UserPreferenceService,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.eventService.filters().subscribe((f) => this.filters.set(f));
    this.recommendationService.forYou(8).subscribe({
      next: (recs) => {
        this.recommended.set(recs);
        this.recommendedLoading.set(false);
        this.loadBecauseYouLike();
      },
      error: () => this.recommendedLoading.set(false),
    });
    this.recommendationService.popular(8).subscribe({
      next: (recs) => {
        this.popular.set(recs);
        this.popularLoading.set(false);
      },
      error: () => this.popularLoading.set(false),
    });
    this.loadEvents(1);
  }

  // Picks the user's first selected interest (event type, else genre) and
  // pulls matching events out of the already-fetched `recommended` list by
  // its `reason` text - the recommender already tags each item with why it
  // matched, so no extra endpoint/round-trip is needed for this section.
  private loadBecauseYouLike(): void {
    if (!this.auth.isLoggedIn()) return;
    this.preferenceService.get().subscribe({
      next: (prefs) => {
        const interest = prefs.eventTypes[0] ?? prefs.musicGenres[0] ?? null;
        if (!interest) return;
        const matches = this.recommended().filter((r) =>
          r.reason.toLowerCase().includes(interest.toLowerCase()),
        );
        if (matches.length === 0) return;
        this.topInterest.set(interest);
        this.becauseYouLike.set(matches);
      },
      error: () => {},
    });
  }

  loadEvents(page: number): void {
    this.loading.set(true);
    this.eventService
      .list({
        search: this.search || undefined,
        type: this.selectedType || undefined,
        taxonomySubName: this.selectedSubCategory || undefined,
        page,
        pageSize: this.pageSize,
      })
      .subscribe((res) => {
        this.events.set(res.items);
        this.total.set(res.total);
        this.page.set(res.page);
        this.loading.set(false);
      });
  }

  applyFilters(): void {
    this.loadEvents(1);
  }

  get hasActiveFilters(): boolean {
    return !!(this.search || this.selectedType || this.selectedSubCategory);
  }

  clearFilters(): void {
    this.search = '';
    this.selectedType = '';
    this.selectedSubCategory = '';
    this.loadEvents(1);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total() / this.pageSize));
  }

  nextPage(): void {
    if (this.page() < this.totalPages) this.loadEvents(this.page() + 1);
  }

  prevPage(): void {
    if (this.page() > 1) this.loadEvents(this.page() - 1);
  }
}
