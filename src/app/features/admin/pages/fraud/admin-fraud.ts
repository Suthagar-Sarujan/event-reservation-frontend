import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { Table, TableModule } from 'primeng/table';
import { FraudService } from '../../../../core/services/fraud.service';
import { FraudOverview } from '../../../../core/models/models';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { SkeletonTable } from '../../../../shared/components/skeleton/skeleton';

// Matches the comma-joined signal codes FraudDetectionService writes (see
// backend Services/FraudDetectionService.cs) - kept in sync manually since
// the API returns the raw codes, not display labels.
const REASON_LABELS: Record<string, string> = {
  high_booking_velocity: 'High booking velocity',
  ip_multiple_accounts: 'IP used by multiple accounts',
  prior_blocked_or_flagged_activity: 'Prior blocked/flagged activity',
  unusually_large_quantity: 'Unusually large quantity',
  ticket_limit: 'Ticket limit reached',
};

@Component({
  selector: 'app-admin-fraud',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    EmptyState,
    SkeletonTable,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
    MessageModule,
  ],
  templateUrl: './admin-fraud.html',
  styleUrl: './admin-fraud.scss',
})
export class AdminFraud implements OnInit {
  @ViewChild('dt') table?: Table;

  overview = signal<FraudOverview | null>(null);
  loading = signal(false);
  refreshing = signal(false);
  error = signal<string | null>(null);

  globalFilter = '';
  levelFilter: string | null = null;
  decisionFilter: string | null = null;

  readonly levelOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' },
  ];

  readonly decisionOptions = [
    { label: 'Allowed', value: 'Allowed' },
    { label: 'Flagged', value: 'Flagged' },
    { label: 'Blocked', value: 'Blocked' },
  ];

  constructor(private fraudService: FraudService) {}

  ngOnInit(): void {
    this.load();
  }

  // A single flag guards both the initial load and the refresh button so a
  // second click (or a slow network + eager double-click) can't fire a
  // duplicate request while one is already in flight.
  load(): void {
    if (this.loading() || this.refreshing()) return;

    const isFirstLoad = this.overview() === null;
    if (isFirstLoad) {
      this.loading.set(true);
    } else {
      this.refreshing.set(true);
    }
    this.error.set(null);

    this.fraudService.adminOverview().subscribe({
      next: (overview) => {
        this.overview.set(overview);
        this.loading.set(false);
        this.refreshing.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.refreshing.set(false);
        this.error.set(
          isFirstLoad
            ? 'Could not load fraud data. Please try again.'
            : 'Could not refresh fraud data - showing the last loaded results.',
        );
      },
    });
  }

  onLevelFilterChange(value: string | null): void {
    this.table?.filter(value, 'riskLevel', 'equals');
  }

  onDecisionFilterChange(value: string | null): void {
    this.table?.filter(value, 'decision', 'equals');
  }

  resetFilters(): void {
    this.globalFilter = '';
    this.levelFilter = null;
    this.decisionFilter = null;
    this.table?.clear();
  }

  hasActiveFilters(): boolean {
    return !!(this.globalFilter || this.levelFilter || this.decisionFilter);
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

  humanizeReasons(reasons: string): string {
    if (!reasons || reasons.toLowerCase() === 'none') return '—';
    return reasons
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean)
      .map((r) => REASON_LABELS[r] ?? r.replace(/_/g, ' '))
      .join(', ');
  }
}
