import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { FluidModule } from 'primeng/fluid';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthShell } from '../../../../shared/components/auth-shell/auth-shell';

type ScreenState = 'form' | 'success' | 'invalid';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AuthShell, ButtonModule, PasswordModule, MessageModule, FluidModule],
  templateUrl: './reset-password.html',
  styleUrl: '../../auth-form.scss',
})
export class ResetPassword implements OnInit {
  screenState = signal<ScreenState>('form');
  newPassword = '';
  confirmPassword = '';
  loading = signal(false);
  error = signal<string | null>(null);

  private token: string | null = null;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    // No token at all in the URL - never worth showing the form, since
    // there's nothing valid to submit against.
    if (!this.token) {
      this.screenState.set('invalid');
    }
  }

  get passwordsMismatch(): boolean {
    return this.confirmPassword.length > 0 && this.newPassword !== this.confirmPassword;
  }

  submit(): void {
    if (!this.token || this.newPassword.length < 8 || this.passwordsMismatch) {
      return;
    }
    this.error.set(null);
    this.loading.set(true);
    this.auth.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.loading.set(false);
        this.screenState.set('success');
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 400) {
          this.screenState.set('invalid');
        } else {
          this.error.set('Something went wrong. Please try again.');
        }
      },
    });
  }
}
