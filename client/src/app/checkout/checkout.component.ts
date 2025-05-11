// src/app/checkout/checkout.component.ts
import { Component } from '@angular/core';
import { OrderService } from '../services/order.service';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  template: `
    <mat-card class="checkout-card">
      <mat-card-title>Confirm Checkout</mat-card-title>
      <mat-card-content>
        <p>Total: \${{total}}</p>
        <p>(This is a simulation. No real payment is processed.)</p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="placeOrder()">Place Order</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`.checkout-card { max-width: 400px; margin: 32px auto; text-align: center; }`]
})
export class CheckoutComponent {
  total = 0;
  constructor(private orderSvc: OrderService, private cartSvc: CartService, private router: Router) {
    // Compute total from cart
    this.cartSvc.getCart().subscribe(items => {
      this.total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    });
  }
  placeOrder() {
    this.orderSvc.placeOrder({ items: [], total: this.total }).subscribe(() => {
      alert('Order placed!');
      this.cartSvc.clearCart().subscribe(() => this.router.navigate(['/products']));
    });
  }
}
