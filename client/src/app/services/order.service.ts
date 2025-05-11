// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Order } from '../models/order.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiBaseUrl}/orders`;
  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  placeOrder(orderData: { items: any[]; total: number; }): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, orderData);
  }
}
