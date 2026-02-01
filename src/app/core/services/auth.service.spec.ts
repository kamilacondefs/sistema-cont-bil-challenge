import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { API_ENDPOINTS } from '../constants/api.constants';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/auth.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login with correct credentials', () => {

    const credentials: LoginRequest = { email: 'admin@contabil.com', password: '123456' };
    const mockResponse: LoginResponse = {
      accessToken: 'fake-jwt-token',
      user: { id: '1', nome: 'User', email: 'admin@contabil.com', perfil: 'USER' }
    };

    service.login(credentials).subscribe(response => {
      expect(response.accessToken).toBe('fake-jwt-token');
      expect(response.user.email).toBe('admin@contabil.com');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}${API_ENDPOINTS.AUTH_LOGIN}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(mockResponse);
  });

  it('should return token after successful login', () => {
    // New login
    const credentials: LoginRequest = { email: 'admin@contabil.com', password: '123456' };
    const mockResponse: LoginResponse = {
      accessToken: 'new-token',
      user: { id: '1', nome: 'User', email: 'admin@contabil.com', perfil: 'USER' }
    };

    service.login(credentials).subscribe(() => {
      expect(service.getToken()).toBe('new-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}${API_ENDPOINTS.AUTH_LOGIN}`);
    req.flush(mockResponse);
  });

  it('should return true for isAuthenticated after successful login', () => {
    // New login
    const credentials: LoginRequest = { email: 'admin@contabil.com', password: '123456' };
    const mockResponse: LoginResponse = {
      accessToken: 'new-token',
      user: { id: '1', nome: 'User', email: 'admin@contabil.com', perfil: 'USER' }
    };

    service.login(credentials).subscribe();
    
    const req = httpMock.expectOne(`${environment.apiUrl}${API_ENDPOINTS.AUTH_LOGIN}`);
    req.flush(mockResponse);

    expect(service.isAuthenticated()).toBe(true);
  });
});
