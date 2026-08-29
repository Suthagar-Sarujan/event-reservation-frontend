import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';
import { GateSessionService } from '../../../core/services/gate-session.service';

// Minimal mobile-first shell for the Gate User scanning experience. Deliberately
// does NOT reuse DashboardShell - no desktop sidebar, just a slim top bar and a
// full-bleed router-outlet, sized for a phone/tablet held vertically.
@Component({
  selector: 'app-gate-shell',
  standalone: true,
  imports: [RouterOutlet, ButtonModule],
  templateUrl: './gate-shell.html',
  styleUrl: './gate-shell.scss',
})
export class GateShell {
  constructor(
    protected auth: AuthService,
    protected gateSession: GateSessionService,
    private router: Router,
  ) {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
