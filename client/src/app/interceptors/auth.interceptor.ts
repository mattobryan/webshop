// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, switchMap, catchError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private auth: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isAuthRequest =
      request.url.includes('/auth/login') ||
      request.url.includes('/auth/register') ||
      request.url.includes('/auth/refresh');

    // Skip adding token for auth endpoints
    if (!isAuthRequest) {
      const token = this.auth.accessToken;
      if (token) {
        request = request.clone({
          headers: request.headers.set('Authorization', `Bearer ${token}`)
        });
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !isAuthRequest) {
          // Attempt token refresh
          return this.auth.refreshToken().pipe(
            switchMap(res => {
              if (res && res.accessToken) {
                // Save new token(s)
                sessionStorage.setItem('accessToken', res.accessToken);
                if (res.refreshToken) {
                  sessionStorage.setItem('refreshToken', res.refreshToken);
                }

                // Retry original request with new token
                const retryRequest = request.clone({
                  headers: request.headers.set('Authorization', `Bearer ${res.accessToken}`)
                });

                return next.handle(retryRequest);
              } else {
                this.forceLogout();
                return throwError(() => new Error('Token refresh failed'));
              }
            }),
            catchError(refreshError => {
              this.forceLogout();
              return throwError(() => refreshError);
            })
          );
        }

        // Propagate other errors
        return throwError(() => error);
      })
    );
  }

  private forceLogout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
