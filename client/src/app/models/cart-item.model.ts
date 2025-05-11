// src/app/models/cart-item.model.ts
import { Product } from './product.model';

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}
