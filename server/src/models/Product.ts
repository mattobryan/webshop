// src/models/Product.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    imageUrl: String, // Path to uploaded image file
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
