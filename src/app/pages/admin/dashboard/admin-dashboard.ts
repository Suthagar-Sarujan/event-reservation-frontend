import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeterGroupModule, MeterItem } from 'primeng/metergroup';
import { ProgressBarModule } from 'primeng/progressbar';
import { AdminService } from '../../../services/admin.service';
import { AdminStats, TrendPoint } from '../../../models/models';
import { AreaChart, AreaChartPoint } from '../../../components/area-chart/area-chart';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AreaChart, MeterGroupModule, ProgressBarModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  stats = signal<AdminStats | null>(null);
  trend = signal<TrendPoint[]>([]);

  // Every user has exactly one role and every event exactly one source, so
  // both are part-to-whole compositions, not a magnitude ranking - a
  // segmented bar (donut's non-circular sibling) is the right form, not a
  // plain bar-per-category list. p-meterGroup is PrimeNG's purpose-built
  // component for exactly this: a segmented bar plus its own legend.
  usersByRole = computed<MeterItem[]>(() => {
    const s = this.stats();
    if (!s) return [];
    return [
      { label: 'Customers', value: s.totalCustomers, color: 'var(--color-coral-500)' },
      { label: 'Organizers', value: s.totalOrganizers, color: 'var(--color-teal-500)' },
      { label: 'Admins', value: s.totalAdmins, color: 'var(--color-plum-500)' },
    ];
  });

  eventsBySource = computed<MeterItem[]>(() => {
    const s = this.stats();
    if (!s) return [];
    return [
      { label: 'SeatGeek', value: s.totalImportedEvents, color: 'var(--color-coral-500)' },
      { label: 'Organizer', value: s.totalOrganizerEvents, color: 'var(--color-teal-500)' },
    ];
  });

  organizerCatalogPercent = computed(() => {
    const s = this.stats();
    if (!s || s.totalEvents <= 0) return 0;
    return Math.round((s.totalOrganizerEvents / s.totalEvents) * 100);
  });

  revenueTrend = computed<AreaChartPoint[]>(() =>
    this.trend().map((p) => ({ label: formatShortDate(p.date), value: p.revenue })),
  );

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.stats().subscribe((s) => this.stats.set(s));
    this.adminService.bookingTrend(30).subscribe((t) => this.trend.set(t));
  }
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
