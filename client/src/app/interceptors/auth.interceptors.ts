// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent,
  HttpErrorResponse, HttpHeaders
} from '@angular/common/http';
import { Observable, throwError, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = request;
    const token = this.auth.accessToken;
    if (token) {
      authReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });
    }
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !request.url.includes('/auth/login') && !request.url.includes('/auth/refresh')) {
          // Attempt token refresh
          return this.auth.refreshToken().pipe(
            switchMap((res) => {
              // Store new tokens
              sessionStorage.setItem('accessToken', res.accessToken);
              sessionStorage.setItem('refreshToken', res.refreshToken);
              // Retry the failed request with new token
              const retryReq = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${res.accessToken}`)
              });
              return next.handle(retryReq);
            }),
            catchError(err => {
              // If refresh fails, logout
              this.auth.logout();
              return throwError(() => err);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
