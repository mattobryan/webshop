// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CartItem } from '../models/cart-item.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = `${environment.apiBaseUrl}/cart`;
  constructor(private http: HttpClient) {}

  getCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl);
  }

  addToCart(item: { productId: number; quantity: number; }): Observable<CartItem> {
    return this.http.post<CartItem>(this.apiUrl, item);
  }

  updateItem(id: number, quantity: number): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.apiUrl}/${id}`, { quantity });
  }

  removeItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  clearCart(): Observable<any> {
    return this.http.delete(this.apiUrl);
  }
}
