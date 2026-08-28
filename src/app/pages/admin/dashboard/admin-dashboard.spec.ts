import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AdminDashboard } from './admin-dashboard';
import { API_BASE_URL } from '../../../api-config';

describe('AdminDashboard', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboard],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create and load stats on init', () => {
    const fixture = TestBed.createComponent(AdminDashboard);
    fixture.detectChanges();

    httpMock.expectOne(`${API_BASE_URL}/admin/stats`).flush({
      totalUsers: 5,
      totalCustomers: 2,
      totalOrganizers: 2,
      totalAdmins: 1,
      totalEvents: 1377,
      totalImportedEvents: 1376,
      totalOrganizerEvents: 1,
      totalBookings: 2,
      totalRevenue: 60,
    });
    httpMock.expectOne((r) => r.url === `${API_BASE_URL}/admin/stats/trend`).flush([]);

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.stats()?.totalUsers).toBe(5);
  });
});
