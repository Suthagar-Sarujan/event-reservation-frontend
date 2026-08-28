import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ThemeService } from '../../../core/services/theme.service';

export interface AreaChartPoint {
  label: string;
  value: number;
}

// Signal inputs (not @Input) are required here: chartData/chartOptions are
// computed() so p-chart only reinit()s (destroy + recreate the canvas) when
// the data or the resolved theme colors actually change, not on every
// change-detection pass - computed() only tracks signal reads, and a plain
// @Input wouldn't be one.
@Component({
  selector: 'app-trend-chart',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './trend-chart.html',
  styleUrl: './trend-chart.scss',
})
export class TrendChart {
  title = input.required<string>();
  data = input<AreaChartPoint[]>([]);
  valuePrefix = input('');

  private theme = inject(ThemeService);

  latestValue = computed(() => {
    const points = this.data();
    if (points.length === 0) return null;
    return this.formatValue(points[points.length - 1].value);
  });

  private colors = computed(() => {
    // Canvas can't resolve CSS var(...) itself, so read the computed values
    // from the document - this re-runs whenever effectiveTheme() flips,
    // which is what makes the chart re-color on theme change at all.
    this.theme.effectiveTheme();
    const styles = getComputedStyle(document.documentElement);
    return {
      line: styles.getPropertyValue('--primary-text').trim() || '#0b2062',
      fillTop: hexToRgba(styles.getPropertyValue('--primary-text').trim(), 0.18),
      fillBottom: hexToRgba(styles.getPropertyValue('--primary-text').trim(), 0),
      grid: styles.getPropertyValue('--border').trim() || '#e8dccd',
      text: styles.getPropertyValue('--text-secondary').trim() || '#6b5b4b',
      surface: styles.getPropertyValue('--surface').trim() || '#ffffff',
    };
  });

  chartData = computed(() => {
    const points = this.data();
    const c = this.colors();
    return {
      labels: points.map((p) => p.label),
      datasets: [
        {
          data: points.map((p) => p.value),
          fill: true,
          tension: 0.35,
          borderColor: c.line,
          backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D; chartArea?: { top: number; bottom: number } } }) => {
            const { ctx, chartArea } = context.chart;
            if (!chartArea) return c.fillTop;
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, c.fillTop);
            gradient.addColorStop(1, c.fillBottom);
            return gradient;
          },
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: c.line,
          pointHoverBorderColor: c.surface,
          pointHoverBorderWidth: 2,
        },
      ],
    };
  });

  chartOptions = computed(() => {
    const c = this.colors();
    const prefix = this.valuePrefix();
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index' as const, intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: c.surface,
          titleColor: c.text,
          bodyColor: c.text,
          borderColor: c.grid,
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          callbacks: {
            label: (ctx: { parsed: { y: number } }) => prefix + Math.round(ctx.parsed.y).toLocaleString(),
          },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: c.text, maxRotation: 0 } },
        y: {
          grid: { color: c.grid },
          ticks: {
            color: c.text,
            callback: (value: number) => prefix + Number(value).toLocaleString(),
          },
        },
      },
    };
  });

  private formatValue(v: number): string {
    return this.valuePrefix() + Math.round(v).toLocaleString();
  }
}

function hexToRgba(color: string, alpha: number): string {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return color;
}
