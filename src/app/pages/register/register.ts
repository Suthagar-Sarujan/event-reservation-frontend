import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AuthShell } from '../../shared/auth-shell/auth-shell';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AuthShell, Icon],
  templateUrl: './register.html',
  styleUrl: '../auth-form.css',
})
export class Register {
  fullName = '';
  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  submit(): void {
    this.error.set(null);
    this.loading.set(true);
    this.auth.register(this.fullName, this.email, this.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
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
