import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageModule } from 'primeng/message';
import { FluidModule } from 'primeng/fluid';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { AuthShell } from '../../components/auth-shell/auth-shell';

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
  styleUrl: '../auth-form.scss',
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
  ) {}

  submit(): void {
    this.error.set(null);
    this.loading.set(true);
    this.auth.login(this.email, this.password).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.theme.adoptAccountPreference(response.theme);
        // A customer who never completed the onboarding questionnaire (e.g.
        // skipped it, or registered before this existed) gets routed there
        // instead of straight to the dashboard.
        this.router.navigate([response.role === 'Customer' && !response.hasPreferences ? '/onboarding' : '/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.status === 401 ? 'Invalid email or password.' : 'Something went wrong. Please try again.');
      },
    });
  }
}
