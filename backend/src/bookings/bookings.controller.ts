import { 
  Controller, 
  Post, 
  Get, 
  Put, 
  Body, 
  Param, 
  UseGuards,
  Request 
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { StripeService } from '../stripe/stripe.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/auth.interface';

@Controller('api/bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly stripeService: StripeService
  ) {}

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto, @Request() req: RequestWithUser) {
    return this.bookingsService.create(createBookingDto, req.user);
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
} 