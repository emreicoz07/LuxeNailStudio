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

// Add this interface to define the Request type
interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
    name: string;
  };
}

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly stripeService: StripeService
  ) {}

  @Post()
  async createBooking(@Request() req: RequestWithUser, @Body() createBookingDto: CreateBookingDto) {
    // Ensure user exists in request
    if (!req.user || !req.user.userId) {
      throw new Error('User not authenticated');
    }

    // Create payment intent first
    const paymentIntent = await this.stripeService.createPaymentIntent({
      amount: createBookingDto.depositAmount || createBookingDto.amount,
      currency: 'usd',
    });

    // Create booking with payment intent ID and user details
    return this.bookingsService.create({
      ...createBookingDto,
      userId: req.user.userId,
      userEmail: req.user.email,
      userName: req.user.name,
      paymentId: paymentIntent.id,
      paymentStatus: 'UNPAID'
    });
  }

  @Get(':id')
  async getBooking(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.bookingsService.findOne(id, req.user.userId);
  }

  @Put(':id/cancel')
  async cancelBooking(@Request() req: RequestWithUser, @Param('id') id: string) {
    const booking = await this.bookingsService.cancel(id, req.user.userId);
    
    // If payment was made, process refund
    if (booking.paymentId && booking.paymentStatus !== 'UNPAID') {
      await this.stripeService.createRefund(booking.paymentId);
    }
    
    return booking;
  }
} 