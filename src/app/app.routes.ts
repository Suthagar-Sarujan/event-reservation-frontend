import { Routes } from '@angular/router';
import { PublicShell } from './components/public-shell/public-shell';
import { DashboardShell } from './components/dashboard-shell/dashboard-shell';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { EventDetailPage } from './pages/event-detail/event-detail';
import { MyBookings } from './pages/my-bookings/my-bookings';
import { Dashboard } from './pages/dashboard/dashboard';
import { customerGuard, organizerGuard, adminGuard } from './guards/role.guard';
import { OrganizerDashboard } from './pages/organizer/dashboard/organizer-dashboard';
import { OrganizerEventForm } from './pages/organizer/event-form/organizer-event-form';
import { OrganizerEventManage } from './pages/organizer/event-manage/organizer-event-manage';
import { AdminDashboard } from './pages/admin/dashboard/admin-dashboard';
import { AdminUsers } from './pages/admin/users/admin-users';
import { AdminEvents } from './pages/admin/events/admin-events';
import { AdminBookings } from './pages/admin/bookings/admin-bookings';
import { AdminFraud } from './pages/admin/fraud/admin-fraud';
import { OrganizerFraud } from './pages/organizer/fraud/organizer-fraud';
import { Onboarding } from './pages/onboarding/onboarding';
import { TicketView } from './pages/ticket-view/ticket-view';
import { OrganizerVerifyTicket } from './pages/organizer/verify/organizer-verify-ticket';

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
    ],
  },
  { path: '**', redirectTo: '' },
];
