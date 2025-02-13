import { Controller, Get, Query, Param, NotFoundException } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServiceCategory } from '../bookings/enums/service-category.enum';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getServices(@Query('category') category?: string) {
    // Convert category string to enum
    let serviceCategory: ServiceCategory | undefined;
    
    if (category) {
      // Convert to uppercase to match enum
      const normalizedCategory = category.toUpperCase();
      if (normalizedCategory in ServiceCategory) {
        serviceCategory = ServiceCategory[normalizedCategory as keyof typeof ServiceCategory];
      } else {
        throw new NotFoundException(`Category ${category} not found`);
      }
    }

    const services = await this.servicesService.findAll(serviceCategory);
    return services;
  }

  @Get(':id/addons')
  async getServiceAddons(@Param('id') serviceId: string) {
    try {
      const addons = await this.servicesService.findAddons(serviceId);
      return addons;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
} 