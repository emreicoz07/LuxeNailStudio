import { Command, CommandRunner } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { ServicesSeedService } from '../seeds/services.seed';
import { AddOnsSeeder } from '../seeds/addons.seed';

@Injectable()
@Command({ name: 'seed', description: 'Seed database with initial data' })
export class SeedCommand extends CommandRunner {
  constructor(
    private readonly servicesSeedService: ServicesSeedService,
    private readonly addOnsSeeder: AddOnsSeeder,
  ) {
    super();
  }

  async run(): Promise<void> {
    try {
      console.log('Starting data seeding...');
      await this.servicesSeedService.seed();
      await this.addOnsSeeder.seed();
      console.log('Data seeding completed successfully');
    } catch (error) {
      console.error('Error seeding data:', error);
      throw error;
    }
  }
} 