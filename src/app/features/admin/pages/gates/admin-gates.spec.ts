import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AdminGates } from './admin-gates';
import { API_BASE_URL } from '../../../../core/api-config';

describe('AdminGates', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGates],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  function flushInitialLoad(fixture: ReturnType<typeof TestBed.createComponent<AdminGates>>) {
    httpMock.expectOne((r) => r.url === `${API_BASE_URL}/admin/gates`).flush({
      total: 2,
      page: 1,
      pageSize: 100,
      items: [
        { gateId: 1, name: 'Gate A', description: 'Main entrance', status: 'Active', assignedGateUserCount: 2, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
        { gateId: 2, name: 'Gate B', description: null, status: 'Inactive', assignedGateUserCount: 0, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
      ],
    });
    httpMock.expectOne((r) => r.url === `${API_BASE_URL}/admin/gates/users`).flush({
      total: 1,
      page: 1,
      pageSize: 100,
      items: [{ userId: 10, fullName: 'Sam Staff', email: 'sam@example.com', gateIds: [1] }],
    });
    httpMock.expectOne((r) => r.url === `${API_BASE_URL}/admin/gates/scan-history`).flush({
      total: 0,
      page: 1,
      pageSize: 100,
      items: [],
    });
    fixture.detectChanges();
  }

  it('should create and load gates, gate users, and scan history on init', () => {
    const fixture = TestBed.createComponent(AdminGates);
    fixture.detectChanges();
    flushInitialLoad(fixture);

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.gates().length).toBe(2);
    expect(fixture.componentInstance.gateUsers().length).toBe(1);
    expect(fixture.componentInstance.historyEntries().length).toBe(0);
  });

  it('maps gate ids to gate names for the Gate Users tab', () => {
    const fixture = TestBed.createComponent(AdminGates);
    fixture.detectChanges();
    flushInitialLoad(fixture);

    const cmp = fixture.componentInstance;
    const user = cmp.gateUsers()[0];
    expect(cmp.gateNamesFor(user)).toBe('Gate A');
    expect(cmp.gateNamesFor({ userId: 99, fullName: 'x', email: 'x', gateIds: [] })).toBe('None');
  });

  it('only switches to a known tab value', () => {
    const fixture = TestBed.createComponent(AdminGates);
    fixture.detectChanges();
    flushInitialLoad(fixture);

    const cmp = fixture.componentInstance;
    cmp.selectTab('history');
    expect(cmp.activeTab()).toBe('history');
    cmp.selectTab(undefined);
    expect(cmp.activeTab()).toBe('history');
    cmp.selectTab('not-a-tab');
    expect(cmp.activeTab()).toBe('history');
  });
});
