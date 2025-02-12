import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment } from './schemas/appointment.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking, BookingDocument, BookingStatus } from './schemas/booking.schema';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { addDays } from 'date-fns';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async create(createBookingDto: CreateBookingDto & { userId: string; userEmail: string; userName: string }) {
    try {
      // Validate ObjectId format before conversion
      if (!Types.ObjectId.isValid(createBookingDto.userId) || 
          !Types.ObjectId.isValid(createBookingDto.serviceId)) {
        throw new Error('Invalid ID format');
      }

      // Convert string IDs to ObjectIds
      const bookingData = {
        ...createBookingDto,
        userId: new Types.ObjectId(createBookingDto.userId),
        serviceId: new Types.ObjectId(createBookingDto.serviceId),
        dateTime: new Date(createBookingDto.appointmentDate),
        status: BookingStatus.PENDING,
        paymentStatus: createBookingDto.paymentStatus || 'UNPAID',
        totalAmount: createBookingDto.amount,
        depositAmount: createBookingDto.depositAmount || 0,
      };

      const newBooking = new this.bookingModel(bookingData);
      const savedBooking = await newBooking.save();

      // Send confirmation email
      await this.sendBookingConfirmationEmail(
        createBookingDto.userEmail,
        createBookingDto.userName,
        savedBooking
      );

      return savedBooking;
    } catch (error) {
      if (error.message === 'Invalid ID format') {
        throw new Error('Invalid booking data: malformed ID');
      }
      throw new Error(`Failed to create booking: ${error.message}`);
    }
  }

  private async sendBookingConfirmationEmail(
    email: string,
    name: string,
    booking: BookingDocument
  ): Promise<void> {
    try {
      // Populate the service details directly from the booking
      const populatedBooking = await this.bookingModel
        .findById(booking._id)
        .populate('serviceId', 'name')
        .exec();

      const serviceName = populatedBooking?.serviceId?.name || 'Service';

      await this.emailService.sendBookingConfirmationEmail({
        email,
        name,
        bookingDetails: {
          id: booking._id?.toString() || booking.id,
          dateTime: booking.dateTime,
          totalAmount: booking.totalAmount,
          depositAmount: booking.depositAmount,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          serviceName: serviceName,
        },
      });
    } catch (error) {
      console.error('Failed to send booking confirmation email:', error);
      // Don't throw the error as we don't want to roll back the booking creation
    }
  }

  async findOne(id: string, userId: string): Promise<BookingDocument> {
    const booking = await this.bookingModel.findById(id)
      .populate('userId')
      .populate('serviceId');
      
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    
    if (booking.userId.toString() !== userId) {
      throw new UnauthorizedException();
    }
    
    return booking;
  }

  async cancel(id: string, userId: string, reason?: string): Promise<BookingDocument> {
    const booking = await this.findOne(id, userId);
    if (booking.status === BookingStatus.CANCELED) {
      throw new Error('Booking is already cancelled');
    }
    
    booking.status = BookingStatus.CANCELED;
    booking.cancelReason = reason;
    const updatedBooking = await booking.save();
    
    // Send cancellation email
    await this.emailService.sendBookingCancellationEmail(updatedBooking);
    
    return updatedBooking;
  }

  // Cron job to send reminder emails
  @Cron('0 12 * * *') // Run at 12:00 PM every day
  async sendReminderEmails() {
    try {
      const tomorrow = addDays(new Date(), 1);
      const bookings = await this.bookingModel
        .find({
          dateTime: {
            $gte: tomorrow,
            $lt: addDays(tomorrow, 1)
          },
          status: BookingStatus.CONFIRMED,
          reminderSent: false
        })
        .populate('userId')
        .populate('serviceId');

      this.logger.log(`Found ${bookings.length} bookings for tomorrow's reminders`);

      for (const booking of bookings) {
        await this.emailService.sendBookingReminderEmail(booking);
        booking.reminderSent = true;
        await booking.save();
      }
    } catch (error) {
      this.logger.error('Failed to send reminder emails:', error);
    }
  }
} 