import { TestBed } from '@angular/core/testing';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyState],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(EmptyState);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the title and description', () => {
    const fixture = TestBed.createComponent(EmptyState);
    fixture.componentInstance.title = 'No events found';
    fixture.componentInstance.description = 'Try a different search term.';
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('No events found');
    expect(text).toContain('Try a different search term.');
  });
});
