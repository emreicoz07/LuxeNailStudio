import { Types } from 'mongoose';
import { BookingStatus } from '../enums/booking-status.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

export interface UserFromRequest {
  _id: Types.ObjectId;
  email: string;
  name: string;
}

export interface Booking {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  serviceId: Types.ObjectId;
  addOnIds: Types.ObjectId[];
  dateTime: Date;
  duration: number;
  totalAmount: number;
  depositAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  reminderSent: boolean;
  cancelReason?: string;
}

export interface Service {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
}

export interface AddOn {
  _id: Types.ObjectId;
  name: string;
  price: number;
  duration: number;
  description?: string;
  isActive: boolean;
  category: string;
} 