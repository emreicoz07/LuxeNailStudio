import { Request } from 'express';
import { Types } from 'mongoose';
import { UserRole } from '../enums/user-role.enum';

export interface UserFromRequest {
  _id?: string;
  userId: string;
  email: string;
  role: string;
  name?: string;
  firstName?: string;
  lastName?: string;
}

export interface RequestWithUser extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    name?: string;
    firstName?: string;
    lastName?: string;
  };
} 