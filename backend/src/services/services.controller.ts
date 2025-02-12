import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { AuthMiddleware } from '../middleware/auth';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getAllServices() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  async getServiceById(@Param('id') id: string) {
    return this.servicesService.findById(id);
  }
} 