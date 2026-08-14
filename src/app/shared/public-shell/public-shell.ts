import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Icon } from '../icon/icon';
import { UserMenu } from '../user-menu/user-menu';

@Component({
  selector: 'app-public-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon, UserMenu],
  templateUrl: './public-shell.html',
  styleUrl: './public-shell.css',
})
export class PublicShell {
  mobileOpen = signal(false);

  constructor(protected auth: AuthService) {}

  toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }
}
