import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { AdminService } from '../../../../core/services/admin.service';
import { AdminBooking } from '../../../../core/models/models';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { SkeletonTable } from '../../../../shared/components/skeleton/skeleton';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    EmptyState,
    SkeletonTable,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TableModule,
    MessageModule,
  ],
  templateUrl: './admin-bookings.html',
  styleUrl: './admin-bookings.scss',
})
export class AdminBookings implements OnInit {
  bookings = signal<AdminBooking[]>([]);
  total = signal(0);
  loading = signal(true);
  search = '';
  resendingId = signal<number | null>(null);
  resendError = signal<string | null>(null);

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.adminService.bookings(this.search || undefined, 1, 50).subscribe((res) => {
      this.bookings.set(res.items);
      this.total.set(res.total);
      this.loading.set(false);
    });
  }

  resendEmail(booking: AdminBooking): void {
    this.resendError.set(null);
    this.resendingId.set(booking.bookingId);
    this.adminService.resendBookingEmail(booking.bookingId).subscribe({
      next: () => {
        this.resendingId.set(null);
        this.load();
      },
      error: (err) => {
        this.resendingId.set(null);
        this.resendError.set(err.error?.message ?? 'Could not resend the confirmation email. Please try again.');
      },
    });
  }
}
