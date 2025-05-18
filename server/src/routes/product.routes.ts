// src/routes/product.routes.ts
import express from 'express';
import multer from 'multer';
import { authMiddleware } from '../middlewares/auth';
import { requireRole } from '../middlewares/role';
import { asyncHandler } from '../utils/asyncHandler';

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';

const router = express.Router();

// Configure multer for file uploads (store in /uploads)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Public routes
router.get('/', asyncHandler(getProducts));
router.get('/:id', asyncHandler(getProductById));

// Admin routes
router.post('/', authMiddleware, requireRole('admin'), upload.single('image'), asyncHandler(createProduct));
router.put('/:id', authMiddleware, requireRole('admin'), upload.single('image'), asyncHandler(updateProduct));
router.delete('/:id', authMiddleware, requireRole('admin'), asyncHandler(deleteProduct));

export default router;
