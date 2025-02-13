import { Types } from 'mongoose';
import { BookingStatus } from '../../bookings/enums/booking-status.enum';
import { PaymentStatus } from '../../bookings/enums/payment-status.enum';

export interface BookingEmailDetails {
  id: string;
  dateTime: Date;
  totalAmount: number;
  depositAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  serviceName: string;
  notes?: string;
  addOnServices?: Array<{
    name: string;
    price: number;
  }>;
}

export interface BookingConfirmationEmailData {
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  bookingDetails: BookingEmailDetails;
} 