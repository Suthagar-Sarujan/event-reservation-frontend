import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { UserMenu } from '../user-menu/user-menu';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

type Variant = 'organizer' | 'admin' | 'customer';

interface NavItem {
  label: string;
  path: string;
  exact?: boolean;
  icon: string;
}

const ORGANIZER_NAV: NavItem[] = [
  { label: 'My Events', path: '/organizer', exact: true, icon: 'pi-objects-column' },
  { label: 'Create Event', path: '/organizer/events/new', icon: 'pi-plus' },
  { label: 'Fraud & Risk', path: '/organizer/fraud', icon: 'pi-shield' },
  { label: 'Verify Ticket', path: '/organizer/verify', icon: 'pi-qrcode' },
];

const ADMIN_NAV: NavItem[] = [
  { label: 'Overview', path: '/admin', exact: true, icon: 'pi-objects-column' },
  { label: 'Users', path: '/admin/users', icon: 'pi-users' },
  { label: 'Events', path: '/admin/events', icon: 'pi-calendar' },
  { label: 'Bookings', path: '/admin/bookings', icon: 'pi-ticket' },
  { label: 'Fraud & Risk', path: '/admin/fraud', icon: 'pi-shield' },
];

const CUSTOMER_NAV: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', exact: true, icon: 'pi-objects-column' },
  { label: 'My Bookings', path: '/my-bookings', icon: 'pi-ticket' },
];

const NAV_BY_VARIANT: Record<Variant, NavItem[]> = {
  organizer: ORGANIZER_NAV,
  admin: ADMIN_NAV,
  customer: CUSTOMER_NAV,
};

const SECTION_LABEL: Record<Variant, string> = {
  organizer: 'Organizer',
  admin: 'Administration',
  customer: 'My Account',
};

const TOPBAR_TITLE: Record<Variant, string> = {
  organizer: 'Organizer Panel',
  admin: 'Admin Panel',
  customer: 'My Account',
};

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, UserMenu, ThemeToggle, ButtonModule],
  templateUrl: './dashboard-shell.html',
  styleUrl: './dashboard-shell.scss',
})
export class DashboardShell {
  sidebarOpen = signal(false);
  variant: Variant;
  navItems: NavItem[];
  sectionLabel: string;
  topbarTitle: string;

  constructor(
    protected auth: AuthService,
    private router: Router,
    route: ActivatedRoute,
  ) {
    this.variant = (route.snapshot.data['variant'] as Variant) ?? 'organizer';
    this.navItems = NAV_BY_VARIANT[this.variant];
    this.sectionLabel = SECTION_LABEL[this.variant];
    this.topbarTitle = TOPBAR_TITLE[this.variant];
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  logout(): void {
    this.closeSidebar();
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
