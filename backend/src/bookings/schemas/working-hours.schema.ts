import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface DaySchedule {
  isOpen: boolean;
  openTime: string;  // Format: "HH:mm"
  closeTime: string; // Format: "HH:mm"
}

@Schema({ timestamps: true })
export class WorkingHours {
  @Prop({ required: true, unique: true })
  dayOfWeek: string; // "MONDAY", "TUESDAY", etc.

  @Prop({ required: true, default: true })
  isOpen: boolean;

  @Prop({ required: true })
  openTime: string;

  @Prop({ required: true })
  closeTime: string;
}

export type WorkingHoursDocument = WorkingHours & Document;
export const WorkingHoursSchema = SchemaFactory.createForClass(WorkingHours); 