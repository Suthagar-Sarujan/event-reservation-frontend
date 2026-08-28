import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { FraudService } from '../../../../core/services/fraud.service';
import { FraudOverview } from '../../../../core/models/models';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { SkeletonTable } from '../../../../shared/components/skeleton/skeleton';

@Component({
  selector: 'app-organizer-fraud',
  standalone: true,
  imports: [CommonModule, RouterLink, EmptyState, SkeletonTable, TableModule],
  templateUrl: './organizer-fraud.html',
  styleUrl: './organizer-fraud.scss',
})
export class OrganizerFraud implements OnInit {
  overview = signal<FraudOverview | null>(null);
  loading = signal(true);

  constructor(private fraudService: FraudService) {}

  ngOnInit(): void {
    this.fraudService.organizerOverview().subscribe((overview) => {
      this.overview.set(overview);
      this.loading.set(false);
    });
  }

  badgeClass(level: string): string {
    switch (level.toLowerCase()) {
      case 'high':
        return 'badge badge-danger';
      case 'medium':
        return 'badge badge-warning';
      default:
        return 'badge badge-success';
    }
  }
}
