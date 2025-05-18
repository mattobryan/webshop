// src/app/layout/navbar.component.ts
import { Component, OnInit,Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    CommonModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span (click)="goHome()" style="cursor: pointer;">MyShop</span>
      <span class="spacer"></span>
      <a mat-button routerLink="/products">Products</a>
      <a mat-button *ngIf="!isLoggedIn()" routerLink="/login">Login</a>
      <a mat-button *ngIf="!isLoggedIn()" routerLink="/register">Register</a>
      
      <a mat-button *ngIf="isLoggedIn()" routerLink="/cart">
        <mat-icon [matBadge]="cartCount" matBadgeColor="accent" [matBadgeHidden]="cartCount === 0" aria-hidden="false">

          shopping_cart
        </mat-icon>
      </a>

      <a mat-button *ngIf="isLoggedIn()" routerLink="/orders">My Orders</a>
      <a mat-button *ngIf="isLoggedIn()" routerLink="/profile">Profile</a>
      <a mat-button *ngIf="isAdmin()" routerLink="/admin">Admin</a>
      <button mat-button *ngIf="isLoggedIn()" (click)="logout()">Logout</button>
    </mat-toolbar>
  `,
  styles: [`.spacer { flex: 1 1 auto; }`]
})
export class NavbarComponent implements OnInit {
  private isBrowser: boolean;
  cartCount = 0;

  constructor(private auth: AuthService, private cartService: CartService,@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  get currentUser() {
    if (!this.isBrowser) {
      // No sessionStorage on server, return null or fallback
      return null;
    }
    const userJson = sessionStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }
  ngOnInit() {
  this.cartService.cartCount$.subscribe(count => {
    this.cartCount = count;
  });

  if (this.isLoggedIn()) {
    this.cartService.refreshCartCount();
  }
}

  isLoggedIn() {
    return typeof window !== 'undefined' && !!sessionStorage.getItem('accessToken');
  }

  isAdmin() {
    const user = this.auth.currentUser;
    return user?.role === 'admin';
  }

  logout() {
    this.auth.logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  goHome() {
    if (typeof window !== 'undefined') {
      window.location.href = '/products';
    }
  }
}
