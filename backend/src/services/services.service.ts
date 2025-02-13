import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from './schemas/service.schema';
import { Addon, AddonDocument } from './schemas/addon.schema';
import { ServiceCategory } from '../bookings/enums/service-category.enum';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);

  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    @InjectModel(Addon.name) private addonModel: Model<AddonDocument>,
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

  async findAddons(serviceId: string): Promise<Addon[]> {
    try {
      // First get the service to check its category
      const service = await this.serviceModel.findById(serviceId).exec();
      if (!service) {
        throw new NotFoundException('Service not found');
      }

      this.logger.debug(`Finding addons for service ${serviceId} with category ${service.category}`);

      // Find addons that match either the service category or 'both'
      const addons = await this.addonModel.find({
        $and: [
          { isActive: true },
          {
            $or: [
              { category: service.category },
              { category: 'both' }
            ]
          }
        ]
      }).exec();

      this.logger.debug(`Found ${addons.length} addons for service ${serviceId}`);

      return addons;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error finding addons: ${error.message}`);
      throw new InternalServerErrorException('Failed to fetch addons');
    }
  }

  async findById(id: string): Promise<Service> {
    const service = await this.serviceModel.findOne({ _id: id, isActive: true }).exec();
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }
} 