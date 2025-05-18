import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CartItem } from '../models/cart-item.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = `${environment.apiBaseUrl}/cart`;

  // BehaviorSubject to hold the cart item count
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Helper method to update count from items array
  private updateCount(items: CartItem[]) {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCountSubject.next(count);
  }

  // Get current cart with items
  getCart(): Observable<{ items: CartItem[] }> {
    return this.http.get<{ items: CartItem[] }>(this.apiUrl).pipe(
      tap(cart => this.updateCount(cart.items))
    );
  }

  // Add or update items in the cart
  addToCart(item: { productId: string; quantity: number }): Observable<{ items: CartItem[] }> {
    return this.http.post<{ items: CartItem[] }>(this.apiUrl, item).pipe(
      tap(cart => this.updateCount(cart.items))
    );
  }

  // If your backend supports updating item quantity by product ID
  updateItem(productId: string, quantity: number): Observable<{ items: CartItem[] }> {
    // You can reuse addToCart as an upsert (if backend supports)
    return this.http.post<{ items: CartItem[] }>(this.apiUrl, { productId, quantity }).pipe(
      tap(cart => this.updateCount(cart.items))
    );
  }

  removeItem(productId: string): Observable<{ items: CartItem[] }> {
    return this.http.delete<{ items: CartItem[] }>(`${this.apiUrl}/${productId}`).pipe(
      tap(cart => this.updateCount(cart.items))
    );
  }

  clearCart(): Observable<any> {
    return this.http.delete(this.apiUrl).pipe(
      tap(() => this.cartCountSubject.next(0))
    );
  }
  refreshCartCount(): void {
    this.getCart().subscribe(); // <--- Add this method
  }
}
