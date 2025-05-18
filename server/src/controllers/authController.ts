// src/controllers/authController.ts
import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

// Register a new user
export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;  // Add username here
  try {
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    user = new User({ username, email, password });  // Add username to user creation
    await user.save();

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id, role: user.role });
    res.status(201).json({ accessToken, refreshToken });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Login user and return JWTs (with safe user serialization)
export const login = async (req: Request, res: Response) => {
  const { login, password } = req.body;
  try {
    const query = login.includes('@') ? { email: login } : { username: login };
    const user = await User.findOne(query);

    if (!user || !(await user.comparePassword(password))) {
      res.status(400).json({ message: 'Invalid login or password' });
      return;
    }

    // Generate tokens
    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id, role: user.role });

   // Use destructuring to exclude password
    const { password: _, ...userWithoutPassword } = user.toObject();

    // Send response with tokens and safe user object
    res.status(200).json({ accessToken, refreshToken, user: userWithoutPassword });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Refresh access token
export const refreshToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    res.status(401).json({ message: 'No refresh token provided' });
    return;
  }

  try {
    const payload = verifyRefreshToken(token) as any;
    const user = await User.findById(payload.id);
    if (!user) {
      res.status(401).json({ message: 'Invalid refresh token' });
      return;
    }

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// Logout
export const logout = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Logged out' });
};
