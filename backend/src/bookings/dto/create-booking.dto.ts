import { IsMongoId, IsArray, IsOptional, IsDate, IsNumber, Min, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentStatus } from '../enums/payment-status.enum';

export class CreateBookingDto {
  @IsMongoId()
  serviceId: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  addOnIds?: string[];

  @IsDate()
  @Type(() => Date)
  appointmentDate: Date;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  depositAmount?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: PaymentStatus;
} 