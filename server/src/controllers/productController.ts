// src/controllers/productController.ts
import { Request, Response } from 'express';
import { Product } from '../models/Product';

// Create a new product (admin only)
export const createProduct = async (req: Request, res: Response) => {
  try {
    // If image was uploaded by multer
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const { name, description, price } = req.body;
    const product = new Product({ name, description, price, imageUrl });
    await product.save();
    res.status(201).json(product);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get all products (public)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single product by ID (public)
export const getProductById = async (req: Request, res: Response) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(prod);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Update a product (admin only)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Update fields if provided
    const { name, description, price } = req.body;
    if (name) prod.name = name;
    if (description) prod.description = description;
    if (price) prod.price = price;
    if (req.file) prod.imageUrl = `/uploads/${req.file.filename}`;

    await prod.save();
    res.json(prod);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a product (admin only)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const prod = await Product.findByIdAndDelete(req.params.id);
    if (!prod) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
