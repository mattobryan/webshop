// src/app/guards/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(): boolean {
    const userJson = sessionStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    if (user && user.role === 'admin') {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
