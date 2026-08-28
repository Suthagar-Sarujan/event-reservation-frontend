import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ThemePreference, ThemeService } from '../../services/theme.service';

const LABELS: Record<ThemePreference, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

const ICONS: Record<ThemePreference, string> = {
  light: 'pi-sun',
  dark: 'pi-moon',
  system: 'pi-desktop',
};

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, ButtonModule, MenuModule],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss',
})
export class ThemeToggle {
  constructor(protected theme: ThemeService) {}

  currentIcon(): string {
    return 'pi ' + ICONS[this.theme.preference()];
  }

  items = computed<MenuItem[]>(() =>
    (Object.keys(LABELS) as ThemePreference[]).map((value) => ({
      label: LABELS[value],
      icon: 'pi ' + ICONS[value],
      styleClass: this.theme.preference() === value ? 'active-item' : undefined,
      command: () => this.theme.setPreference(value),
    })),
  );
}
