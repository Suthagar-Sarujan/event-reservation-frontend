import { Component, Input } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [Icon],
  template: `
    <div class="empty-state">
      <span class="empty-icon"><app-icon [name]="icon" /></span>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
      <ng-content></ng-content>
    </div>
  `,
})
export class EmptyState {
  @Input() icon = 'info';
  @Input() title = 'Nothing here yet';
  @Input() description = '';
}
