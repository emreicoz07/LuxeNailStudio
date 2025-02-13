import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Service, ServiceSchema } from './schemas/service.schema';
import { Category, CategorySchema } from './schemas/category.schema';
import { AddOn, AddOnSchema } from './schemas/addon.schema';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { StripeModule } from '../stripe/stripe.module';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';
import { ServicesSeedService } from './seeds/services.seed';
import { SeedCommand } from './commands/seed.command';
import { AddOnsSeeder } from './seeds/addons.seed';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: Category.name, schema: CategorySchema },
      { name: AddOn.name, schema: AddOnSchema },
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
    StripeModule,
    AuthModule,
    EmailModule,
    ConfigModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [BookingsController],
  providers: [
    BookingsService,
    ServicesSeedService,
    AddOnsSeeder,
    SeedCommand,
    {
      provide: 'SEED_DATA',
      useFactory: async (servicesSeedService: ServicesSeedService, addOnsSeeder: AddOnsSeeder) => {
        try {
          await servicesSeedService.seed();
          await addOnsSeeder.seed();
          console.log('Data seeding completed successfully');
        } catch (error) {
          console.error('Error seeding data:', error);
        }
      },
      inject: [ServicesSeedService, AddOnsSeeder],
    },
  ],
  exports: [BookingsService]
})
export class BookingsModule {} 