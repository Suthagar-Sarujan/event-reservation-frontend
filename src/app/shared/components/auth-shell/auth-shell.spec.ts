import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthShell } from './auth-shell';

describe('AuthShell', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthShell],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AuthShell);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
