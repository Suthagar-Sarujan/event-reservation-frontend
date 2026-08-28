import { TestBed } from '@angular/core/testing';
import { ConfirmDialog } from './confirm-dialog';

describe('ConfirmDialog', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialog],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ConfirmDialog);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should not render the modal when closed', () => {
    const fixture = TestBed.createComponent(ConfirmDialog);
    fixture.componentInstance.open = false;
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('.modal-backdrop')).toBeNull();
  });

  it('should render the modal and emit confirmed on click when open', () => {
    const fixture = TestBed.createComponent(ConfirmDialog);
    fixture.componentInstance.open = true;
    fixture.componentInstance.title = 'Cancel this event?';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Cancel this event?');

    let confirmed = false;
    fixture.componentInstance.confirmed.subscribe(() => (confirmed = true));
    const confirmButton = compiled.querySelectorAll('.modal-actions button')[1] as HTMLButtonElement;
    confirmButton.click();
    expect(confirmed).toBe(true);
  });
});
