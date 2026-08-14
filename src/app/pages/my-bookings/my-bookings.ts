import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models/models';
import { Icon } from '../../shared/icon/icon';
import { EmptyState } from '../../shared/empty-state/empty-state';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink, Icon, EmptyState],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css',
})
export class MyBookings implements OnInit {
  bookings = signal<Booking[]>([]);
  loading = signal(true);

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.myBookings().subscribe((res) => {
      this.bookings.set(res);
      this.loading.set(false);
    });
  }
}
