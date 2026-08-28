import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TicketVerificationService } from '../../../../core/services/ticket-verification.service';
import { VerifyTicketResult } from '../../../../core/models/models';

@Component({
  selector: 'app-organizer-verify-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
  templateUrl: './organizer-verify-ticket.html',
  styleUrl: './organizer-verify-ticket.scss',
})
export class OrganizerVerifyTicket {
  code = '';
  checking = signal(false);
  result = signal<VerifyTicketResult | null>(null);
  error = signal<string | null>(null);

  constructor(private ticketVerification: TicketVerificationService) {}

  verify(): void {
    const code = this.code.trim();
    if (!code || this.checking()) return;

    this.checking.set(true);
    this.error.set(null);
    this.result.set(null);
    this.ticketVerification.verify(code).subscribe({
      next: (res) => {
        this.checking.set(false);
        this.result.set(res);
      },
      error: () => {
        this.checking.set(false);
        this.error.set('Could not verify this ticket right now. Please try again.');
      },
    });
  }

  reset(): void {
    this.code = '';
    this.result.set(null);
    this.error.set(null);
  }

  // Green = valid entry just granted, amber = a real, genuine booking that
  // just isn't a fresh valid entry (already used or cancelled), red = nothing
  // found, or a QR whose signature failed - the backend deliberately omits
  // attendee details in that case, which is how this tells the two apart.
  resultClass(r: VerifyTicketResult): string {
    if (!r.found || r.attendeeName === null) return 'result-invalid';
    if (r.alreadyCheckedIn || r.status === 'Cancelled') return 'result-warn';
    return 'result-valid';
  }
}
