// src/app/models/product.model.ts
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  imageUrl: string;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  createdBy?: string;
  createdAt?: string;

  // New fields
  ram?: string;
  storage?: string;
  camera?: string;
  battery?: string;
  processor?: string;
  display?: string;
  os?: string;
}
