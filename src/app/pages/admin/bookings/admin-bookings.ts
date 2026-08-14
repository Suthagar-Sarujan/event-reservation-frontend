import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { AdminBooking } from '../../../core/models/models';
import { EmptyState } from '../../../shared/empty-state/empty-state';
import { SkeletonTable } from '../../../shared/skeleton/skeleton';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink, EmptyState, SkeletonTable],
  templateUrl: './admin-bookings.html',
  styleUrl: './admin-bookings.css',
})
export class AdminBookings implements OnInit {
  bookings = signal<AdminBooking[]>([]);
  total = signal(0);
  loading = signal(true);

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.bookings(1, 50).subscribe((res) => {
      this.bookings.set(res.items);
      this.total.set(res.total);
      this.loading.set(false);
    });
  }
}
