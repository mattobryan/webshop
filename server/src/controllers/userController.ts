import { Request, Response } from 'express';
import { User } from '../models/User';

// GET /users/me
export async function getUserProfile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user.id; // assuming JWT sets req.user
    const user = await User.findById(userId).select('-password -__v');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    return;
  }
}

// PUT /users/me
export async function updateUserProfile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user.id;
    const { email, fullName, phone, address } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (email) user.email = email;
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    const updatedUser = await User.findById(userId).select('-password -__v');

    res.json(updatedUser);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    return;
  }
}
