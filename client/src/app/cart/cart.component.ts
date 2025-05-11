// src/app/cart/cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/cart-item.model';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatListModule, MatButtonModule, MatInputModule, FormsModule],
  template: `
    <div *ngIf="items.length; else emptyCart">
      <mat-list>
        <mat-list-item *ngFor="let item of items">
          <img matListAvatar [src]="item.product.imageUrl" alt="{{item.product.name}}">
          <h4 matLine>{{item.product.name}}</h4>
          <p matLine>\$ {{item.product.price}} x 
            <input type="number" [(ngModel)]="item.quantity" (change)="updateItem(item)" min="1" style="width:60px;">
            = \${{item.product.price * item.quantity}}
          </p>
          <button mat-button color="warn" (click)="removeItem(item)">Remove</button>
        </mat-list-item>
      </mat-list>
      <h3>Total: $\{\{getTotal()\}\}</h3>
      <button mat-raised-button color="primary" (click)="checkout()">Checkout</button>
    </div>
    <ng-template #emptyCart>
      <p>Your cart is empty.</p>
    </ng-template>
  `,
  styles: [`mat-list-item { align-items: center; } mat-list-item img { height: 60px; margin-right: 16px; }`]
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  constructor(private cartSvc: CartService, private router: Router) {}
  ngOnInit() {
    this.loadCart();
  }
  loadCart() {
    this.cartSvc.getCart().subscribe(data => this.items = data);
  }
  updateItem(item: CartItem) {
    this.cartSvc.updateItem(item.id, item.quantity).subscribe(() => this.loadCart());
  }
  removeItem(item: CartItem) {
    this.cartSvc.removeItem(item.id).subscribe(() => this.loadCart());
  }
  getTotal(): number {
    return this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }
  checkout() {
    this.router.navigate(['/checkout']);
  }
}
