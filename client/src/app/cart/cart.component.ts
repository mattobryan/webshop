// cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/cart-item.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ],
  template: `
  <div class="cart-layout" *ngIf="items.length; else emptyCart">
    <div class="cart-items">
      <mat-card *ngFor="let item of items" [@fadeInOut] class="cart-card">
        <div class="cart-item">
          <img [src]="item.product.imageUrl" alt="{{ item.product.name }}" />
          <div class="details">
            <h3>{{ item.product.name }}</h3>
            <p>\${{ item.product.price.toFixed(2) }}</p>

            <div class="quantity">
              <button mat-icon-button (click)="decrementQuantity(item)" [disabled]="item.quantity <= 1">
                <mat-icon>remove</mat-icon>
              </button>

              <input
                type="number"
                [value]="item.quantity"
                (input)="onQuantityInput(item, $event)"
                [max]="item.product.stock"
              />

              <button mat-icon-button (click)="incrementQuantity(item)" [disabled]="item.quantity >= item.product.stock">
                <mat-icon>add</mat-icon>
              </button>
            </div>

            <p class="stock" [class.out]="item.product.stock === 0">
              {{ item.product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
            </p>

            <p class="item-total">
              Total: \${{ (item.product.price * item.quantity).toFixed(2) }}
            </p>
          </div>

          <button mat-mini-fab color="warn" (click)="confirmRemove(item)">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </mat-card>
    </div>

    <div class="cart-summary">
      <mat-card class="summary-card">
        <h3>Order Summary</h3>
        <p>Total Items: {{ getTotalItems() }}</p>
        <p><strong>Total: \${{ getTotal().toFixed(2) }}</strong></p>

        <button mat-raised-button color="primary" (click)="checkout()" [disabled]="!canCheckout()">
          Proceed to Checkout
        </button>

        <button mat-button color="accent" (click)="router.navigate(['/products'])">
          Continue Shopping
        </button>
      </mat-card>
    </div>
  </div>

  <ng-template #emptyCart>
    <div class="empty-message">
      <h2>Your cart is empty.</h2>
      <button mat-raised-button color="primary" (click)="router.navigate(['/products'])">
        Browse Products
      </button>
    </div>
  </ng-template>
  `,
  styles: [`
    .cart-layout {
      display: flex;
      flex-wrap: wrap;
      gap: 32px;
      padding: 24px;
    }

    .cart-items {
      flex: 2;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .cart-card {
      padding: 16px;
    }

    .cart-item {
      display: flex;
      align-items: flex-start;
      gap: 20px;
    }

    .cart-item img {
      width: 100px;
      height: 100px;
      object-fit: contain;
      border-radius: 8px;
    }

    .details {
      flex: 1;
    }

    .quantity {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 12px 0;
    }

    .quantity input {
      width: 60px;
      padding: 4px;
      text-align: center;
    }

    .stock {
      color: green;
      font-weight: 600;
    }

    .stock.out {
      color: red;
    }

    .cart-summary {
      flex: 1;
      position: sticky;
      top: 24px;
    }

    .summary-card {
      padding: 24px;
      background-color: #fafafa;
      border-radius: 12px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

    .empty-message {
      text-align: center;
      padding: 48px;
    }
  `]
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];

  constructor(
    private cartSvc: CartService,
    public router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartSvc.getCart().subscribe({
      next: cart => (this.items = cart.items),
      error: err => console.error('Failed to load cart:', err)
    });
  }

  showMessage(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  incrementQuantity(item: CartItem) {
    const newQty = item.quantity + 1;
    if (newQty > item.product.stock) {
      this.showMessage('Cannot exceed available stock.');
      return;
    }
    item.quantity = newQty;
    this.cartSvc.updateItem(item.product._id, newQty).subscribe();
  }

  decrementQuantity(item: CartItem) {
    const newQty = item.quantity - 1;
    if (newQty < 1) {
      this.showMessage('Quantity must be at least 1.');
      return;
    }
    item.quantity = newQty;
    this.cartSvc.updateItem(item.product._id, newQty).subscribe();
  }

  onQuantityInput(item: CartItem, event: Event) {
    const input = (event.target as HTMLInputElement);
    let newQty = Number(input.value);
    if (!isNaN(newQty)) {
      if (newQty < 1) {
        newQty = 1;
        this.showMessage('Minimum quantity is 1.');
      } else if (newQty > item.product.stock) {
        newQty = item.product.stock;
        this.showMessage('Exceeded available stock.');
      }
      item.quantity = newQty;
      this.cartSvc.updateItem(item.product._id, newQty).subscribe();
    }
  }

  confirmRemove(item: CartItem) {
    const confirmed = window.confirm(`Remove "${item.product.name}" from cart?`);
    if (confirmed) {
      this.cartSvc.removeItem(item.product._id).subscribe(() => this.loadCart());
    }
  }

  getTotal(): number {
    return this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }

  getTotalItems(): number {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  canCheckout(): boolean {
    return this.items.every(item => item.quantity <= item.product.stock);
  }

  checkout() {
    if (!this.canCheckout()) return;
    this.router.navigate(['/checkout']);
  }
}
