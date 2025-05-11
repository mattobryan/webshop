// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(): boolean {
    if (sessionStorage.getItem('accessToken')) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
