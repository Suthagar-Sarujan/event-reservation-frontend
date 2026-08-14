import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
import { RecommendationService } from '../../core/services/recommendation.service';
import { AuthService } from '../../core/services/auth.service';
import { Booking, RecommendedEvent } from '../../core/models/models';
import { EventCard } from '../../shared/event-card/event-card';
import { Icon } from '../../shared/icon/icon';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { SkeletonCards } from '../../shared/skeleton/skeleton';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, EventCard, Icon, EmptyState, SkeletonCards],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  bookings = signal<Booking[]>([]);
  recommended = signal<RecommendedEvent[]>([]);
  loadingBookings = signal(true);
  loadingRecommended = signal(true);

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
