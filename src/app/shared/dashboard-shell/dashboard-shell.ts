import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Icon } from '../icon/icon';
import { UserMenu } from '../user-menu/user-menu';

interface NavItem {
  label: string;
  path: string;
  exact?: boolean;
  icon: string;
}

const ORGANIZER_NAV: NavItem[] = [
  { label: 'My Events', path: '/organizer', exact: true, icon: 'layout-dashboard' },
  { label: 'Create Event', path: '/organizer/events/new', icon: 'plus' },
];

const ADMIN_NAV: NavItem[] = [
  { label: 'Overview', path: '/admin', exact: true, icon: 'layout-dashboard' },
  { label: 'Users', path: '/admin/users', icon: 'users' },
  { label: 'Events', path: '/admin/events', icon: 'calendar' },
  { label: 'Bookings', path: '/admin/bookings', icon: 'ticket' },
];

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon, UserMenu],
  templateUrl: './dashboard-shell.html',
  styleUrl: './dashboard-shell.css',
})
export class DashboardShell {
  sidebarOpen = signal(false);
  variant: 'organizer' | 'admin';
  navItems: NavItem[];

  constructor(
    protected auth: AuthService,
    route: ActivatedRoute,
  ) {
    this.variant = (route.snapshot.data['variant'] as 'organizer' | 'admin') ?? 'organizer';
    this.navItems = this.variant === 'admin' ? ADMIN_NAV : ORGANIZER_NAV;
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
