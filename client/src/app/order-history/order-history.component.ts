// src/app/order-history/order-history.component.ts
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <div *ngFor="let order of orders">
      <mat-card class="order-card">
        <mat-card-title>Order #{{order.id}} - {{order.date | date:'short'}}</mat-card-title>
        <mat-card-content>
          <p>Total: \${{order.total}}</p>
          <ul>
            <li *ngFor="let item of order.items">{{item.product.name}} (x{{item.quantity}})</li>
          </ul>
        </mat-card-content>
      </mat-card>
    </div>
    <p *ngIf="!orders.length">No past orders.</p>
  `,
  styles: [`.order-card { margin: 16px; }`]
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  constructor(private orderSvc: OrderService) {}
  ngOnInit() {
    this.orderSvc.getOrders().subscribe(data => this.orders = data);
  }
}
