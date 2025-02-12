import { IsMongoId, IsArray, IsDate, IsNumber, Min, IsString, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum PaymentStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  REFUNDED = 'REFUNDED'
}

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
  depositAmount: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  paymentId?: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus = PaymentStatus.UNPAID;
} 