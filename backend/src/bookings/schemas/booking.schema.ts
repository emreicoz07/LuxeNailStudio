import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';
import { Service } from './service.schema';
import { AddOn } from './addon.schema';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

export type BookingDocument = Booking & Document;

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

  @Prop({ required: true, enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Prop({ min: 0 })
  totalAmount: number;

  @Prop({ min: 0 })
  depositAmount: number;

  @Prop()
  notes?: string;

  @Prop()
  cancelReason?: string;

  @Prop({ default: false })
  reminderSent: boolean;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

// Add indexes for common queries
BookingSchema.index({ userId: 1, dateTime: -1 });
BookingSchema.index({ status: 1, dateTime: 1 });
BookingSchema.index({ dateTime: 1 }); 