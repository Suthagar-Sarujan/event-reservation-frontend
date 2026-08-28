import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BarChartItem {
  label: string;
  value: number;
  /** Pre-formatted for display (e.g. "$1,234.50"); falls back to the raw value. */
  displayValue?: string;
  /** CSS color for this bar; falls back to var(--primary-text) for single-hue magnitude charts. */
  color?: string;
  /** Optional icon shown next to the label (used for status encodings). */
  icon?: string;
}

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.scss',
})
export class BarChart {
  @Input({ required: true }) title!: string;
  @Input() data: BarChartItem[] = [];

  get maxValue(): number {
    return Math.max(...this.data.map((d) => d.value), 1);
  }

  widthPercent(value: number): number {
    return (value / this.maxValue) * 100;
  }

  displayValue(item: BarChartItem): string {
    return item.displayValue ?? item.value.toLocaleString();
  }
}
