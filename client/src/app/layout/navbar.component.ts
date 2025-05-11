// src/app/layout/navbar.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary">
      <span (click)="goHome()" style="cursor: pointer;">MyShop</span>
      <span class="spacer"></span>
      <a mat-button routerLink="/products">Products</a>
      <a mat-button *ngIf="!isLoggedIn()" routerLink="/login">Login</a>
      <a mat-button *ngIf="!isLoggedIn()" routerLink="/register">Register</a>
      <a mat-button *ngIf="isLoggedIn()" routerLink="/cart">Cart</a>
      <a mat-button *ngIf="isLoggedIn()" routerLink="/orders">My Orders</a>
      <a mat-button *ngIf="isAdmin()" routerLink="/admin">Admin</a>
      <button mat-button *ngIf="isLoggedIn()" (click)="logout()">Logout</button>
    </mat-toolbar>
  `,
  styles: [`.spacer { flex: 1 1 auto; }`]
})
export class NavbarComponent {
  constructor(private auth: AuthService) {}
  isLoggedIn() { return !!sessionStorage.getItem('accessToken'); }
  isAdmin() {
    const user = this.auth.currentUser;
    return user?.role === 'admin';
  }
  logout() {
    this.auth.logout();
    window.location.href = '/';
  }
  goHome() {
    window.location.href = '/products';
  }
}
