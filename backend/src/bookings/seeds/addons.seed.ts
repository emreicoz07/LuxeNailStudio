import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddOn } from '../schemas/addon.schema';

@Injectable()
export class AddOnsSeeder {
  constructor(
    @InjectModel(AddOn.name) private addOnModel: Model<AddOn>,
  ) {}

  async seed() {
    const addOns = [
      {
        name: 'Nail Arts',
        description: 'Custom nail art designs (from 2 euro each)',
        price: 2,
        duration: 10,
      },
      {
        name: 'French/Ombre',
        description: 'French or ombre nail design',
        price: 5,
        duration: 20,
      },
      {
        name: 'Take off gel polish',
        description: 'Removal of existing gel polish',
        price: 10,
        duration: 15,
      },
      {
        name: 'Take off hard gel',
        description: 'Removal of existing hard gel',
        price: 12,
        duration: 20,
      },
      {
        name: 'Take off acrylic',
        description: 'Removal of existing acrylic',
        price: 12,
        duration: 30,
      },
      {
        name: 'Nail effects (Magnetic)',
        description: 'Special magnetic nail effects',
        price: 5,
        duration: 15,
      },
    ];

    // Clear existing add-ons
    await this.addOnModel.deleteMany({});

    // Insert new add-ons
    await this.addOnModel.insertMany(addOns);
  }
} 