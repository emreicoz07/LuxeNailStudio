import { Types } from 'mongoose';
import { BookingStatus } from '../../bookings/enums/booking-status.enum';
import { PaymentStatus } from '../../bookings/enums/payment-status.enum';

export interface BookingEmailDetails {
  id: string;
  dateTime: Date;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  serviceName: string;
  notes?: string;
  addOnServices?: Array<{
    name: string;
    price: number;
  }>;
  depositAmount?: number;
}

export interface BookingConfirmationEmailData {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  bookingDetails: {
    id: string;
    dateTime: Date;
    totalAmount: number;
    depositAmount: number;
    status: string;
    paymentStatus: string;
    serviceName: string;
    addOnServices: Array<{
      name: string;
      price: number;
    }>;
    notes?: string;
  };
} 