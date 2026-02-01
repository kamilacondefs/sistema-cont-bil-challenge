import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api.constants';
import { LancamentoFiltros } from '../models/lancamento-filtros.model';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {
  private apiUrl = `${environment.apiUrl}${API_ENDPOINTS.LANCAMENTOS}`;

  constructor(private http: HttpClient) {}

  listar(filtros: LancamentoFiltros): Observable<any> {
    let params = new HttpParams()
      .set('_page', filtros.page.toString())
      .set('_limit', filtros.limit.toString())
      .set('_sort', filtros.sort)
      .set('_order', filtros.order);

    if (filtros.search) {
      params = params.set('q', filtros.search);
    }
    if (filtros.tipo && filtros.tipo !== 'TODOS') {
      params = params.set('tipo', filtros.tipo);
    }
    if (filtros.status && filtros.status !== 'TODOS') {
      params = params.set('status', filtros.status);
    }
    if (filtros.dataInicio) {
      params = params.set('startDate', filtros.dataInicio);
    }
    if (filtros.dataFim) {
      params = params.set('endDate', filtros.dataFim);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  obter(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  criar(lancamento: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, lancamento);
  }

  atualizar(id: string, lancamento: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, lancamento);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}