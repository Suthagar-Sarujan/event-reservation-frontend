import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageModule } from 'primeng/message';
import { FluidModule } from 'primeng/fluid';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthShell } from '../../../../shared/components/auth-shell/auth-shell';

// The backend always returns the same generic response regardless of whether
// the email matches an account (anti-enumeration) - this page mirrors that
// by showing the same "submitted" state on both success and failure, never
// telling the visitor which case it was.
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    AuthShell,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    MessageModule,
    FluidModule,
  ],
  templateUrl: './forgot-password.html',
  styleUrl: '../../auth-form.scss',
})
export class ForgotPassword {
  email = '';
  loading = signal(false);
  submitted = signal(false);
  error = signal<string | null>(null);

  constructor(private auth: AuthService) {}

  submit(): void {
    this.error.set(null);
    this.loading.set(true);
    this.auth.forgotPassword(this.email).subscribe({
      next: () => {
        this.loading.set(false);
        this.submitted.set(true);
      },
      error: () => {
        // A genuine network/server failure, not "email not found" - the
        // backend never reports that distinction, so this path only fires
        // when the request itself couldn't complete.
        this.loading.set(false);
        this.error.set('Something went wrong. Please try again.');
      },
    });
  }
}
