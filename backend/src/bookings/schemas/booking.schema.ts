import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';
import { Service } from './service.schema';
import { AddOn } from './addon.schema';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  UNPAID = 'UNPAID'
}

export interface BookingDocument extends Booking, Document {
  _id: Types.ObjectId;
  id: string;
}

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Service', required: true })
  serviceId: Service;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'AddOn' }] })
  addOnIds: AddOn[];

  @Prop({ required: true })
  dateTime: Date;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Prop({ 
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID 
  })
  paymentStatus: PaymentStatus;

  @Prop()
  notes?: string;

  @Prop()
  cancelReason?: string;

  @Prop({ default: false })
  reminderSent: boolean;

  @Prop({ type: String })
  paymentId?: string;

  @Prop({ type: Number, default: 0 })
  depositAmount: number;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

// Add indexes for common queries
BookingSchema.index({ userId: 1, dateTime: -1 });
BookingSchema.index({ status: 1, dateTime: 1 });
BookingSchema.index({ dateTime: 1 }); 