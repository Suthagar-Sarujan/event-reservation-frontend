import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AdminStats } from '../../../core/models/models';
import { Icon } from '../../../shared/icon/icon';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, Icon],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  stats = signal<AdminStats | null>(null);

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.stats().subscribe((s) => this.stats.set(s));
  }
}
