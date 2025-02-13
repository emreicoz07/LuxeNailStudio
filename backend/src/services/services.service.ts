import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from './schemas/service.schema';
import { ServiceCategory } from '../bookings/enums/service-category.enum';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
  ) {}

  async findAll(category?: ServiceCategory): Promise<Service[]> {
    const query = category ? {
      category: { $regex: new RegExp(`^${category}$`, 'i') },
      isActive: true
    } : {
      isActive: true
    };
    
    console.log('MongoDB query:', query);
    
    const services = await this.serviceModel.find(query).exec();
    console.log('Found services:', services);
    
    return services;
  }

  async findById(id: string): Promise<Service> {
    const service = await this.serviceModel.findOne({ _id: id, isActive: true }).exec();
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }
} 