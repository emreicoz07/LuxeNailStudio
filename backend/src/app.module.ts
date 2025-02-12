import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';
import { StripeModule } from './stripe/stripe.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        const options = {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          retryWrites: true,
          dbName: 'nail-studio',
        };
        
        Logger.log(`Attempting to connect to MongoDB nail-studio database`);
        
        return {
          uri: uri || 'mongodb://localhost:27017/nail-studio',
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
})
export class AppModule {} 