import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });
      req.user = user;  // Attach user payload to request
      next();
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}
