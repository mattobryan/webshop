// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

const AUTH_API = `${environment.apiBaseUrl}/auth`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string; }): Observable<any> {
    return this.http.post<any>(`${AUTH_API}/login`, credentials).pipe(
      tap(res => {
        // On success, store tokens and user info in sessionStorage
        sessionStorage.setItem('accessToken', res.accessToken);
        sessionStorage.setItem('refreshToken', res.refreshToken);
        sessionStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  register(userData: { username: string; email: string; password: string; }): Observable<any> {
    return this.http.post(`${AUTH_API}/register`, userData);
  }

  refreshToken(): Observable<any> {
    const refreshToken = sessionStorage.getItem('refreshToken');
    return this.http.post<any>(`${AUTH_API}/refresh`, { token: refreshToken });
  }

  logout(): void {
    sessionStorage.clear();
  }

  public get currentUser(): User | null {
    const userJson = sessionStorage.getItem('user');
    return userJson ? JSON.parse(userJson) as User : null;
  }
  
  public get accessToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }
}
