import { Injectable, computed, signal } from '@angular/core';

const STORAGE_KEY = 'event_reservation_gate_session';

interface GateSessionState {
  gateId: number | null;
  gateName: string | null;
  eventId: number | null;
  eventName: string | null;
}

const EMPTY_STATE: GateSessionState = { gateId: null, gateName: null, eventId: null, eventName: null };

// Not auth state - just UX convenience for the scanner flow (which gate/event
// the Gate User is currently scanning against), persisted to sessionStorage
// so a page refresh mid-shift doesn't lose the selection. Cleared on logout
// along with everything else, since sessionStorage clears itself when the
// tab closes anyway.
@Injectable({ providedIn: 'root' })
export class GateSessionService {
  private readonly state = signal<GateSessionState>(this.readFromStorage());

  readonly gateId = computed(() => this.state().gateId);
  readonly gateName = computed(() => this.state().gateName);
  readonly eventId = computed(() => this.state().eventId);
  readonly eventName = computed(() => this.state().eventName);

  // True once both a gate and an event have been chosen - the scanner screen
  // is usable.
  readonly isComplete = computed(() => this.state().gateId !== null && this.state().eventId !== null);

  private readFromStorage(): GateSessionState {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? { ...EMPTY_STATE, ...(JSON.parse(raw) as Partial<GateSessionState>) } : { ...EMPTY_STATE };
    } catch {
      return { ...EMPTY_STATE };
    }
  }

  private persist(state: GateSessionState): void {
    this.state.set(state);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // sessionStorage unavailable (private browsing, etc.) - in-memory
      // signal still works for the rest of this page load.
    }
  }

  setGate(gateId: number, gateName: string): void {
    this.persist({ ...this.state(), gateId, gateName, eventId: null, eventName: null });
  }

  setEvent(eventId: number, eventName: string): void {
    this.persist({ ...this.state(), eventId, eventName });
  }

  clear(): void {
    this.persist({ ...EMPTY_STATE });
  }
}
