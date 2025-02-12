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
import { AuthMiddleware } from '../middleware/auth';
import { CreateBookingDto } from './dto/create-booking.dto';
import { StripeService } from '../stripe/stripe.service';

// Add this interface to define the Request type
interface RequestWithUser extends Request {
  user: {
    id: string;
    [key: string]: any;
  };
}

@Controller('bookings')
@UseGuards(AuthMiddleware)
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly stripeService: StripeService
  ) {}

  @Post()
  async createBooking(@Request() req: RequestWithUser, @Body() createBookingDto: CreateBookingDto) {
    // Create payment intent first
    const paymentIntent = await this.stripeService.createPaymentIntent({
      amount: createBookingDto.depositAmount || createBookingDto.amount,
      currency: 'usd',
    });

    // Create booking with payment intent ID
    return this.bookingsService.create({
      ...createBookingDto,
      userId: req.user.id,
      paymentId: paymentIntent.id,
      paymentStatus: 'UNPAID'
    });
  }

  @Get(':id')
  async getBooking(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.bookingsService.findOne(id, req.user.id);
  }

  @Put(':id/cancel')
  async cancelBooking(@Request() req: RequestWithUser, @Param('id') id: string) {
    const booking = await this.bookingsService.cancel(id, req.user.id);
    
    // If payment was made, process refund
    if (booking.paymentId && booking.paymentStatus !== 'UNPAID') {
      await this.stripeService.createRefund(booking.paymentId);
    }
    
    return booking;
  }
} 