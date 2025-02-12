import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';
import { StripeModule } from '../stripe/stripe.module';
import { AuthModule } from '../auth/auth.module';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { EmailModule } from '../email/email.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Booking.name, schema: BookingSchema }
    ]),
    StripeModule,
    AuthModule,
    EmailModule,
    ConfigModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService]
})
export class BookingsModule {} 