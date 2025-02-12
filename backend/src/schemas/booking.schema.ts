import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { Service } from './service.schema';
import { AddOn } from './addon.schema';
import { PaymentStatus } from '../dto/create-booking.dto';
import { BookingStatus } from '../bookings/enums/booking-status.enum';

export interface BookingDocument extends Document {
  userId: Types.ObjectId;
  serviceId: Types.ObjectId;
  addOnIds: Types.ObjectId[];
  dateTime: Date;
  duration: number;
  totalAmount: number;
  depositAmount?: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  reminderSent?: boolean;
  cancelReason?: string;
}

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Service', required: true })
  serviceId: Service;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'AddOn' }] })
  addOnIds: AddOn[];

  @Prop({ required: true })
  dateTime: Date;

  @Prop({ 
    type: String, 
    required: true,
    enum: Object.values(BookingStatus),
    default: BookingStatus.PENDING 
  })
  status: BookingStatus;

  @Prop({ 
    type: String, 
    required: true,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.UNPAID 
  })
  paymentStatus: PaymentStatus;

  @Prop({ type: Number, min: 0, required: true })
  totalAmount: number;

  @Prop({ type: Number, min: 0, required: true, default: 0 })
  depositAmount: number;

  @Prop({ type: String })
  notes?: string;

  @Prop({ type: String })
  cancelReason?: string;

  @Prop({ type: Boolean, default: false })
  reminderSent: boolean;

  @Prop({ type: String })
  paymentId?: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

// Add indexes for common queries
BookingSchema.index({ userId: 1, dateTime: -1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ paymentStatus: 1 }); 