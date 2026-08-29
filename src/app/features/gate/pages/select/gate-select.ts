import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { GateScanService } from '../../../../core/services/gate-scan.service';
import { GateSessionService } from '../../../../core/services/gate-session.service';
import { EventService } from '../../../../core/services/event.service';
import { Gate, EventSummary } from '../../../../core/models/models';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { SkeletonCards } from '../../../../shared/components/skeleton/skeleton';

type Step = 'gate' | 'event';
type DateFilterMode = 'default' | 'today' | 'tomorrow' | 'custom' | 'all';

// Local (not UTC) calendar-day key, e.g. "2026-09-16" - filtering is done in
// the browser's local timezone since that's the timezone the gate staff
// standing at the door actually experiences "today" in.
function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function addDays(d: Date, days: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
}

// Local midnight for a "yyyy-mm-dd" key, so a date-group heading formats the
// same calendar day the events inside it were grouped by (no UTC drift).
function dateFromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export interface EventGroup {
  date: Date;
  events: EventSummary[];
}

// Picks the active gate (skipped automatically when the staffer has exactly
// one gate) and the event to scan against, then hands off to /gate/scan.
// This is a picker, not a paginated browse UI, so it reuses EventService.list
// with a generous flat page size rather than building any paging controls.
@Component({
  selector: 'app-gate-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, MessageModule, SelectModule, InputTextModule, EmptyState, SkeletonCards],
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

  dateFilterMode = signal<DateFilterMode>('default');
  // yyyy-mm-dd string bound to a native <input type="date">.
  customDate = signal<string>('');

  readonly dateFilterOptions: { label: string; value: DateFilterMode }[] = [
    { label: 'Today + Next 2 Days', value: 'default' },
    { label: 'Today', value: 'today' },
    { label: 'Tomorrow', value: 'tomorrow' },
    { label: 'Select Date', value: 'custom' },
    { label: 'All Events', value: 'all' },
  ];

  // Recomputed on every read, so "today" always reflects the current date
  // rather than being frozen at component construction - the default window
  // rolls forward on its own as real time passes, with no hardcoded dates.
  filteredEvents = computed<EventSummary[]>(() => {
    const all = this.events();
    const mode = this.dateFilterMode();

    if (mode === 'all') return all;

    if (mode === 'custom') {
      const key = this.customDate();
      // No date picked yet - don't show an empty list before the user has
      // had a chance to pick one.
      if (!key) return all;
      return all.filter((e) => dateKey(new Date(e.datetimeUtc)) === key);
    }

    const today = new Date();
    if (mode === 'today') {
      const key = dateKey(today);
      return all.filter((e) => dateKey(new Date(e.datetimeUtc)) === key);
    }
    if (mode === 'tomorrow') {
      const key = dateKey(addDays(today, 1));
      return all.filter((e) => dateKey(new Date(e.datetimeUtc)) === key);
    }

    // Default: today plus the next 2 calendar days (a 3-day window),
    // computed from the live local date so month/year rollovers just work.
    const windowKeys = new Set([0, 1, 2].map((offset) => dateKey(addDays(today, offset))));
    return all.filter((e) => windowKeys.has(dateKey(new Date(e.datetimeUtc))));
  });

  // Events grouped by local calendar day, each day's events time-sorted, and
  // the days themselves in chronological order - feeds the date-grouped grid.
  groupedEvents = computed<EventGroup[]>(() => {
    const groups = new Map<string, EventSummary[]>();
    for (const e of this.filteredEvents()) {
      const key = dateKey(new Date(e.datetimeUtc));
      const existing = groups.get(key);
      if (existing) existing.push(e);
      else groups.set(key, [e]);
    }
    return [...groups.keys()].sort().map((key) => ({
      date: dateFromKey(key),
      events: groups.get(key)!.sort((a, b) => new Date(a.datetimeUtc).getTime() - new Date(b.datetimeUtc).getTime()),
    }));
  });

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
    // Date filtering (including "All Events") happens client-side over
    // whatever's loaded here, so this needs the full pool, not just a page -
    // still a flat fetch, no paging controls, per this picker's existing style.
    this.eventService.list({ pageSize: 200 }).subscribe({
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
