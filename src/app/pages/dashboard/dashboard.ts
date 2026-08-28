import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { RecommendationService } from '../../services/recommendation.service';
import { AuthService } from '../../services/auth.service';
import { Booking, RecommendedEvent } from '../../models/models';
import { EventCard } from '../../components/event-card/event-card';
import { EmptyState } from '../../components/empty-state/empty-state';
import { SkeletonCards } from '../../components/skeleton/skeleton';
import { AreaChart, AreaChartPoint } from '../../components/area-chart/area-chart';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';

const TREND_DAYS = 30;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, EventCard, EmptyState, SkeletonCards, AreaChart, ButtonModule, ProgressBarModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  bookings = signal<Booking[]>([]);
  recommended = signal<RecommendedEvent[]>([]);
  loadingBookings = signal(true);
  loadingRecommended = signal(true);

  confirmedPercent = computed(() => {
    const total = this.bookings().length;
    if (total <= 0) return 0;
    return Math.round((this.confirmedCount() / total) * 100);
  });

  upcomingBookings = computed(() => {
    const now = new Date();
    return this.bookings()
      .filter((b) => b.status === 'Confirmed' && new Date(b.eventDatetimeUtc) > now)
      .sort((a, b) => new Date(a.eventDatetimeUtc).getTime() - new Date(b.eventDatetimeUtc).getTime())
      .slice(0, 5);
  });

  totalSpent = computed(() =>
    this.bookings()
      .filter((b) => b.status === 'Confirmed')
      .reduce((sum, b) => sum + b.totalAmount, 0),
  );

  confirmedCount = computed(() => this.bookings().filter((b) => b.status === 'Confirmed').length);

  // Booking history already arrives with createdAt on every booking, so this
  // trend needs no extra request - grouped and zero-filled client-side.
  spendTrend = computed<AreaChartPoint[]>(() => {
    const since = startOfDay(new Date());
    since.setDate(since.getDate() - (TREND_DAYS - 1));

    const byDate = new Map<string, number>();
    for (const b of this.bookings()) {
      if (b.status !== 'Confirmed') continue;
      const created = startOfDay(new Date(b.createdAt));
      if (created < since) continue;
      byDate.set(dateKey(created), (byDate.get(dateKey(created)) ?? 0) + b.totalAmount);
    }

    const points: AreaChartPoint[] = [];
    for (let i = 0; i < TREND_DAYS; i++) {
      const d = new Date(since);
      d.setDate(d.getDate() + i);
      points.push({ label: formatShortDate(d), value: byDate.get(dateKey(d)) ?? 0 });
    }
    return points;
  });

  constructor(
    protected auth: AuthService,
    private bookingService: BookingService,
    private recommendationService: RecommendationService,
  ) {}

  ngOnInit(): void {
    this.bookingService.myBookings().subscribe((bookings) => {
      this.bookings.set(bookings);
      this.loadingBookings.set(false);
    });
    this.recommendationService.forYou(6).subscribe({
      next: (recs) => {
        this.recommended.set(recs);
        this.loadingRecommended.set(false);
      },
      error: () => this.loadingRecommended.set(false),
    });
  }
}

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatShortDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
