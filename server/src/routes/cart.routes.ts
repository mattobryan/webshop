// src/routes/cart.routes.ts
import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { getCart, addToCart, removeFromCart } from '../controllers/cartController';
const router = express.Router();

// All cart routes require authentication
router.get('/', authMiddleware, getCart);
router.post('/', authMiddleware, addToCart);
router.delete('/:productId', authMiddleware, removeFromCart);

export default router;
