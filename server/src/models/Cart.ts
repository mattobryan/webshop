// src/models/Cart.ts
import mongoose, { Schema, Document } from 'mongoose';

interface CartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: CartItem[];
}

const CartSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
