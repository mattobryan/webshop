// src/routes/auth.routes.ts
import express from 'express';
import { body, validationResult } from 'express-validator';
import { register, login, refreshToken, logout } from '../controllers/authController';

const router = express.Router();

// Validation middleware example using express-validator:contentReference[oaicite:8]{index=8}
// Register route
router.post(
  '/register',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  (req, res, next) => {
    // Check validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
  register
);

// Login route
router.post(
  '/login',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
  login
);

// Refresh token route
router.post('/refresh', refreshToken);

// Logout route
router.post('/logout', logout);

export default router;
