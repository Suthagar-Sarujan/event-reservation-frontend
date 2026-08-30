import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageModule } from 'primeng/message';
import { FluidModule } from 'primeng/fluid';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { AuthShell } from '../../../../shared/components/auth-shell/auth-shell';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    AuthShell,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    IconFieldModule,
    InputIconModule,
    MessageModule,
    FluidModule,
  ],
  templateUrl: './login.html',
  styleUrl: '../../auth-form.scss',
})
export class Login {
  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private auth: AuthService,
    private theme: ThemeService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
  ) {
    if (this.route.snapshot.queryParamMap.get('sessionExpired')) {
      this.error.set('Your session has expired. Please log in again.');
    }
  }

  submit(): void {
    this.error.set(null);
    this.loading.set(true);
    this.auth.login(this.email, this.password).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.messageService.add({ severity: 'success', summary: 'Login successful', detail: 'Welcome back!' });
        this.theme.adoptAccountPreference(response.theme);
        // Gate staff have their own mobile scanning experience at /gate,
        // which sits outside customerGuard's redirect chain (unlike
        // Organizer/Admin, who land on /dashboard and get bounced from
        // there), so it needs an explicit branch here.
        if (response.role === 'GateUser') {
          this.router.navigate(['/gate']);
          return;
        }
        // A customer who never completed the onboarding questionnaire (e.g.
        // skipped it, or registered before this existed) gets routed there
        // instead of straight to the dashboard.
        this.router.navigate([response.role === 'Customer' && !response.hasPreferences ? '/onboarding' : '/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        const detail = err.status === 401 ? 'Invalid email or password.' : 'Something went wrong. Please try again.';
        this.error.set(detail);
        this.messageService.add({ severity: 'error', summary: 'Login failed', detail });
      },
    });
  }
}
