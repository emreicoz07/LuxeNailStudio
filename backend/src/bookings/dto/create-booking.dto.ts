import { IsMongoId, IsArray, IsDate, IsNumber, Min, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

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

  @IsString()
  @IsOptional()
  notes?: string;
} 