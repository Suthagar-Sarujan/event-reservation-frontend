import { TestBed } from '@angular/core/testing';
import { GateSessionService } from './gate-session.service';

describe('GateSessionService', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('starts empty and incomplete when nothing is persisted', () => {
    const service = TestBed.inject(GateSessionService);
    expect(service.gateId()).toBeNull();
    expect(service.eventId()).toBeNull();
    expect(service.isComplete()).toBe(false);
  });

  it('becomes complete only once both a gate and an event are set', () => {
    const service = TestBed.inject(GateSessionService);
    service.setGate(1, 'Gate A');
    expect(service.gateId()).toBe(1);
    expect(service.gateName()).toBe('Gate A');
    expect(service.isComplete()).toBe(false);

    service.setEvent(7, 'Jazz Night');
    expect(service.eventId()).toBe(7);
    expect(service.eventName()).toBe('Jazz Night');
    expect(service.isComplete()).toBe(true);
  });

  it('clears the chosen event when a different gate is selected', () => {
    const service = TestBed.inject(GateSessionService);
    service.setGate(1, 'Gate A');
    service.setEvent(7, 'Jazz Night');

    service.setGate(2, 'Gate B');
    expect(service.gateId()).toBe(2);
    expect(service.eventId()).toBeNull();
    expect(service.isComplete()).toBe(false);
  });

  it('persists across service instances via sessionStorage', () => {
    const first = TestBed.inject(GateSessionService);
    first.setGate(3, 'Gate C');
    first.setEvent(9, 'Rock Show');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const second = TestBed.inject(GateSessionService);

    expect(second.gateId()).toBe(3);
    expect(second.eventName()).toBe('Rock Show');
    expect(second.isComplete()).toBe(true);
  });

  it('clear() resets everything', () => {
    const service = TestBed.inject(GateSessionService);
    service.setGate(1, 'Gate A');
    service.setEvent(7, 'Jazz Night');

    service.clear();

    expect(service.gateId()).toBeNull();
    expect(service.gateName()).toBeNull();
    expect(service.eventId()).toBeNull();
    expect(service.eventName()).toBeNull();
    expect(service.isComplete()).toBe(false);
  });
});
