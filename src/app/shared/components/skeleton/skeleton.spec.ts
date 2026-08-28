import { TestBed } from '@angular/core/testing';
import { SkeletonCards, SkeletonTable } from './skeleton';

describe('SkeletonCards', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonCards],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SkeletonCards);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render `count` placeholder cards', () => {
    const fixture = TestBed.createComponent(SkeletonCards);
    fixture.componentInstance.count = 3;
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('.skeleton-card').length).toBe(3);
  });
});

describe('SkeletonTable', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonTable],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SkeletonTable);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render `rows` placeholder lines', () => {
    const fixture = TestBed.createComponent(SkeletonTable);
    fixture.componentInstance.rows = 4;
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('.skeleton-line').length).toBe(4);
  });
});
