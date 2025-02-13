import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private connection: Connection) {}

  @Get()
  async checkHealth() {
    try {
      const state = this.connection.readyState;
      
      if (!this.connection.db) {
        return {
          status: 'error',
          message: 'Database connection not initialized'
        };
      }

      const collections = await this.connection.db.listCollections().toArray();
      
      return {
        status: 'ok',
        database: {
          state: state === 1 ? 'connected' : 'disconnected',
          collections: collections.map(c => c.name),
        }
      };
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
} 