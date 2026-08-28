import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-cards.html',
  styleUrl: './skeleton-cards.scss',
})
export class SkeletonCards {
  @Input() count = 4;
  protected readonly Array = Array;
}

@Component({
  selector: 'app-skeleton-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-table.html',
  styleUrl: './skeleton-table.scss',
})
export class SkeletonTable {
  @Input() rows = 5;
  protected readonly Array = Array;
}
