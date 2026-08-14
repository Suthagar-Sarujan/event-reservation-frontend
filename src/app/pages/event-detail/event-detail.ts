import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { EventDetail, RecommendedEvent } from '../../core/models/models';
import { EventCard } from '../../shared/event-card/event-card';
import { Icon } from '../../shared/icon/icon';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { fallbackEventImage } from '../../shared/event-image';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, EventCard, Icon, EmptyState],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css',
})
export class EventDetailPage implements OnInit {
  event = signal<EventDetail | null>(null);
  similar = signal<RecommendedEvent[]>([]);
  loading = signal(true);
  quantities: Record<string, number> = {};
  bookingListingId = signal<string | null>(null);
  bookingError = signal<string | null>(null);
  confirmation = signal<{ reference: string; total: number } | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private bookingService: BookingService,
    protected auth: AuthService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.load(id);
  }

  private load(id: number): void {
    this.loading.set(true);
    this.eventService.get(id).subscribe((detail) => {
      this.event.set(detail);
      detail.listings.forEach((l) => (this.quantities[l.listingId] = 1));
      this.loading.set(false);
    });
    this.eventService.similar(id, 6).subscribe((recs) => this.similar.set(recs));
  }

  heroBackgroundImage(): string | null {
    const e = this.event();
    if (!e) return null;
    const url = e.imageUrl ?? fallbackEventImage(e.type, e.eventId);
    return `linear-gradient(120deg, rgba(30,18,10,0.45), rgba(20,12,8,0.78)), url(${url})`;
  }

  book(listingId: string): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.bookingError.set(null);
    this.bookingListingId.set(listingId);
    const quantity = this.quantities[listingId] ?? 1;
    this.bookingService.book(listingId, quantity).subscribe({
      next: (booking) => {
        this.bookingListingId.set(null);
        this.confirmation.set({ reference: booking.bookingReference, total: booking.totalAmount });
        const id = this.event()!.eventId;
        this.load(id);
      },
      error: (err) => {
        this.bookingListingId.set(null);
        this.bookingError.set(err.error?.message ?? 'Could not complete the booking. Please try again.');
      },
    });
  }
}
