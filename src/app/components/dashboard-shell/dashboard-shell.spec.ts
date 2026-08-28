import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DashboardShell } from './dashboard-shell';

describe('DashboardShell', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [DashboardShell],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { snapshot: { data: { variant: 'organizer' } } } },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DashboardShell);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should use the organizer nav for the organizer variant', () => {
    const fixture = TestBed.createComponent(DashboardShell);
    expect(fixture.componentInstance.variant).toBe('organizer');
    expect(fixture.componentInstance.navItems.some((i) => i.label === 'Create Event')).toBe(true);
  });
});
