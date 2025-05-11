// src/controllers/orderController.ts
import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Cart } from '../models/Cart';

// Checkout: create a new order from cart items
export const createOrder = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: 'Cart is empty' });
      return;
    }
    // Calculate total from cart items
    const total = cart.items.reduce((sum, item) => {
      // @ts-ignore
      return sum + item.product.price * item.quantity;
    }, 0);

    // Simulate payment: 50% chance of success
    const paymentSuccess = Math.random() < 0.5;
    if (!paymentSuccess) {
      res.status(402).json({ message: 'Payment failed, please try again' });
      return;
    }

    // Create order
    const order = new Order({
      user: userId,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      total,
      status: 'completed',
    });
    await order.save();

    // Clear user's cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get all orders (admin) or current user's orders
export const getOrders = async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    let orders;
    if (user.role === 'admin') {
      orders = await Order.find().populate('user').populate('items.product');
    } else {
      orders = await Order.find({ user: user._id }).populate('items.product');
    }
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get a specific order by ID
export const getOrderById = async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    // Only admin or owner can view
    if (user.role !== 'admin' && !order.user.equals(user._id)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Update order status (admin only)
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    const { status } = req.body;
    if (status) order.status = status;
    await order.save();
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
