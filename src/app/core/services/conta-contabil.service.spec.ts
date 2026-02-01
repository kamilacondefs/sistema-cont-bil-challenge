import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContaContabilService } from './conta-contabil.service';
import { API_ENDPOINTS } from '../constants/api.constants';
import { environment } from '../../../environments/environment';

describe('ContaContabilService', () => {
  let service: ContaContabilService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContaContabilService]
    });
    service = TestBed.inject(ContaContabilService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('listar() should make GET request and return array', () => {
    const mockContas = [
      { id: '1', codigo: '1.1', descricao: 'Caixa', tipo: 'DEBITO', permiteLancamento: true },
      { id: '2', codigo: '2.1', descricao: 'Fornecedores', tipo: 'CREDITO', permiteLancamento: true }
    ];

    service.listar().subscribe(contas => {
      expect(contas.length).toBe(2);
      expect(contas).toEqual(mockContas);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}${API_ENDPOINTS.CONTAS}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockContas);
  });
});
