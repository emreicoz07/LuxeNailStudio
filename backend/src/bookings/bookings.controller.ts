import { 
  Controller, 
  Post, 
  Get, 
  Put, 
  Body, 
  Param, 
  UseGuards,
  Request,
  NotFoundException,
  Logger,
  UnauthorizedException
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { StripeService } from '../stripe/stripe.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/auth.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from './schemas/service.schema';

@Controller('bookings')
export class BookingsController {
  private readonly logger = new Logger(BookingsController.name);

  constructor(
    private readonly bookingsService: BookingsService,
    private readonly stripeService: StripeService,
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req: RequestWithUser, @Body() createBookingDto: CreateBookingDto) {
    try {
      if (!req.user) {
        throw new UnauthorizedException('User not authenticated');
      }

      this.logger.debug(`Creating booking for user: ${req.user.userId}, service: ${createBookingDto.serviceId}`);
      
      // Verify service exists before creating booking
      const service = await this.serviceModel.findById(createBookingDto.serviceId);
      if (!service) {
        throw new NotFoundException('Service not found');
      }

      // Pass both the booking data and the user to the service
      const booking = await this.bookingsService.create(createBookingDto, req.user);
      
      return booking;
    } catch (error) {
      this.logger.error(`Error creating booking: ${error.message}`, error.stack);
      
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Please log in to make a booking');
      }
      
      throw error;
    }
  }

  @Get(':id')
  async getBooking(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.bookingsService.findOne(id, req.user._id.toString());
  }

  @Put(':id/cancel')
  async cancelBooking(@Request() req: RequestWithUser, @Param('id') id: string) {
    const booking = await this.bookingsService.cancel(id, req.user._id.toString());
    
    // If payment was made, process refund
    if (booking.paymentId && booking.paymentStatus !== 'UNPAID') {
      await this.stripeService.createRefund(booking.paymentId);
    }
    
    return booking;
  }

  @Get('service/:id/status')
  async checkServiceStatus(@Param('id') serviceId: string) {
    const service = await this.serviceModel.findById(serviceId);
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return {
      id: service._id,
      name: service.name,
      isActive: service.isActive,
      exists: true
    };
  }
} 