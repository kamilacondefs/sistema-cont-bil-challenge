import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './error.interceptor';
import { ToastService } from '../../shared/services/toast.service';
import { vi } from 'vitest';

describe('ErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let toastServiceSpy: { error: any };

  beforeEach(() => {
    const spy = { error: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: ToastService, useValue: spy }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    toastServiceSpy = TestBed.inject(ToastService) as unknown as { error: any };
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should handle 401 error', () => {
    httpClient.get('/api/data').subscribe({
      next: () => expect.fail('should have failed with 401'),
      error: (error) => {
        expect(error.status).toBe(401);
      }
    });

    const req = httpMock.expectOne('/api/data');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(toastServiceSpy.error).toHaveBeenCalledWith('Sessão expirada ou credenciais inválidas. Por favor, faça login novamente.');
  });

  it('should handle 400 error and show toast', () => {
    const errorMessage = 'Dados inválidos';
    
    httpClient.get('/api/data').subscribe({
      next: () => expect.fail('should have failed with 400'),
      error: (error) => {
        expect(error.status).toBe(400);
      }
    });

    const req = httpMock.expectOne('/api/data');
    req.flush({ message: errorMessage }, { status: 400, statusText: 'Bad Request' });

    expect(toastServiceSpy.error).toHaveBeenCalledWith(errorMessage);
  });

  it('should handle 500 error and show toast', () => {
    httpClient.get('/api/data').subscribe({
      next: () => expect.fail('should have failed with 500'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne('/api/data');
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(toastServiceSpy.error).toHaveBeenCalledWith('Erro interno do servidor. Tente novamente mais tarde.');
  });
});
