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
// Login route
router.post(
  '/login',
  body('login').notEmpty(),  // must not be empty
  body('login').custom(value => {
    if (value.includes('@')) {
      // Validate email format only if it looks like an email
      if (!/\S+@\S+\.\S+/.test(value)) {
        throw new Error('Invalid email format');
      }
    }
    return true;
  }),
  body('password').isLength({ min: 6 }),  // password length check
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
