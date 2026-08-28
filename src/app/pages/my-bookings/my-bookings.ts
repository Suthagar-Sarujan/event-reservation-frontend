import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/models';
import { EmptyState } from '../../components/empty-state/empty-state';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    EmptyState,
    ConfirmDialog,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
  ],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.scss',
})
export class MyBookings implements OnInit {
  bookings = signal<Booking[]>([]);
  loading = signal(true);
  search = signal('');
  statusFilter = signal('');
  cancellingId = signal<number | null>(null);
  cancelError = signal<string | null>(null);
  bookingPendingCancel = signal<Booking | null>(null);

  readonly statusOptions = [
    { label: 'All statuses', value: '' },
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  filteredBookings = computed<Booking[]>(() => {
    const q = this.search().trim().toLowerCase();
    const status = this.statusFilter();
    return this.bookings().filter((b) => {
      if (status && b.status !== status) return false;
      if (!q) return true;
      return b.eventName.toLowerCase().includes(q) || b.bookingReference.toLowerCase().includes(q);
    });
  });

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.bookingService.myBookings().subscribe((res) => {
      this.bookings.set(res);
      this.loading.set(false);
    });
  }

  // Cancellable only while the event is still upcoming and the ticket hasn't
  // been checked in - matches the backend's own checks (BookingRepository.
  // CancelAsync); this is just the early, friendlier UI signal for the same
  // rules, so a customer isn't offered a Cancel button the API would reject.
  canCancel(booking: Booking): boolean {
    return (
      booking.status === 'Confirmed' &&
      !booking.checkedInAt &&
      new Date(booking.eventDatetimeUtc).getTime() > Date.now()
    );
  }

  requestCancel(booking: Booking): void {
    this.cancelError.set(null);
    this.bookingPendingCancel.set(booking);
  }

  confirmCancel(): void {
    const booking = this.bookingPendingCancel();
    if (!booking) return;
    this.bookingPendingCancel.set(null);
    this.cancellingId.set(booking.bookingId);
    this.bookingService.cancel(booking.bookingId).subscribe({
      next: () => {
        this.cancellingId.set(null);
        this.load();
      },
      error: (err) => {
        this.cancellingId.set(null);
        this.cancelError.set(err.error?.message ?? 'Could not cancel this booking. Please try again.');
      },
    });
  }
}
