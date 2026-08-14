import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [Icon],
  template: `
    @if (open) {
      <div class="modal-backdrop" (click)="cancelled.emit()">
        <div class="modal" (click)="$event.stopPropagation()">
          <span class="modal-icon" [class.danger]="danger"><app-icon [name]="danger ? 'alert-triangle' : 'info'" /></span>
          <h3>{{ title }}</h3>
          <p>{{ message }}</p>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="cancelled.emit()">{{ cancelLabel }}</button>
            <button [class]="danger ? 'btn btn-danger' : 'btn'" (click)="confirmed.emit()">{{ confirmLabel }}</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .modal-icon {
        width: 2.6rem;
        height: 2.6rem;
        border-radius: 50%;
        background: var(--primary-tint);
        color: var(--primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        margin-bottom: 0.9rem;
      }
      .modal-icon.danger {
        background: var(--danger-tint);
        color: var(--danger);
      }
    `,
  ],
})
export class ConfirmDialog {
  @Input() open = false;
  @Input() title = 'Are you sure?';
  @Input() message = '';
  @Input() confirmLabel = 'Confirm';
  @Input() cancelLabel = 'Cancel';
  @Input() danger = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
}
