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
    
    // Transform _id to id for client compatibility
    const productObj = product.toObject();
    productObj.id = productObj._id;
    res.status(201).json(productObj);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get all products (public)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    // Transform _id to id for client compatibility
    const transformedProducts = products.map(product => {
      const productObj = product.toObject();
      productObj.id = productObj._id;
      return productObj;
    });
    res.json(transformedProducts);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single product by ID (public)
export const getProductById = async (req: Request, res: Response) => {
  try {
    // Check if id is undefined or empty
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    const prod = await Product.findById(req.params.id);
    if (!prod) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Transform _id to id for client compatibility
    const productObj = prod.toObject();
    productObj.id = productObj._id;
    res.json(productObj);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Update a product (admin only)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    // Check if id is undefined or empty
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    const prod = await Product.findById(req.params.id);
    if (!prod) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields if provided
    const { name, description, price } = req.body;
    if (name) prod.name = name;
    if (description) prod.description = description;
    if (price) prod.price = price;
    if (req.file) prod.imageUrl = `/uploads/${req.file.filename}`;

    await prod.save();
    
    // Transform _id to id for client compatibility
    const productObj = prod.toObject();
    productObj.id = productObj._id;
    res.json(productObj);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a product (admin only)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    // Check if id is undefined or empty
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    const prod = await Product.findByIdAndDelete(req.params.id);
    if (!prod) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
