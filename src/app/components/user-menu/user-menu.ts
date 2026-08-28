import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule, MenuModule, AvatarModule],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.scss',
})
export class UserMenu {
  constructor(
    protected auth: AuthService,
    private router: Router,
  ) {}

  initials(): string {
    const name = this.auth.currentUser()?.fullName ?? '';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('');
  }

  items = computed<MenuItem[]>(() => {
    const list: MenuItem[] = [];
    if (!this.auth.isStaff()) {
      list.push({ label: 'Dashboard', icon: 'pi pi-objects-column', routerLink: '/dashboard' });
      list.push({ label: 'My Bookings', icon: 'pi pi-ticket', routerLink: '/my-bookings' });
    }
    if (this.auth.isOrganizer()) {
      list.push({ label: 'Organizer Panel', icon: 'pi pi-briefcase', routerLink: '/organizer' });
    }
    if (this.auth.isAdmin()) {
      list.push({ label: 'Admin Panel', icon: 'pi pi-shield', routerLink: '/admin' });
    }
    list.push({ separator: true });
    list.push({
      label: 'Log out',
      icon: 'pi pi-sign-out',
      styleClass: 'danger-item',
      command: () => this.logout(),
    });
    return list;
  });

  private logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
