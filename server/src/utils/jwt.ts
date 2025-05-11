// src/utils/jwt.ts
import jwt from 'jsonwebtoken';

// Generate an access token (short-lived)
export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, { expiresIn: '15m' });
};

// Generate a refresh token (long-lived)
export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });
};

// Verify an access token, returning decoded payload or throwing an error
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
};

// Verify a refresh token similarly
export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
};
