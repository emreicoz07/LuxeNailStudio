import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export interface WorkSchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // Format: "HH:mm"
  endTime: string;   // Format: "HH:mm"
  isOpen: boolean;
}

@Schema({ timestamps: true })
export class Employee {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop({ type: [{ 
    dayOfWeek: { type: Number, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isOpen: { type: Boolean, default: true }
  }] })
  workSchedule: WorkSchedule[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Service' }])
  services: MongooseSchema.Types.ObjectId[];
}

export type EmployeeDocument = Employee & Document;
export const EmployeeSchema = SchemaFactory.createForClass(Employee); 