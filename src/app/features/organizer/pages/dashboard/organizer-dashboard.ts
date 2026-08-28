import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { OrganizerService } from '../../../../core/services/organizer.service';
import { DemandService } from '../../../../core/services/demand.service';
import { DemandModelInfo, DemandPrediction, OrganizerEventSummary, TrendPoint } from '../../../../core/models/models';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { SkeletonTable } from '../../../../shared/components/skeleton/skeleton';
import { BarChart, BarChartItem } from '../../../../shared/components/bar-chart/bar-chart';
import { AreaChart, AreaChartPoint } from '../../../../shared/components/area-chart/area-chart';
import { ProgressBarModule } from 'primeng/progressbar';

const MAX_CHART_EVENTS = 8;

@Component({
  selector: 'app-organizer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    EmptyState,
    SkeletonTable,
    BarChart,
    AreaChart,
    ProgressBarModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TableModule,
    SelectModule,
  ],
  templateUrl: './organizer-dashboard.html',
  styleUrl: './organizer-dashboard.scss',
})
export class OrganizerDashboard implements OnInit {
  events = signal<OrganizerEventSummary[]>([]);
  loading = signal(true);
  trend = signal<TrendPoint[]>([]);
  search = signal('');
  statusFilter = signal('');

  demandPredictions = signal<DemandPrediction[]>([]);
  demandLoading = signal(true);
  demandModelInfo = signal<DemandModelInfo | null>(null);
  retraining = signal(false);

  readonly statusOptions = [
    { label: 'All statuses', value: '' },
    { label: 'Normal', value: 'normal' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  totalRevenue = computed(() => this.events().reduce((sum, e) => sum + e.revenue, 0));
  totalSold = computed(() => this.events().reduce((sum, e) => sum + e.ticketsSold, 0));
  totalCapacity = computed(() => this.events().reduce((sum, e) => sum + e.ticketsSold + e.ticketsRemaining, 0));
  sellThroughPercent = computed(() => {
    const capacity = this.totalCapacity();
    if (capacity <= 0) return 0;
    return Math.round((this.totalSold() / capacity) * 100);
  });

  // Table rows only - the stat cards and charts above stay based on every
  // event, so filtering the table never makes the summary numbers disagree.
  filteredEvents = computed<OrganizerEventSummary[]>(() => {
    const q = this.search().trim().toLowerCase();
    const status = this.statusFilter();
    return this.events().filter((e) => {
      if (status && e.status !== status) return false;
      if (!q) return true;
      return e.name.toLowerCase().includes(q) || e.venueName.toLowerCase().includes(q);
    });
  });

  revenueTrend = computed<AreaChartPoint[]>(() =>
    this.trend().map((p) => ({ label: formatShortDate(p.date), value: p.revenue })),
  );

  // Magnitude ranking across events, not distinct identities - one hue, sorted
  // high to low, capped so a large event list doesn't turn into an unreadable wall of bars.
  revenueByEvent = computed<BarChartItem[]>(() =>
    [...this.events()]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, MAX_CHART_EVENTS)
      .map((e) => ({
        label: e.name,
        value: e.revenue,
        displayValue: `$${e.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      })),
  );

  ticketsSoldByEvent = computed<BarChartItem[]>(() =>
    [...this.events()]
      .sort((a, b) => b.ticketsSold - a.ticketsSold)
      .slice(0, MAX_CHART_EVENTS)
      .map((e) => ({ label: e.name, value: e.ticketsSold })),
  );

  // Magnitude ranking by predicted demand, colored by level so the chart
  // doubles as a legend (green = HIGH, amber = MEDIUM, gray = LOW) without a
  // separate key.
  predictedDemandByEvent = computed<BarChartItem[]>(() =>
    [...this.demandPredictions()]
      .sort((a, b) => b.predictedDemand - a.predictedDemand)
      .slice(0, MAX_CHART_EVENTS)
      .map((p) => ({
        label: p.eventName,
        value: p.predictedDemand,
        displayValue: `${p.predictedDemand.toLocaleString()} (${Math.round(p.expectedOccupancy * 100)}%)`,
        color: demandLevelColor(p.demandLevel),
      })),
  );

  constructor(
    private organizerService: OrganizerService,
    private demandService: DemandService,
  ) {}

  ngOnInit(): void {
    this.organizerService.myEvents().subscribe((events) => {
      this.events.set(events);
      this.loading.set(false);
    });
    this.organizerService.salesTrend(30).subscribe((t) => this.trend.set(t));
    this.loadDemand();
  }

  private loadDemand(): void {
    this.demandLoading.set(true);
    this.demandService.myPredictions().subscribe((predictions) => {
      this.demandPredictions.set(predictions);
      this.demandLoading.set(false);
    });
    this.demandService.modelInfo().subscribe((info) => this.demandModelInfo.set(info));
  }

  retrainDemandModel(): void {
    if (this.retraining()) return;
    this.retraining.set(true);
    this.demandService.retrain().subscribe({
      next: (info) => {
        this.demandModelInfo.set(info);
        this.retraining.set(false);
        this.loadDemand();
      },
      error: () => this.retraining.set(false),
    });
  }

  demandBadgeClass(level: string): string {
    switch (level.toLowerCase()) {
      case 'high':
        return 'badge badge-success';
      case 'medium':
        return 'badge badge-warning';
      default:
        return 'badge badge-neutral';
    }
  }
}

function demandLevelColor(level: string): string {
  switch (level.toLowerCase()) {
    case 'high':
      return 'var(--success)';
    case 'medium':
      return 'var(--warning)';
    default:
      return 'var(--text-secondary)';
  }
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
