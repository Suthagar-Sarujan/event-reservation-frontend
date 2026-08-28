import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PublicShell } from './public-shell';

describe('PublicShell', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [PublicShell],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PublicShell);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should toggle the mobile menu', () => {
    const fixture = TestBed.createComponent(PublicShell);
    const component = fixture.componentInstance;
    expect(component.mobileOpen()).toBe(false);
    component.toggleMobile();
    expect(component.mobileOpen()).toBe(true);
    component.closeMobile();
    expect(component.mobileOpen()).toBe(false);
  });
});
