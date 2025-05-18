import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  imageUrl?: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  createdBy: string;
  specs: {
    ram: string;
    storage: string;
    processor: string;
    battery: string;
    display: string;
    os: string;
    camera: string;
  };
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: String,
    brand: String,
    imageUrl: String,
    ratingsAverage: { type: Number, default: 0 },
    ratingsQuantity: { type: Number, default: 0 },
    createdBy: { type: String }, // user ID or username
    specs: {
      ram: String,
      storage: String,
      processor: String,
      battery: String,
      display: String,
      os: String,
      camera: String
    }
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
