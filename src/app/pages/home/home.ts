import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { RecommendationService } from '../../services/recommendation.service';
import { EventFilters, EventSummary, RecommendedEvent } from '../../models/models';
import { EventCard } from '../../components/event-card/event-card';
import { EmptyState } from '../../components/empty-state/empty-state';
import { SkeletonCards } from '../../components/skeleton/skeleton';

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
  ) {}

  ngOnInit(): void {
    this.eventService.filters().subscribe((f) => this.filters.set(f));
    this.recommendationService.forYou(8).subscribe({
      next: (recs) => {
        this.recommended.set(recs);
        this.recommendedLoading.set(false);
      },
      error: () => this.recommendedLoading.set(false),
    });
    this.loadEvents(1);
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
