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
import { MessageService } from 'primeng/api';
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
    private messageService: MessageService,
  ) {}

  submit(): void {
    this.error.set(null);
    this.loading.set(true);
    this.auth.register(this.fullName, this.email, this.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Account created',
          detail: 'Your account has been created successfully.',
        });
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
        const detail = err.status === 409 ? 'An account with this email already exists.' : 'Something went wrong. Please try again.';
        this.error.set(detail);
        this.messageService.add({ severity: 'error', summary: 'Registration failed', detail });
      },
    });
  }
}
