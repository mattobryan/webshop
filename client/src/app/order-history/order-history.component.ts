// src/app/order-history/order-history.component.ts
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order.model';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [MatCardModule, CommonModule, DatePipe],
  template: `
    <h2 class="page-title">My Orders</h2>
    <div class="orders-container" *ngIf="orders.length; else noOrders">
      <mat-card *ngFor="let order of orders" class="order-card" appearance="outlined">
        <mat-card-header>
          <mat-card-title>Order #{{order.id}}</mat-card-title>
          <mat-card-subtitle>{{ order.date | date:'medium' }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p><strong>Total:</strong> \${{order.total.toFixed(2)}}</p>
          <p><strong>Items:</strong> {{order.items.length}}</p>
          <ul>
            <li *ngFor="let item of order.items">
              {{item.product.name}} <span class="qty">(x{{item.quantity}})</span>
            </li>
          </ul>
        </mat-card-content>
      </mat-card>
    </div>
    <ng-template #noOrders>
      <p class="no-orders-msg">You have no past orders yet.</p>
    </ng-template>
  `,
  styles: [`
    .page-title {
      text-align: center;
      margin: 24px 0;
      font-weight: 600;
      font-size: 2rem;
      color: #1976d2;
    }
    .orders-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      max-width: 700px;
      margin: 0 auto 40px auto;
      padding-bottom: 100px; /* ✅ added */
    }
    .order-card {
      padding: 16px;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.2);
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      transition: box-shadow 0.3s ease;
    }
    .order-card:hover {
      box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
    }
    ul {
      padding-left: 16px;
      margin: 0;
      list-style-type: disc;
    }
    .qty {
      color: #555;
      font-style: italic;
      font-size: 0.9em;
    }
    .no-orders-msg {
      text-align: center;
      font-size: 1.2rem;
      color: #666;
      margin-top: 40px;
    }
`]
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderSvc: OrderService) {}

  ngOnInit() {
    this.orderSvc.getOrders().subscribe({
      next: data => this.orders = data,
      error: () => {
        // Handle error if needed
      }
    });
  }
}
