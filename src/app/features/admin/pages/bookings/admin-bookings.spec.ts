import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AdminBookings } from './admin-bookings';
import { API_BASE_URL } from '../../../../core/api-config';

describe('AdminBookings', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBookings],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create and load bookings on init', () => {
    const fixture = TestBed.createComponent(AdminBookings);
    fixture.detectChanges();

    httpMock.expectOne((r) => r.url === `${API_BASE_URL}/admin/bookings`).flush({ total: 0, page: 1, pageSize: 50, items: [] });

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.loading()).toBe(false);
  });
});
