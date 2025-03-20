import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

@Schema({ timestamps: true })
export class Employee {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: [String], required: true })
  expertise: string[];

  @Prop()
  imageUrl?: string;

  @Prop()
  bio?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop([{
    dayOfWeek: { type: Number, required: true }, // 0-6 for Sunday-Saturday
    startTime: { type: String, required: true }, // "HH:mm" format
    endTime: { type: String, required: true },   // "HH:mm" format
    isWorkDay: { type: Boolean, default: true }
  }])
  workSchedule: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isWorkDay: boolean;
  }[];
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee); 