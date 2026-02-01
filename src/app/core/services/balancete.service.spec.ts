import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BalanceteService } from './balancete.service';
import { API_ENDPOINTS } from '../constants/api.constants';
import { environment } from '../../../environments/environment';

describe('BalanceteService', () => {
  let service: BalanceteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BalanceteService]
    });
    service = TestBed.inject(BalanceteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('obter() should make GET request', () => {
    service.obter().subscribe();

    const req = httpMock.expectOne(req => 
      req.url === `${environment.apiUrl}${API_ENDPOINTS.LANCAMENTOS_BALANCETE}`
    );
    expect(req.request.method).toBe('GET');
    req.flush({});
  });


  it('obter() should make GET request without parameters when not provided', () => {
    service.obter().subscribe();

    const req = httpMock.expectOne(req => 
      req.url === `${environment.apiUrl}${API_ENDPOINTS.LANCAMENTOS_BALANCETE}`
    );
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});
