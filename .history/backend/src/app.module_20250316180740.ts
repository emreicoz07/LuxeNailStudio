import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';
import { StripeModule } from './stripe/stripe.module';
import { EmailModule } from './email/email.module';
import { ScheduleModule } from '@nestjs/schedule';
import * as mongoose from 'mongoose';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        if (!uri) {
          throw new Error('MONGODB_URI is not defined');
        }

        const options = {
          retryWrites: true,
          dbName: 'nail-studio',
        };
        
        try {
          const connection = await mongoose.connect(uri, options);
          Logger.log('Successfully connected to MongoDB');
          
          if (connection.connection.db) {
            const collections = await connection.connection.db.listCollections().toArray();
            Logger.log(`Available collections: ${collections.map(c => c.name).join(', ')}`);
          }
        } catch (error) {
          Logger.error(`Failed to connect to MongoDB: ${error.message}`);
          throw error;
        }
        
        return {
          uri,
          ...options
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    ServicesModule,
    BookingsModule,
    StripeModule,
    EmailModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {} 