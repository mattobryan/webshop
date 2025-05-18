// src/app/models/cart-item.model.ts
import { Product } from './product.model';

export interface CartItem {
  id: string;               // id of the cart item (for update/delete)
  quantity: number;
  product: Product;      // product details
}