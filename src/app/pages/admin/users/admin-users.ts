import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { AdminUser } from '../../../core/models/models';
import { Icon } from '../../../shared/icon/icon';
import { EmptyState } from '../../../shared/empty-state/empty-state';
import { SkeletonTable } from '../../../shared/skeleton/skeleton';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, Icon, EmptyState, SkeletonTable],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers implements OnInit {
  users = signal<AdminUser[]>([]);
  total = signal(0);
  loading = signal(true);
  search = '';
  savingUserId = signal<number | null>(null);
  error = signal<string | null>(null);

  constructor(
    private adminService: AdminService,
    protected auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.adminService.users(this.search || undefined).subscribe((res) => {
      this.users.set(res.items);
      this.total.set(res.total);
      this.loading.set(false);
    });
  }

  changeRole(user: AdminUser, role: string): void {
    if (role === user.role) return;
    this.error.set(null);
    this.savingUserId.set(user.userId);
    this.adminService.updateUserRole(user.userId, role).subscribe({
      next: () => {
        this.savingUserId.set(null);
        this.load();
      },
      error: (err) => {
        this.savingUserId.set(null);
        this.error.set(err.error?.message ?? 'Could not update this user\'s role.');
      },
    });
  }
}
