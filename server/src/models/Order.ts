// src/models/Order.ts
import mongoose, { Schema, Document } from 'mongoose';

interface OrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: OrderItem[];
  total: number;
  status: string;
}

const OrderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    total: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
