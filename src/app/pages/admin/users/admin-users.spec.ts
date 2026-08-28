import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AdminUsers } from './admin-users';
import { API_BASE_URL } from '../../../api-config';

describe('AdminUsers', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [AdminUsers],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create and load users on init', () => {
    const fixture = TestBed.createComponent(AdminUsers);
    fixture.detectChanges();

    httpMock.expectOne((r) => r.url === `${API_BASE_URL}/admin/users`).flush({ total: 0, page: 1, pageSize: 25, items: [] });

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('should not call updateUserRole when the role is unchanged', () => {
    const fixture = TestBed.createComponent(AdminUsers);
    fixture.detectChanges();
    httpMock.expectOne((r) => r.url === `${API_BASE_URL}/admin/users`).flush({ total: 0, page: 1, pageSize: 25, items: [] });

    fixture.componentInstance.changeRole({ userId: 1, fullName: 'A', email: 'a@example.com', role: 'customer', createdAt: '2026-01-01T00:00:00Z' }, 'customer');
    httpMock.expectNone((r) => r.url === `${API_BASE_URL}/admin/users/1/role`);
  });
});
