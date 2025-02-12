import { Command, CommandRunner } from 'nest-commander';
import { ServicesSeedService } from '../seeds/services.seed';

@Command({ name: 'seed-services', description: 'Seed services and categories' })
export class SeedServicesCommand extends CommandRunner {
  constructor(private readonly seedService: ServicesSeedService) {
    super();
  }

  async run(): Promise<void> {
    try {
      await this.seedService.seed();
      console.log('Services and categories seeded successfully');
    } catch (error) {
      console.error('Failed to seed services:', error);
      process.exit(1);
    }
  }
} 