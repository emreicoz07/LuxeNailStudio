import { IsString, IsDateString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export type PaymentStatus = 'PAID' | 'UNPAID' | 'REFUNDED';

export class CreateBookingDto {
  @IsString()
  @Transform(({ value }) => value.toString())
  serviceId: string;

  @IsDateString()
  appointmentDate: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  @IsOptional()
  depositAmount?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  paymentId?: string;

  @IsEnum(['PAID', 'UNPAID', 'REFUNDED'])
  @IsOptional()
  paymentStatus?: PaymentStatus;
} 