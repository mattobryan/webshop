// src/middlewares/role.ts
import { Request, Response, NextFunction } from 'express';

// Role-based access middleware
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // User has a 'role' field (e.g. 'customer', 'admin')
    if (!roles.includes(user.role)) {
      res.status(403).json({ message: 'Forbidden: insufficient role' });
      return;
    }
    next();
  };
};
