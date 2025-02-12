import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
  ) {}

  async create(bookingData: CreateBookingDto & { userId: string, paymentId: string, paymentStatus: string }): Promise<AppointmentDocument> {
    const newBooking = new this.appointmentModel({
      ...bookingData,
      status: 'PENDING'
    });
    return newBooking.save();
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