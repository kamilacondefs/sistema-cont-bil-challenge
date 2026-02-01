import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LancamentoService } from './lancamento.service';
import { API_ENDPOINTS } from '../constants/api.constants';
import { environment } from '../../../environments/environment';
import { LancamentoFiltros } from '../models/lancamento-filtros.model';
import { Lancamento, LancamentoCreateDTO } from '../models/lancamento.model';
import { LancamentoTipo } from '../enums/lancamento-tipo.enum';
import { LancamentoStatus } from '../enums/lancamento-status.enum';

describe('LancamentoService', () => {
  let service: LancamentoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LancamentoService]
    });
    service = TestBed.inject(LancamentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('listar() should make GET request with correct parameters', () => {
    const filtros: LancamentoFiltros = {
      page: 1,
      limit: 10,
      sort: 'data',
      order: 'asc',
      search: 'teste',
      tipo: LancamentoTipo.CREDITO,
      status: LancamentoStatus.CONFIRMADO,
      contaCodigo: '1.1',
      dataInicio: '2023-01-01',
      dataFim: '2023-01-31'
    };

    service.listar(filtros).subscribe();

    const req = httpMock.expectOne(req => 
      req.url === `${environment.apiUrl}${API_ENDPOINTS.LANCAMENTOS}` &&
      req.params.get('_page') === '1' &&
      req.params.get('_limit') === '10' &&
      req.params.get('_sort') === 'data' &&
      req.params.get('_order') === 'asc' &&
      req.params.get('q') === 'teste' &&
      req.params.get('tipo') === LancamentoTipo.CREDITO &&
      req.params.get('status') === LancamentoStatus.CONFIRMADO &&
      req.params.get('startDate') === '2023-01-01' &&
      req.params.get('endDate') === '2023-01-31'
    );
    expect(req.request.method).toBe('GET');
    req.flush({ data: [], pagination: {} });
  });

  it('listar() should not send undefined parameters', () => {
    const filtros: LancamentoFiltros = {
      page: 1,
      limit: 10,
      sort: 'data',
      order: 'desc',
      search: '',
      // others undefined
    };

    service.listar(filtros).subscribe();

    const req = httpMock.expectOne(req => 
      req.url === `${environment.apiUrl}${API_ENDPOINTS.LANCAMENTOS}` &&
      req.params.has('_page') &&
      !req.params.has('tipo') &&
      !req.params.has('status')
    );
    expect(req.request.method).toBe('GET');
    req.flush({ data: [], pagination: {} });
  });

  it('obter() should make GET request to correct URL', () => {
    const id = '123';
    service.obter(id).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}${API_ENDPOINTS.LANCAMENTOS}/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('criar() should make POST request with correct body', () => {
    const newLancamento: LancamentoCreateDTO = {
      data: '2023-01-01',
      tipo: LancamentoTipo.DEBITO,
      conta: { codigo: '1', descricao: 'Conta 1' },
      valor: 100,
      historico: 'Teste',
      status: LancamentoStatus.PROVISORIO
    };

    service.criar(newLancamento).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}${API_ENDPOINTS.LANCAMENTOS}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newLancamento);
    req.flush({});
  });

  it('atualizar() should make PUT request with correct body', () => {
    const id = '123';
    const updateLancamento: LancamentoCreateDTO = {
      data: '2023-01-01',
      tipo: LancamentoTipo.DEBITO,
      conta: { codigo: '1', descricao: 'Conta 1' },
      valor: 100,
      historico: 'Teste Update',
      status: LancamentoStatus.CONFIRMADO
    };

    service.atualizar(id, updateLancamento).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}${API_ENDPOINTS.LANCAMENTOS}/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateLancamento);
    req.flush({});
  });

  it('excluir() should make DELETE request', () => {
    const id = '123';
    service.excluir(id).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}${API_ENDPOINTS.LANCAMENTOS}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
