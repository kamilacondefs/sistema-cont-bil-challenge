import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api.constants';
import { ContaContabil } from '../models/conta-contabil.model';

@Injectable({
  providedIn: 'root'
})
export class ContaContabilService {
  private apiUrl = `${environment.apiUrl}${API_ENDPOINTS.CONTAS}`;

  constructor(private http: HttpClient) {}

  listar(): Observable<ContaContabil[]> {
    return this.http.get<ContaContabil[]>(this.apiUrl);
  }
}