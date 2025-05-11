// src/middlewares/error.ts
import { Request, Response, NextFunction } from 'express';

// Global error-handling middleware (must have 4 args in Express)
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
  });
};
