// src/app/models/order.model.ts
import { CartItem } from './cart-item.model';

export interface Order {
  id: number;
  items: CartItem[];
  total: number;
  date: string;  // ISO date string
}
