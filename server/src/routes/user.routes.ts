import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController';
import { authenticateJWT } from '../middlewares/user';

const router = express.Router();

// Protect these routes with JWT middleware
router.get('/me', authenticateJWT, getUserProfile);
router.put('/me', authenticateJWT, updateUserProfile);

export default router;
