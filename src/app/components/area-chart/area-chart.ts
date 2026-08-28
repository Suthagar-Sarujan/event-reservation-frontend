import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AreaChartPoint {
  label: string;
  value: number;
}

const VIEW_WIDTH = 600;
const VIEW_HEIGHT = 200;
const PAD_TOP = 16;
const PAD_BOTTOM = 16;
const PAD_X = 8;
const PLOT_WIDTH = VIEW_WIDTH - PAD_X * 2;
const PLOT_HEIGHT = VIEW_HEIGHT - PAD_TOP - PAD_BOTTOM;
const MAX_AXIS_LABELS = 6;

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-area-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './area-chart.html',
  styleUrl: './area-chart.scss',
})
export class AreaChart {
  @Input({ required: true }) title!: string;
  @Input() data: AreaChartPoint[] = [];
  @Input() valuePrefix = '';

  readonly viewBox = `0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`;
  readonly gridLines = [PAD_TOP, PAD_TOP + PLOT_HEIGHT / 2, PAD_TOP + PLOT_HEIGHT];
  readonly gridX1 = PAD_X;
  readonly gridX2 = VIEW_WIDTH - PAD_X;

  hoverIndex = signal<number | null>(null);

  private get maxValue(): number {
    return Math.max(...this.data.map((d) => d.value), 1);
  }

  private points(): Point[] {
    const n = this.data.length;
    if (n === 0) return [];
    return this.data.map((d, i) => ({
      x: PAD_X + (n === 1 ? PLOT_WIDTH / 2 : (i / (n - 1)) * PLOT_WIDTH),
      y: PAD_TOP + PLOT_HEIGHT - (d.value / this.maxValue) * PLOT_HEIGHT,
    }));
  }

  linePath(): string {
    return this.points()
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ');
  }

  areaPath(): string {
    const pts = this.points();
    if (pts.length === 0) return '';
    const baseline = PAD_TOP + PLOT_HEIGHT;
    const first = pts[0];
    const last = pts[pts.length - 1];
    return `${this.linePath()} L ${last.x.toFixed(1)} ${baseline} L ${first.x.toFixed(1)} ${baseline} Z`;
  }

  lastPoint(): Point | null {
    const pts = this.points();
    return pts.length ? pts[pts.length - 1] : null;
  }

  // Sparse, evenly-spaced x-axis labels (never one per point - crowds instantly
  // past a handful of days) rendered as flex children rather than positioned
  // to the exact data x, matching this component's compact-card scale.
  axisLabels(): string[] {
    const n = this.data.length;
    if (n <= MAX_AXIS_LABELS) return this.data.map((d) => d.label);
    const step = Math.ceil(n / MAX_AXIS_LABELS);
    const labels = this.data.filter((_, i) => i % step === 0).map((d) => d.label);
    const lastLabel = this.data[n - 1].label;
    if (labels[labels.length - 1] !== lastLabel) labels.push(lastLabel);
    return labels;
  }

  // Angular's template type-checker resolves an <svg> template ref as
  // HTMLElement, not SVGSVGElement, even though it's really the latter at
  // runtime - getBoundingClientRect() exists on both, so this is harmless.
  onMove(evt: MouseEvent, svg: HTMLElement): void {
    const pts = this.points();
    if (pts.length === 0) return;
    const rect = svg.getBoundingClientRect();
    const localX = ((evt.clientX - rect.left) / rect.width) * VIEW_WIDTH;
    let nearest = 0;
    let minDist = Infinity;
    pts.forEach((p, i) => {
      const dist = Math.abs(p.x - localX);
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    });
    this.hoverIndex.set(nearest);
  }

  onLeave(): void {
    this.hoverIndex.set(null);
  }

  hoverPoint(): Point | null {
    const idx = this.hoverIndex();
    if (idx === null) return null;
    return this.points()[idx] ?? null;
  }

  hoverData(): AreaChartPoint | null {
    const idx = this.hoverIndex();
    return idx === null ? null : (this.data[idx] ?? null);
  }

  tooltipLeftPercent(): number {
    const p = this.hoverPoint();
    return p ? (p.x / VIEW_WIDTH) * 100 : 0;
  }

  formatValue(v: number): string {
    return this.valuePrefix + Math.round(v).toLocaleString();
  }
}
