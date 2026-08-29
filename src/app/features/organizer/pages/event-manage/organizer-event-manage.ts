import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrganizerService } from '../../../../core/services/organizer.service';
import { OrganizerBooking, OrganizerEventDetail } from '../../../../core/models/models';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-organizer-event-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, EmptyState],
  templateUrl: './organizer-event-manage.html',
  styleUrl: './organizer-event-manage.scss',
})
export class OrganizerEventManage implements OnInit {
  eventId!: number;
  event = signal<OrganizerEventDetail | null>(null);
  bookings = signal<OrganizerBooking[]>([]);
  loading = signal(true);
  savingDetails = signal(false);
  detailsError = signal<string | null>(null);
  detailsSaved = signal(false);

  editName = '';
  editDatetimeLocal = '';
  editStatus = 'normal';
  editImageUrl = '';

  newListing = { section: '', quantity: 20, unitPrice: 25 };
  addListingError = signal<string | null>(null);
  listingEdits: Record<string, { quantity: number; unitPrice: number }> = {};
  savingListingId = signal<string | null>(null);
  resendingId = signal<number | null>(null);
  resendError = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private organizerService: OrganizerService,
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
    this.organizerService.eventBookings(this.eventId).subscribe((b) => this.bookings.set(b));
  }

  private load(): void {
    this.organizerService.getEvent(this.eventId).subscribe((e) => {
      this.event.set(e);
      this.editName = e.name;
      this.editDatetimeLocal = toLocalInputValue(e.datetimeUtc);
      this.editStatus = e.status;
      this.editImageUrl = e.imageUrl ?? '';
      for (const l of e.listings) {
        this.listingEdits[l.listingId] = { quantity: l.quantity, unitPrice: l.unitPrice };
      }
      this.loading.set(false);
    });
  }

  saveDetails(): void {
    this.detailsError.set(null);
    this.detailsSaved.set(false);
    this.savingDetails.set(true);
    this.organizerService
      .updateEvent(
        this.eventId,
        this.editName.trim(),
        new Date(this.editDatetimeLocal).toISOString(),
        this.editStatus,
        this.editImageUrl.trim() || undefined,
      )
      .subscribe({
        next: () => {
          this.savingDetails.set(false);
          this.detailsSaved.set(true);
          this.load();
        },
        error: (err) => {
          this.savingDetails.set(false);
          this.detailsError.set(err.error?.message ?? 'Could not save changes.');
        },
      });
  }

  addListing(): void {
    this.addListingError.set(null);
    if (!this.newListing.quantity || this.newListing.quantity < 1 || this.newListing.unitPrice < 0) {
      this.addListingError.set('Enter a quantity of at least 1 and a non-negative price.');
      return;
    }
    this.organizerService.addListing(this.eventId, this.newListing).subscribe({
      next: () => {
        this.newListing = { section: '', quantity: 20, unitPrice: 25 };
        this.load();
      },
      error: (err) => this.addListingError.set(err.error?.message ?? 'Could not add the listing.'),
    });
  }

  saveListing(listingId: string): void {
    const edit = this.listingEdits[listingId];
    this.savingListingId.set(listingId);
    this.organizerService.updateListing(listingId, edit.quantity, edit.unitPrice).subscribe({
      next: () => {
        this.savingListingId.set(null);
        this.load();
      },
      error: () => this.savingListingId.set(null),
    });
  }

  resendEmail(booking: OrganizerBooking): void {
    this.resendError.set(null);
    this.resendingId.set(booking.bookingId);
    this.organizerService.resendBookingEmail(booking.bookingId).subscribe({
      next: () => {
        this.resendingId.set(null);
        this.organizerService.eventBookings(this.eventId).subscribe((b) => this.bookings.set(b));
      },
      error: (err) => {
        this.resendingId.set(null);
        this.resendError.set(err.error?.message ?? 'Could not resend the confirmation email. Please try again.');
      },
    });
  }
}

function toLocalInputValue(isoUtc: string): string {
  const d = new Date(isoUtc);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
