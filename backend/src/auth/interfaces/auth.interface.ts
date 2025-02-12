import { Request } from 'express';
import { Types } from 'mongoose';
import { UserRole } from '../schemas/user.schema';

export interface UserFromRequest {
  _id: Types.ObjectId;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  name: string;
}

export interface RequestWithUser extends Request {
  user: UserFromRequest;
} 