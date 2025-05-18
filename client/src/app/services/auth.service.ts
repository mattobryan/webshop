import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';

const AUTH_API = `${environment.apiBaseUrl}/auth`;
const SESSION_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user'
};

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isBrowser: boolean;
  private get authHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.accessToken || ''}`
    });
  }

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  
  
  login(credentials: { login: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${AUTH_API}/login`, credentials).pipe(
      tap(res => {
        if (this.isBrowser) {
          sessionStorage.setItem(SESSION_KEYS.ACCESS_TOKEN, res.accessToken);
          sessionStorage.setItem(SESSION_KEYS.REFRESH_TOKEN, res.refreshToken);
          sessionStorage.setItem(SESSION_KEYS.USER, JSON.stringify(res.user));
        }
      })
    );
  }

  register(data: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${AUTH_API}/register`, data);
  }

  refreshToken(): Observable<{ accessToken: string; refreshToken?: string }> {
    const refreshToken = this.isBrowser ? sessionStorage.getItem(SESSION_KEYS.REFRESH_TOKEN) : null;
    return this.http.post<{ accessToken: string; refreshToken?: string }>(
      `${AUTH_API}/refresh`,
      { token: refreshToken }
    );
  }

  logout(): void {
    if (this.isBrowser) {
      const token = this.refreshTokenValue;
      if (token) {
        this.http.post(`${AUTH_API}/logout`, { token }).subscribe();
      }
      sessionStorage.clear();
    }
  }

  get accessToken(): string | null {
    return this.isBrowser ? sessionStorage.getItem(SESSION_KEYS.ACCESS_TOKEN) : null;
  }

  get refreshTokenValue(): string | null {
    return this.isBrowser ? sessionStorage.getItem(SESSION_KEYS.REFRESH_TOKEN) : null;
  }

  get currentUser(): User | null {
    if (!this.isBrowser) {
      return null;
    }
    const userJson = sessionStorage.getItem(SESSION_KEYS.USER);
    try {
      return userJson && userJson !== 'undefined' ? JSON.parse(userJson) : null;
    } catch {
      sessionStorage.removeItem(SESSION_KEYS.USER);
      return null;
    }
  }

  get isLoggedIn(): boolean {
    return !!this.accessToken && !!this.currentUser;
  }
  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiBaseUrl}/users/me`, {
      headers: this.authHeaders
    }).pipe(
      tap(user => {
        if (this.isBrowser) {
          sessionStorage.setItem(SESSION_KEYS.USER, JSON.stringify(user));
        }
      })
    );
  }

  updateUserProfile(data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${environment.apiBaseUrl}/users/me`, data, {
      headers: this.authHeaders
    }).pipe(
      tap(user => {
        if (this.isBrowser) {
          sessionStorage.setItem(SESSION_KEYS.USER, JSON.stringify(user));
        }
      })
    );
  }
}
