import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking, BookingDocument, BookingStatus } from './schemas/booking.schema';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
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
        },
      });
    } catch (error) {
      console.error('Failed to send booking confirmation email:', error);
      // Don't throw the error as we don't want to roll back the booking creation
    }
  }

  async findOne(id: string, userId: string): Promise<AppointmentDocument> {
    const booking = await this.appointmentModel.findById(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (booking.userId.toString() !== userId) {
      throw new UnauthorizedException();
    }
    return booking;
  }

  async cancel(id: string, userId: string): Promise<AppointmentDocument> {
    const booking = await this.findOne(id, userId);
    if (booking.status === 'CANCELLED') {
      throw new Error('Booking is already cancelled');
    }
    booking.status = 'CANCELLED';
    return booking.save();
  }
} 