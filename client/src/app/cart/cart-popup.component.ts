import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-popup',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  template: `
    <div style="text-align: center; padding: 20px;">
      <h2>Added to Cart!</h2>
      <p>{{ data.name }} has been added to your cart.</p>
      <button mat-raised-button color="primary" (click)="goToCart()">Proceed to Checkout</button>
      <button mat-button color="accent" (click)="continueShopping()">Continue Browsing</button>
    </div>
  `
})
export class CartPopupComponent {
  constructor(
    private dialogRef: MatDialogRef<CartPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string },
    private router: Router
  ) {}

  goToCart() {
    this.dialogRef.close();
    this.router.navigate(['/cart']);
  }

  continueShopping() {
    this.dialogRef.close();
    this.router.navigate(['/products']);
  }
}
// This component is a popup dialog that appears when an item is added to the cart.
// It provides options to either proceed to checkout or continue browsing products.