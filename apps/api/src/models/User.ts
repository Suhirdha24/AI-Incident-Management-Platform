import { Schema, model } from 'mongoose';
import { UserRole } from '@opsai/shared';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatar?: string;
  status: 'ACTIVE' | 'DISABLED';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.ENGINEER },
    avatar: { type: String },
    status: { type: String, enum: ['ACTIVE', 'DISABLED'], default: 'ACTIVE' }
  },
  { timestamps: true }
);

export const User = model<IUserDocument>('User', userSchema);
