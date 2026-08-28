import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

export interface PaymentSummary {
  eventName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Purely a UX step - card details never leave the browser and are never sent
// to the backend. The booking itself is created by the caller only after
// `paid` fires; the backend generates its own mock payment reference (see
// BookingRepository.GeneratePaymentReference) rather than trusting anything
// entered here. See proposal Limitations: no real payment gateway is
// integrated.
@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
  templateUrl: './payment-dialog.html',
  styleUrl: './payment-dialog.scss',
})
export class PaymentDialog {
  @Input() open = false;
  @Input() summary: PaymentSummary | null = null;
  @Input() processing = false;

  @Output() paid = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  cardName = '';
  cardNumber = '';
  expiry = '';
  cvv = '';
  touched = signal(false);

  get cardNumberValid(): boolean {
    const digits = this.cardNumber.replace(/\s/g, '');
    return /^\d{16}$/.test(digits);
  }

  get expiryValid(): boolean {
    if (!/^\d{2}\/\d{2}$/.test(this.expiry)) return false;
    const [month] = this.expiry.split('/').map(Number);
    return month >= 1 && month <= 12;
  }

  get cvvValid(): boolean {
    return /^\d{3,4}$/.test(this.cvv);
  }

  get formValid(): boolean {
    return this.cardName.trim().length > 1 && this.cardNumberValid && this.expiryValid && this.cvvValid;
  }

  formatCardNumber(): void {
    const digits = this.cardNumber.replace(/\D/g, '').slice(0, 16);
    this.cardNumber = digits.replace(/(.{4})/g, '$1 ').trim();
  }

  formatExpiry(): void {
    const digits = this.expiry.replace(/\D/g, '').slice(0, 4);
    this.expiry = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  }

  submit(): void {
    this.touched.set(true);
    if (!this.formValid || this.processing) return;
    this.paid.emit();
  }

  close(): void {
    if (this.processing) return;
    this.touched.set(false);
    this.cardName = '';
    this.cardNumber = '';
    this.expiry = '';
    this.cvv = '';
    this.cancelled.emit();
  }
}
