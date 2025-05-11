// src/routes/order.routes.ts
import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { requireRole } from '../middlewares/role';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
} from '../controllers/orderController';

const router = express.Router();

// Place an order (checkout)
router.post('/', authMiddleware, createOrder);

// Get orders: admin sees all, user sees own
router.get('/', authMiddleware, getOrders);

// Get specific order
router.get('/:id', authMiddleware, getOrderById);

// Update order (admin only)
router.put('/:id', authMiddleware, requireRole('admin'), updateOrder);

export default router;
