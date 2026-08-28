import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { EventService } from '../../services/event.service';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { EventDetail, Listing, RecommendedEvent } from '../../models/models';
import { EventCard } from '../../components/event-card/event-card';
import { EmptyState } from '../../components/empty-state/empty-state';
import { preloadEventPhoto } from '../../components/event-image';
import { PaymentDialog, PaymentSummary } from '../../components/payment-dialog/payment-dialog';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    EventCard,
    EmptyState,
    PaymentDialog,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    IconFieldModule,
    InputIconModule,
    TableModule,
    SelectModule,
  ],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.scss',
})
export class EventDetailPage implements OnInit {
  event = signal<EventDetail | null>(null);
  similar = signal<RecommendedEvent[]>([]);
  loading = signal(true);
  quantities: Record<string, number> = {};
  bookingListingId = signal<string | null>(null);
  bookingError = signal<string | null>(null);
  confirmation = signal<{ reference: string; total: number; paymentReference: string | null } | null>(null);
  heroPhotoUrl = signal<string | null>(null);
  listingSearch = signal('');
  deliveryFilter = signal('');

  paymentOpen = signal(false);
  paymentProcessing = signal(false);
  paymentSummary = signal<PaymentSummary | null>(null);
  private pendingListingId: string | null = null;

  deliveryTypes = computed<string[]>(() => {
    const e = this.event();
    if (!e) return [];
    const types = new Set(e.listings.map((l) => l.deliveryType).filter((t): t is string => !!t));
    return [...types].sort();
  });

  deliveryOptions = computed(() => [
    { label: 'All delivery types', value: '' },
    ...this.deliveryTypes().map((t) => ({ label: t, value: t })),
  ]);

  filteredListings = computed<Listing[]>(() => {
    const e = this.event();
    if (!e) return [];
    const search = this.listingSearch().trim().toLowerCase();
    const delivery = this.deliveryFilter();
    return e.listings.filter((l) => {
      if (delivery && l.deliveryType !== delivery) return false;
      if (!search) return true;
      const haystack = `${l.sectionFull ?? ''} ${l.section ?? ''} ${l.rowLabel ?? ''}`.toLowerCase();
      return haystack.includes(search);
    });
  });

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

      if (detail.imageUrl) {
        this.heroPhotoUrl.set(detail.imageUrl);
      } else {
        this.heroPhotoUrl.set(null);
        preloadEventPhoto(detail.type, detail.eventId, (url) => this.heroPhotoUrl.set(url));
      }
    });
    this.eventService.similar(id, 6).subscribe((recs) => this.similar.set(recs));
  }

  heroBackground(url: string | null): string | null {
    if (!url) return null;
    return `linear-gradient(120deg, rgba(30,18,10,0.45), rgba(20,12,8,0.78)), url(${url})`;
  }

  // Clicking "Book" opens the payment step rather than booking immediately -
  // the actual booking API call only fires once the mock payment form is
  // submitted (see onPaid()), so a cancelled payment never touches inventory.
  book(listingId: string): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    const listing = this.event()?.listings.find((l) => l.listingId === listingId);
    if (!listing) return;

    this.bookingError.set(null);
    const quantity = this.quantities[listingId] ?? 1;
    this.pendingListingId = listingId;
    this.paymentSummary.set({
      eventName: this.event()!.name,
      quantity,
      unitPrice: listing.unitPrice,
      total: listing.unitPrice * quantity,
    });
    this.paymentOpen.set(true);
  }

  onPaid(): void {
    const listingId = this.pendingListingId;
    if (!listingId) return;

    this.paymentProcessing.set(true);
    this.bookingListingId.set(listingId);
    const quantity = this.quantities[listingId] ?? 1;
    this.bookingService.book(listingId, quantity).subscribe({
      next: (booking) => {
        this.paymentProcessing.set(false);
        this.paymentOpen.set(false);
        this.bookingListingId.set(null);
        this.pendingListingId = null;
        this.confirmation.set({
          reference: booking.bookingReference,
          total: booking.totalAmount,
          paymentReference: booking.paymentReference,
        });
        const id = this.event()!.eventId;
        this.load(id);
      },
      error: (err) => {
        this.paymentProcessing.set(false);
        this.paymentOpen.set(false);
        this.bookingListingId.set(null);
        this.pendingListingId = null;
        this.bookingError.set(err.error?.message ?? 'Could not complete the booking. Please try again.');
      },
    });
  }

  onPaymentCancelled(): void {
    this.paymentOpen.set(false);
    this.pendingListingId = null;
  }
}
