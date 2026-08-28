import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BookingService } from '../../../../core/services/booking.service';
import { Ticket } from '../../../../core/models/models';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-ticket-view',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, EmptyState],
  templateUrl: './ticket-view.html',
  styleUrl: './ticket-view.scss',
})
export class TicketView implements OnInit {
  ticket = signal<Ticket | null>(null);
  loading = signal(true);
  notFound = signal(false);

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.bookingService.getTicket(id).subscribe({
      next: (ticket) => {
        this.ticket.set(ticket);
        this.loading.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      },
    });
  }

  print(): void {
    window.print();
  }
}
