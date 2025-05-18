// src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'guest' | 'customer' | 'admin';
  fullName?: string;
  phone?: string;
  address?: Address;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
const AddressSchema = new Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  country: { type: String }
});
const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },  // Add the username field
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['guest', 'customer', 'admin'], default: 'customer' },

    fullName: { type: String },
    phone: { type: String },
    address: { type: AddressSchema },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare candidate password
UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};


// A simple role field is included to support RBAC:contentReference[oaicite:5]{index=5}
export const User = mongoose.model<IUser>('User', UserSchema);
