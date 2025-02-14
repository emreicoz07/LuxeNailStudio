import { Controller, Get, Query, Param, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServiceCategory } from '../bookings/enums/service-category.enum';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getServices(@Query('category') category?: string) {
    try {
      let serviceCategory: ServiceCategory | undefined;
      
      if (category) {
        const normalizedCategory = category.toUpperCase();
        if (normalizedCategory in ServiceCategory) {
          serviceCategory = ServiceCategory[normalizedCategory as keyof typeof ServiceCategory];
        } else {
          throw new NotFoundException(`Category ${category} not found`);
        }
      }

      const services = await this.servicesService.findAll(serviceCategory);
      return {
        success: true,
        data: services,
        count: services.length
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch services');
    }
  }

  @Get(':id/addons')
  async getServiceAddons(@Param('id') serviceId: string) {
    try {
      const addons = await this.servicesService.findAddons(serviceId);
      return {
        success: true,
        data: addons,
        count: addons.length
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Failed to fetch addons');
    }
  }
} 