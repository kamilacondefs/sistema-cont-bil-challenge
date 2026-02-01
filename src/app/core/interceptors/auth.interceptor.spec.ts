import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { API_ENDPOINTS } from '../constants/api.constants';
import { environment } from '../../../environments/environment';
import { vi } from 'vitest';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authServiceSpy: { getToken: any };

  beforeEach(() => {
    const spy = { getToken: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: spy }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authServiceSpy = TestBed.inject(AuthService) as unknown as { getToken: any };
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header for non-login requests', () => {
    authServiceSpy.getToken.mockReturnValue('test-token');

    httpClient.get('/api/data').subscribe();

    const req = httpMock.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
  });

  it('should NOT add Authorization header for login request', () => {
    authServiceSpy.getToken.mockReturnValue('test-token');

    const loginUrl = `${environment.apiUrl}${API_ENDPOINTS.AUTH_LOGIN}`;
    
    httpClient.post(loginUrl, {}).subscribe();

    const req = httpMock.expectOne(loginUrl);
    expect(req.request.headers.has('Authorization')).toBe(false);
  });

  it('should NOT add Authorization header if no token available', () => {
    authServiceSpy.getToken.mockReturnValue(null);

    httpClient.get('/api/data').subscribe();

    const req = httpMock.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toBe(false);
  });
});
