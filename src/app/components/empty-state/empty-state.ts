import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
})
export class EmptyState {
  /** PrimeIcons suffix, e.g. "calendar" for pi-calendar. */
  @Input() icon = 'info-circle';
  @Input() title = 'Nothing here yet';
  @Input() description = '';
}
