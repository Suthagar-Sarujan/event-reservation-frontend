import { TestBed } from '@angular/core/testing';
import { AreaChart } from './area-chart';

describe('AreaChart', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaChart],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AreaChart);
    fixture.componentRef.setInput('title', 'Bookings over time');
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show an empty state when there is no data', () => {
    const fixture = TestBed.createComponent(AreaChart);
    fixture.componentRef.setInput('title', 'Bookings over time');
    fixture.componentInstance.data = [];
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No data yet.');
  });

  it('should build a line path with one segment per point', () => {
    const fixture = TestBed.createComponent(AreaChart);
    fixture.componentRef.setInput('title', 'Bookings over time');
    fixture.componentInstance.data = [
      { label: 'Mon', value: 2 },
      { label: 'Tue', value: 8 },
      { label: 'Wed', value: 4 },
    ];
    fixture.detectChanges();

    const path = fixture.componentInstance.linePath();
    expect(path.startsWith('M')).toBe(true);
    expect(path.match(/L/g)?.length).toBe(2);
  });

  it('should report the latest value as the header figure', () => {
    const fixture = TestBed.createComponent(AreaChart);
    fixture.componentRef.setInput('title', 'Revenue over time');
    fixture.componentRef.setInput('valuePrefix', '$');
    fixture.componentInstance.data = [
      { label: 'Mon', value: 100 },
      { label: 'Tue', value: 250 },
    ];
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).querySelector('.area-chart-latest')?.textContent?.trim();
    expect(text).toBe('$250');
  });

  it('should track the nearest point on hover and clear it on leave', () => {
    const fixture = TestBed.createComponent(AreaChart);
    fixture.componentRef.setInput('title', 'Bookings over time');
    fixture.componentInstance.data = [
      { label: 'Mon', value: 2 },
      { label: 'Tue', value: 8 },
    ];
    fixture.detectChanges();

    expect(fixture.componentInstance.hoverIndex()).toBeNull();
    fixture.componentInstance.hoverIndex.set(1);
    expect(fixture.componentInstance.hoverData()?.label).toBe('Tue');

    fixture.componentInstance.onLeave();
    expect(fixture.componentInstance.hoverIndex()).toBeNull();
  });

  it('should cap x-axis labels rather than showing one per point', () => {
    const fixture = TestBed.createComponent(AreaChart);
    fixture.componentRef.setInput('title', 'Bookings over time');
    fixture.componentInstance.data = Array.from({ length: 30 }, (_, i) => ({ label: `Day ${i + 1}`, value: i }));
    fixture.detectChanges();

    const labels = fixture.componentInstance.axisLabels();
    expect(labels.length).toBeLessThanOrEqual(7);
    expect(labels[labels.length - 1]).toBe('Day 30');
  });
});
