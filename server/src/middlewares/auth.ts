import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { User } from '../models/User';

// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace `any` with the appropriate user type if available
    }
  }
}

// Authentication middleware: verifies JWT access token
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    // Verify token and attach user to request
    const payload = verifyAccessToken(token) as any;
    const user = await User.findById(payload.id);
    if (!user) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    req.user = user; // Attach user object to request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    return;
  }
};
