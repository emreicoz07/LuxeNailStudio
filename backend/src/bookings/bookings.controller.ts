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
  UnauthorizedException,
  Query
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
@UseGuards(JwtAuthGuard)
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
      if (!req.user?.userId) {
        throw new UnauthorizedException('User not authenticated');
      }

      this.logger.debug(`Creating booking for user: ${req.user.userId}, service: ${createBookingDto.serviceId}`);
      
      const service = await this.serviceModel.findById(createBookingDto.serviceId);
      if (!service) {
        throw new NotFoundException('Service not found');
      }

      const booking = await this.bookingsService.create(createBookingDto, req.user);
      
      return booking;
    } catch (error) {
      this.logger.error(`Error creating booking: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id')
  async getBooking(@Request() req: RequestWithUser, @Param('id') id: string) {
    this.logger.debug(`Getting booking ${id} for user ${req.user?.userId}`);
    
    if (!req.user?.userId) {
      this.logger.error('User not found in request');
      throw new UnauthorizedException('User not authenticated');
    }

    try {
      const booking = await this.bookingsService.findOne(id, req.user.userId);
      return booking;
    } catch (error) {
      this.logger.error(`Error getting booking: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Put(':id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelBooking(@Request() req: RequestWithUser, @Param('id') id: string) {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedException('User not authenticated');
      }

      const booking = await this.bookingsService.cancel(id, req.user.userId);
      
      if (booking.paymentId && booking.paymentStatus !== 'UNPAID') {
        await this.stripeService.createRefund(booking.paymentId);
      }
      
      return booking;
    } catch (error) {
      this.logger.error(`Error canceling booking: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('service/:id/status')
  async checkServiceStatus(@Param('id') serviceId: string) {
    try {
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
    } catch (error) {
      this.logger.error(`Error checking service status: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('available-slots')
  async getAvailableTimeSlots(
    @Query('date') date: string,
    @Query('employeeId') employeeId: string,
    @Query('serviceId') serviceId: string,
  ) {
    try {
      return this.bookingsService.getAvailableTimeSlots(date, employeeId, serviceId);
    } catch (error) {
      this.logger.error(`Error getting available time slots: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('working-hours')
  async getWorkingHours() {
    try {
      return this.bookingsService.getWorkingHours();
    } catch (error) {
      this.logger.error(`Error getting working hours: ${error.message}`, error.stack);
      throw error;
    }
  }
} 