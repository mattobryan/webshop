// src/controllers/cartController.ts
import { Request, Response, NextFunction } from 'express';
import { Cart } from '../models/Cart';

// Get current user's cart
export const getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = (req as any).user._id;
  try {
    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (err: any) {
    next(err); // Pass the error to the next middleware
  }
};

// Add item to cart or update quantity
export const addToCart = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    // Check if product already in cart
    const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
    if (itemIndex > -1) {
      // Update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const productId = req.params.productId;
  try {
    const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    res.status(404).json({ message: 'Cart not found' });
    return;
  }

    cart.items = cart.items.filter(item => !item.product.equals(productId));
    await cart.save();
    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
