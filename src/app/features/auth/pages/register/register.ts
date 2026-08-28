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
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { AuthShell } from '../../../../shared/components/auth-shell/auth-shell';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.html',
  styleUrl: '../../auth-form.scss',
})
export class Register {
  fullName = '';
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
    this.auth.register(this.fullName, this.email, this.password).subscribe({
      next: () => {
        this.loading.set(false);
        // Brand-new account has no saved preference yet - carry over whatever
        // theme they'd already picked as an anonymous visitor instead of
        // resetting them to the server's just-created default.
        this.theme.setPreference(this.theme.preference());
        // Every new customer account has no interest profile yet - the
        // onboarding questionnaire seeds their initial recommendation profile
        // before they see their dashboard.
        this.router.navigate(['/onboarding']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err.status === 409 ? 'An account with this email already exists.' : 'Something went wrong. Please try again.',
        );
      },
    });
  }
}
