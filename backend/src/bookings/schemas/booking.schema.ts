import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';
import { Service } from './service.schema';
import { AddOn } from './addon.schema';
import { PaymentStatus } from '../dto/create-booking.dto';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED',
}

export interface BookingDocument extends Booking, Document {
  _id: Types.ObjectId;
  id: string;
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

  @Prop({ required: true, enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Prop({ type: String, enum: ['PAID', 'UNPAID', 'REFUNDED'], default: 'UNPAID' })
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

  @Prop()
  paymentId?: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

// Add indexes for common queries
BookingSchema.index({ userId: 1, dateTime: -1 });
BookingSchema.index({ status: 1, dateTime: 1 });
BookingSchema.index({ dateTime: 1 }); 