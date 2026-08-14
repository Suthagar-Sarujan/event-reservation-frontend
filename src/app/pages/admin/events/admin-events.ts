import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { AdminEvent } from '../../../core/models/models';
import { Icon } from '../../../shared/icon/icon';
import { EmptyState } from '../../../shared/empty-state/empty-state';
import { SkeletonTable } from '../../../shared/skeleton/skeleton';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [CommonModule, FormsModule, Icon, EmptyState, SkeletonTable, ConfirmDialog],
  templateUrl: './admin-events.html',
  styleUrl: './admin-events.css',
})
export class AdminEvents implements OnInit {
  events = signal<AdminEvent[]>([]);
  total = signal(0);
  loading = signal(true);
  search = '';
  cancellingId = signal<number | null>(null);
  pendingCancel = signal<AdminEvent | null>(null);

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
