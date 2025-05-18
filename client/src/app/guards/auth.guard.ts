import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  canActivate(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      if (sessionStorage.getItem('accessToken')) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      // If not browser (SSR), block navigation or allow — your choice
      // Usually false to prevent server navigation
      return false;
    }
  }
}
