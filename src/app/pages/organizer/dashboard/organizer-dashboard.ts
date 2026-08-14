import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrganizerService } from '../../../core/services/organizer.service';
import { OrganizerEventSummary } from '../../../core/models/models';
import { Icon } from '../../../shared/icon/icon';
import { EmptyState } from '../../../shared/empty-state/empty-state';
import { SkeletonTable } from '../../../shared/skeleton/skeleton';

@Component({
  selector: 'app-organizer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, Icon, EmptyState, SkeletonTable],
  templateUrl: './organizer-dashboard.html',
  styleUrl: './organizer-dashboard.css',
})
export class OrganizerDashboard implements OnInit {
  events = signal<OrganizerEventSummary[]>([]);
  loading = signal(true);

  totalRevenue = computed(() => this.events().reduce((sum, e) => sum + e.revenue, 0));
  totalSold = computed(() => this.events().reduce((sum, e) => sum + e.ticketsSold, 0));

  constructor(private organizerService: OrganizerService) {}

  ngOnInit(): void {
    this.organizerService.myEvents().subscribe((events) => {
      this.events.set(events);
      this.loading.set(false);
    });
  }
}
