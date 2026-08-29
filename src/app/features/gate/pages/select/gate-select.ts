import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { GateScanService } from '../../../../core/services/gate-scan.service';
import { GateSessionService } from '../../../../core/services/gate-session.service';
import { EventService } from '../../../../core/services/event.service';
import { Gate, EventSummary } from '../../../../core/models/models';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { SkeletonCards } from '../../../../shared/components/skeleton/skeleton';

type Step = 'gate' | 'event';

// Picks the active gate (skipped automatically when the staffer has exactly
// one gate) and the event to scan against, then hands off to /gate/scan.
// This is a picker, not a paginated browse UI, so it reuses EventService.list
// with a generous flat page size rather than building any paging controls.
@Component({
  selector: 'app-gate-select',
  standalone: true,
  imports: [CommonModule, ButtonModule, MessageModule, EmptyState, SkeletonCards],
  templateUrl: './gate-select.html',
  styleUrl: './gate-select.scss',
})
export class GateSelect implements OnInit {
  step = signal<Step>('gate');

  loadingGates = signal(true);
  gates = signal<Gate[]>([]);
  gatesError = signal<string | null>(null);

  loadingEvents = signal(false);
  events = signal<EventSummary[]>([]);
  eventsError = signal<string | null>(null);

  constructor(
    private gateScanService: GateScanService,
    protected gateSession: GateSessionService,
    private eventService: EventService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // A full session already persisted from a previous visit this shift -
    // skip straight to scanning.
    if (this.gateSession.isComplete()) {
      this.router.navigate(['/gate/scan']);
      return;
    }
    if (this.gateSession.gateId() !== null) {
      this.step.set('event');
      this.loadEvents();
      return;
    }
    this.loadGates();
  }

  loadGates(): void {
    this.loadingGates.set(true);
    this.gatesError.set(null);
    this.gateScanService.myGates().subscribe({
      next: (gates) => {
        this.loadingGates.set(false);
        this.gates.set(gates);
        // Exactly one gate assigned - no redundant confirmation tap, go
        // straight through to the event picker.
        if (gates.length === 1) {
          this.chooseGate(gates[0]);
        }
      },
      error: () => {
        this.loadingGates.set(false);
        this.gatesError.set('Could not load your assigned gates. Please try again.');
      },
    });
  }

  chooseGate(gate: Gate): void {
    this.gateSession.setGate(gate.gateId, gate.name);
    this.step.set('event');
    this.loadEvents();
  }

  loadEvents(): void {
    this.loadingEvents.set(true);
    this.eventsError.set(null);
    this.eventService.list({ pageSize: 50 }).subscribe({
      next: (res) => {
        this.loadingEvents.set(false);
        this.events.set(res.items);
      },
      error: () => {
        this.loadingEvents.set(false);
        this.eventsError.set('Could not load events. Please try again.');
      },
    });
  }

  chooseEvent(event: EventSummary): void {
    this.gateSession.setEvent(event.eventId, event.name);
    this.router.navigate(['/gate/scan']);
  }

  changeGate(): void {
    this.gateSession.clear();
    this.step.set('gate');
    this.loadGates();
  }
}
