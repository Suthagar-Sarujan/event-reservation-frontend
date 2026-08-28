import { TestBed } from '@angular/core/testing';
import { BarChart } from './bar-chart';

describe('BarChart', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarChart],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(BarChart);
    fixture.componentRef.setInput('title', 'Test chart');
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show an empty state when there is no data', () => {
    const fixture = TestBed.createComponent(BarChart);
    fixture.componentRef.setInput('title', 'Test chart');
    fixture.componentInstance.data = [];
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No data yet.');
  });

  it('should size each bar proportionally to the largest value', () => {
    const fixture = TestBed.createComponent(BarChart);
    fixture.componentRef.setInput('title', 'Test chart');
    fixture.componentInstance.data = [
      { label: 'A', value: 10 },
      { label: 'B', value: 5 },
    ];
    fixture.detectChanges();

    expect(fixture.componentInstance.widthPercent(10)).toBe(100);
    expect(fixture.componentInstance.widthPercent(5)).toBe(50);

    const fills = (fixture.nativeElement as HTMLElement).querySelectorAll('.bar-fill');
    expect(fills.length).toBe(2);
  });

  it('should prefer a pre-formatted displayValue over the raw number', () => {
    const fixture = TestBed.createComponent(BarChart);
    fixture.componentRef.setInput('title', 'Test chart');
    fixture.componentInstance.data = [{ label: 'Revenue', value: 1234.5, displayValue: '$1,234.50' }];
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).querySelector('.bar-value')?.textContent?.trim();
    expect(text).toBe('$1,234.50');
  });
});
