import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class BalanceteService {
  private apiUrl = `${environment.apiUrl}${API_ENDPOINTS.LANCAMENTOS_BALANCETE}`;

  constructor(private http: HttpClient) {}

  obter(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}