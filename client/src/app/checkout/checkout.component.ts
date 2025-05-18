// src/app/checkout/checkout.component.ts
import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { OrderService } from '../services/order.service';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';

// Custom expiry validator
function expiryValidator(control: AbstractControl): ValidationErrors | null {
  const val = control.value;
  if (!val || !/^\d{2}\/\d{2}$/.test(val)) return { invalidFormat: true };

  const [monthStr, yearStr] = val.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt('20' + yearStr, 10);

  if (month < 1 || month > 12) return { invalidMonth: true };

  const now = new Date();
  const expiryDate = new Date(year, month - 1, 1);
  if (expiryDate < new Date(now.getFullYear(), now.getMonth(), 1)) return { expired: true };

  return null;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatInputModule,
    CommonModule,
  ],
  template: `
    <mat-card class="checkout-card">
      <mat-card-title>Checkout & Payment</mat-card-title>

      <form [formGroup]="paymentForm" (ngSubmit)="submitPayment()" novalidate>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Card Number</mat-label>
          <input
            matInput
            formControlName="cardNumber"
            maxlength="19"
            placeholder="1234 5678 9012 3456"
            autocomplete="cc-number"
            (input)="formatCardNumber($event)"
          />
          <mat-error *ngIf="cardNumber.invalid && (cardNumber.dirty || cardNumber.touched)">
            Enter a valid card number (16 digits)
          </mat-error>
        </mat-form-field>

        <div class="row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Expiry (MM/YY)</mat-label>
            <input
              matInput
              formControlName="expiry"
              maxlength="5"
              placeholder="MM/YY"
              autocomplete="cc-exp"
              (input)="formatExpiry($event)"
            />
            <mat-error *ngIf="expiry.invalid && (expiry.dirty || expiry.touched)">
              <ng-container *ngIf="expiry.errors?.['invalidFormat']">
                Enter expiry as MM/YY
              </ng-container>
           <ng-container *ngIf="expiry.errors?.['invalidMonth']">
                Enter a valid month (01-12)
              </ng-container>
              <ng-container *ngIf="expiry.errors?.['expired']">
                Card expired
              </ng-container>
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>CVC</mat-label>
            <input
              matInput
              formControlName="cvc"
              maxlength="4"
              placeholder="123"
              autocomplete="cc-csc"
              (input)="formatCvc($event)"
            />
            <mat-error *ngIf="cvc.invalid && (cvc.dirty || cvc.touched)">
              Enter a valid CVC (3 or 4 digits)
            </mat-error>
          </mat-form-field>
        </div>

        <p>Total: <strong>\${{ total.toFixed(2) }}</strong></p>
        <p class="note">(This is a simulation. No real payment is processed.)</p>

        <button mat-raised-button color="primary" [disabled]="paymentForm.invalid || loading">
          {{ loading ? 'Processing...' : 'Pay Now' }}
          <mat-progress-spinner
            *ngIf="loading"
            diameter="20"
            mode="indeterminate"
            color="accent"
            class="spinner"
          ></mat-progress-spinner>
        </button>
      </form>
    </mat-card>
  `,
  styles: [
    `
      .checkout-card {
        max-width: 400px;
        margin: 32px auto;
        padding: 16px;
      }
      .full-width {
        width: 100%;
      }
      .half-width {
        width: 48%;
      }
      .row {
        display: flex;
        justify-content: space-between;
        gap: 4%;
        margin-bottom: 16px;
      }
      .note {
        font-size: 0.85rem;
        color: gray;
        margin-bottom: 16px;
      }
      button {
        position: relative;
      }
      .spinner {
        position: absolute;
        top: 50%;
        right: 16px;
        transform: translateY(-50%);
      }
    `,
  ],
})
export class CheckoutComponent {
  total = 0;
  loading = false;

  paymentForm = new FormGroup({
    cardNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(\d{4} ?){3}\d{4}$/),
    ]),
    expiry: new FormControl('', [Validators.required, expiryValidator]),
    cvc: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{3,4}$/),
    ]),
  });

  get cardNumber() {
    return this.paymentForm.get('cardNumber')!;
  }
  get expiry() {
    return this.paymentForm.get('expiry')!;
  }
  get cvc() {
    return this.paymentForm.get('cvc')!;
  }

  constructor(
    private orderSvc: OrderService,
    private cartSvc: CartService,
    private router: Router
  ) {
    this.cartSvc.getCart().subscribe((cart) => {
      this.total = cart.items.reduce(
        (sum, i) => sum + i.product.price * i.quantity,
        0
      );
    });
  }

  formatCardNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').substring(0, 16); // digits only, max 16

    const parts = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.substring(i, i + 4));
    }
    input.value = parts.join(' ');
    this.cardNumber.setValue(input.value, { emitEvent: false });
  }

  formatExpiry(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').substring(0, 4); // max 4 digits MMYY

    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    input.value = value;
    this.expiry.setValue(input.value, { emitEvent: false });
  }

  formatCvc(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').substring(0, 4);
    input.value = value;
    this.cvc.setValue(input.value, { emitEvent: false });
  }

  submitPayment() {
    if (this.paymentForm.invalid) {
      return;
    }
    this.loading = true;

    setTimeout(() => {
      this.orderSvc.placeOrder({ items: [], total: this.total }).subscribe({
        next: () => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Payment Successful!',
            text: 'Your order has been placed.',
            confirmButtonText: 'Go to Orders',
          }).then(() => {
            this.cartSvc.clearCart().subscribe(() => this.router.navigate(['/orders']));
          });
        },
        error: () => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Payment Failed',
            text: 'Something went wrong. Please try again.',
            confirmButtonText: 'Retry',
          });
        },
      });
    }, 2000);
  }
}
