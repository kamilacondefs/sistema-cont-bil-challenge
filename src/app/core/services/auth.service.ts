import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api.constants';
import { LoginRequest, LoginResponse, AuthUser } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private userSubject = new BehaviorSubject<AuthUser | null>(null);
  
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}${API_ENDPOINTS.AUTH_LOGIN}`, credentials)
      .pipe(
        tap(response => {
          this.token = response.accessToken; // Store in memory
          this.userSubject.next(response.user);
        })
      );
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  initialize(): Observable<any> {
    // Auto-login for mock purposes as requested
    const mockCredentials: LoginRequest = {
      email: 'admin@contabil.com',
      password: '123456' // Password doesn't matter for mock
    };
    
    return this.login(mockCredentials).pipe(
      tap(() => console.log('Auto-login successful')),
      catchError((err) => {
        console.error('Auto-login failed', err);
        return of(null);
      })
    );
  }
}
