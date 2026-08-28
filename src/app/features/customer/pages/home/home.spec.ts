import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Home } from './home';
import { API_BASE_URL } from '../../../../core/api-config';

describe('Home', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create and load filters, recommendations, and events on init', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();

    httpMock.expectOne(`${API_BASE_URL}/events/filters`).flush({ types: ['mlb'], subCategories: ['baseball'] });
    httpMock.expectOne((r) => r.url === `${API_BASE_URL}/recommendations/for-you`).flush([]);
    httpMock.expectOne((r) => r.url === `${API_BASE_URL}/events`).flush({ total: 0, page: 1, pageSize: 12, items: [] });

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.recommendedLoading()).toBe(false);
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('reports active filters correctly', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    httpMock.expectOne(`${API_BASE_URL}/events/filters`).flush({ types: [], subCategories: [] });
    httpMock.expectOne((r) => r.url === `${API_BASE_URL}/recommendations/for-you`).flush([]);
    httpMock.expectOne((r) => r.url === `${API_BASE_URL}/events`).flush({ total: 0, page: 1, pageSize: 12, items: [] });

    expect(fixture.componentInstance.hasActiveFilters).toBe(false);
    fixture.componentInstance.search = 'jazz';
    expect(fixture.componentInstance.hasActiveFilters).toBe(true);
  });
});
