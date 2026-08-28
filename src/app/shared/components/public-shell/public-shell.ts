import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';
import { UserMenu } from '../user-menu/user-menu';
import { ThemeToggle } from '../theme-toggle/theme-toggle';
import { Login } from '../../../features/auth/pages/login/login';
import { Register } from '../../../features/auth/pages/register/register';

@Component({
  selector: 'app-public-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, UserMenu, ThemeToggle, ButtonModule],
  templateUrl: './public-shell.html',
  styleUrl: './public-shell.scss',
})
export class PublicShell {
  mobileOpen = signal(false);
  hideFooter = signal(false);

  constructor(protected auth: AuthService) {}

  toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }

  onRouteActivate(component: object): void {
    this.hideFooter.set(component instanceof Login || component instanceof Register);
  }
}
