import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-grid">
      @for (i of Array(count); track $index) {
        <div class="skeleton skeleton-card"></div>
      }
    </div>
  `,
})
export class SkeletonCards {
  @Input() count = 4;
  protected readonly Array = Array;
}

@Component({
  selector: 'app-skeleton-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-responsive skeleton-table">
      @for (i of Array(rows); track $index) {
        <div class="skeleton skeleton-line" [style.width.%]="90 - $index * 4"></div>
      }
    </div>
  `,
  styles: [
    `
      .skeleton-table {
        padding: 1.2rem;
        box-shadow: none;
      }
      .skeleton-line {
        height: 1.1rem;
        margin-bottom: 0.9rem;
      }
    `,
  ],
})
export class SkeletonTable {
  @Input() rows = 5;
  protected readonly Array = Array;
}
