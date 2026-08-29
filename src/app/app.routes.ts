import { Routes } from '@angular/router';
import { PublicShell } from './shared/components/public-shell/public-shell';
import { DashboardShell } from './shared/components/dashboard-shell/dashboard-shell';
import { Home } from './features/customer/pages/home/home';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { ForgotPassword } from './features/auth/pages/forgot-password/forgot-password';
import { ResetPassword } from './features/auth/pages/reset-password/reset-password';
import { EventDetailPage } from './features/customer/pages/event-detail/event-detail';
import { MyBookings } from './features/customer/pages/my-bookings/my-bookings';
import { Dashboard } from './features/customer/pages/dashboard/dashboard';
import { customerGuard, organizerGuard, adminGuard, gateUserGuard } from './core/guards/role.guard';
import { OrganizerDashboard } from './features/organizer/pages/dashboard/organizer-dashboard';
import { OrganizerEventForm } from './features/organizer/pages/event-form/organizer-event-form';
import { OrganizerEventManage } from './features/organizer/pages/event-manage/organizer-event-manage';
import { AdminDashboard } from './features/admin/pages/dashboard/admin-dashboard';
import { AdminUsers } from './features/admin/pages/users/admin-users';
import { AdminEvents } from './features/admin/pages/events/admin-events';
import { AdminBookings } from './features/admin/pages/bookings/admin-bookings';
import { AdminFraud } from './features/admin/pages/fraud/admin-fraud';
import { OrganizerFraud } from './features/organizer/pages/fraud/organizer-fraud';
import { Onboarding } from './features/auth/pages/onboarding/onboarding';
import { TicketView } from './features/customer/pages/ticket-view/ticket-view';
import { OrganizerVerifyTicket } from './features/organizer/pages/verify/organizer-verify-ticket';
import { AdminGates } from './features/admin/pages/gates/admin-gates';
import { GateShell } from './shared/components/gate-shell/gate-shell';
import { GateSelect } from './features/gate/pages/select/gate-select';
import { GateScanner } from './features/gate/pages/scanner/gate-scanner';

export const routes: Routes = [
  { path: 'onboarding', component: Onboarding, canActivate: [customerGuard] },
  { path: 'bookings/:id/ticket', component: TicketView, canActivate: [customerGuard] },
  {
    path: '',
    component: PublicShell,
    children: [
      { path: '', component: Home },
      { path: 'login', component: Login },
      { path: 'register', component: Register },
      { path: 'forgot-password', component: ForgotPassword },
      { path: 'reset-password', component: ResetPassword },
      { path: 'events/:id', component: EventDetailPage },
    ],
  },
  {
    path: '',
    component: DashboardShell,
    data: { variant: 'customer' },
    canActivate: [customerGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'my-bookings', component: MyBookings },
    ],
  },
  {
    path: 'organizer',
    component: DashboardShell,
    data: { variant: 'organizer' },
    canActivate: [organizerGuard],
    children: [
      { path: '', component: OrganizerDashboard },
      { path: 'events/new', component: OrganizerEventForm },
      { path: 'events/:id', component: OrganizerEventManage },
      { path: 'fraud', component: OrganizerFraud },
      { path: 'verify', component: OrganizerVerifyTicket },
    ],
  },
  {
    path: 'admin',
    component: DashboardShell,
    data: { variant: 'admin' },
    canActivate: [adminGuard],
    children: [
      { path: '', component: AdminDashboard },
      { path: 'users', component: AdminUsers },
      { path: 'events', component: AdminEvents },
      { path: 'bookings', component: AdminBookings },
      { path: 'fraud', component: AdminFraud },
      { path: 'gates', component: AdminGates },
    ],
  },
  {
    path: 'gate',
    component: GateShell,
    canActivate: [gateUserGuard],
    children: [
      { path: '', component: GateSelect },
      { path: 'scan', component: GateScanner },
    ],
  },
  { path: '**', redirectTo: '' },
];
