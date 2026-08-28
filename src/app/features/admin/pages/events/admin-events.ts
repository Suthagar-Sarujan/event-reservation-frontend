import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { FluidModule } from 'primeng/fluid';
import { AdminService } from '../../../../core/services/admin.service';
import { AdminEvent } from '../../../../core/models/models';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { SkeletonTable } from '../../../../shared/components/skeleton/skeleton';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EmptyState,
    SkeletonTable,
    ConfirmDialog,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    MessageModule,
    TableModule,
    SelectModule,
    DialogModule,
    FluidModule,
  ],
  templateUrl: './admin-events.html',
  styleUrl: './admin-events.scss',
})
export class AdminEvents implements OnInit {
  events = signal<AdminEvent[]>([]);
  total = signal(0);
  loading = signal(true);
  search = '';
  cancellingId = signal<number | null>(null);
  pendingCancel = signal<AdminEvent | null>(null);

  readonly sourceOptions = [
    { label: 'All', value: '' },
    { label: 'SeatGeek', value: 'seatgeek' },
    { label: 'Organizer', value: 'organizer' },
  ];

  readonly statusOptions = [
    { label: 'All', value: '' },
    { label: 'Normal', value: 'normal' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  // Column filters (PrimeNG-style filter row) - scoped to the currently
  // loaded page, distinct from the name search above which re-queries the
  // server across every event, not just this page's 50.
  venueFilter = signal('');
  sourceFilter = signal<'' | 'seatgeek' | 'organizer'>('');
  statusFilter = signal<'' | 'normal' | 'cancelled'>('');

  filteredEvents = computed<AdminEvent[]>(() => {
    const venue = this.venueFilter().trim().toLowerCase();
    const source = this.sourceFilter();
    const status = this.statusFilter();
    return this.events().filter((e) => {
      if (source && e.source !== source) return false;
      if (status && e.status !== status) return false;
      if (venue && !e.venueName.toLowerCase().includes(venue)) return false;
      return true;
    });
  });

  editingEvent = signal<AdminEvent | null>(null);
  editName = '';
  editDatetimeLocal = '';
  editStatus = 'normal';
  editImageUrl = '';
  savingEdit = signal(false);
  editError = signal<string | null>(null);

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.adminService.events(this.search || undefined, 1, 50).subscribe((res) => {
      this.events.set(res.items);
      this.total.set(res.total);
      this.loading.set(false);
    });
  }

  requestCancel(e: AdminEvent): void {
    this.pendingCancel.set(e);
  }

  confirmCancel(): void {
    const e = this.pendingCancel();
    if (!e) return;
    this.pendingCancel.set(null);
    this.cancellingId.set(e.eventId);
    this.adminService.cancelEvent(e.eventId).subscribe({
      next: () => {
        this.cancellingId.set(null);
        this.load();
      },
      error: () => this.cancellingId.set(null),
    });
  }

  startEdit(e: AdminEvent): void {
    this.editError.set(null);
    this.editName = e.name;
    this.editDatetimeLocal = toLocalInputValue(e.datetimeUtc);
    this.editStatus = e.status;
    this.editImageUrl = e.imageUrl ?? '';
    this.editingEvent.set(e);
  }

  cancelEdit(): void {
    this.editingEvent.set(null);
  }

  saveEdit(): void {
    const e = this.editingEvent();
    if (!e) return;
    if (!this.editName.trim() || !this.editDatetimeLocal) {
      this.editError.set('Name and date are required.');
      return;
    }
    this.editError.set(null);
    this.savingEdit.set(true);
    this.adminService
      .updateEvent(
        e.eventId,
        this.editName.trim(),
        new Date(this.editDatetimeLocal).toISOString(),
        this.editStatus,
        this.editImageUrl.trim() || undefined,
      )
      .subscribe({
        next: () => {
          this.savingEdit.set(false);
          this.editingEvent.set(null);
          this.load();
        },
        error: (err) => {
          this.savingEdit.set(false);
          this.editError.set(err.error?.message ?? 'Could not save changes.');
        },
      });
  }
}

function toLocalInputValue(isoUtc: string): string {
  const d = new Date(isoUtc);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
