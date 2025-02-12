import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsString()
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
} 