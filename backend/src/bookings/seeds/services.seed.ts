import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service } from '../schemas/service.schema';
import { Category } from '../schemas/category.schema';
import { ServiceCategory } from '../enums/service-category.enum';
import { CategoryDocument } from '../schemas/category.schema';

@Injectable()
export class ServicesSeedService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<Service>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>
  ) {}

  async seed() {
    const categories = await this.createCategories();
    if (!categories) {
      throw new Error('Failed to create categories');
    }
    await this.createServices(categories);
  }

  private async createCategories(): Promise<{ 
    manicure: CategoryDocument; 
    pedicure: CategoryDocument; 
    nailArt: CategoryDocument; 
    special: CategoryDocument; 
  } | null> {
    try {
      await this.categoryModel.deleteMany({});

      const categoriesToCreate = [
        {
          name: 'Manicure Services',
          description: 'Professional manicure treatments',
          slug: 'manicure-services',
          order: 1,
        },
        {
          name: 'Pedicure Services',
          description: 'Professional pedicure treatments',
          slug: 'pedicure-services',
          order: 2,
        },
        {
          name: 'Nail Art',
          description: 'Creative nail art services',
          slug: 'nail-art',
          order: 3,
        },
        {
          name: 'Special Services',
          description: 'Special nail care treatments',
          slug: 'special-services',
          order: 4,
        },
      ];

      const createdCategories = await this.categoryModel.create(categoriesToCreate);
      return {
        manicure: createdCategories[0],
        pedicure: createdCategories[1],
        nailArt: createdCategories[2],
        special: createdCategories[3],
      };
    } catch (error) {
      console.error('Error creating categories:', error);
      return null;
    }
  }

  private async createServices(categories: {
    manicure: CategoryDocument;
    pedicure: CategoryDocument;
    nailArt: CategoryDocument;
    special: CategoryDocument;
  }) {
    try {
      await this.serviceModel.deleteMany({});

      const servicesToCreate = [
        // Manicure Services
        {
          name: 'Basic Manicure',
          description: 'Classic manicure treatment with regular polish',
          price: 25.00,
          duration: 30,
          deposit: 7.50,
          category: categories.manicure.id,
          serviceCategory: ServiceCategory.MANICURE,
        },
        {
          name: 'Manicure + Normal Polish',
          description: 'Full manicure with normal polish application',
          price: 35.00,
          duration: 60,
          deposit: 9.50,
          category: categories.manicure.id,
          serviceCategory: ServiceCategory.MANICURE,
        },
        {
          name: 'Manicure + Gel Polish',
          description: 'Full manicure with gel polish application',
          price: 45.00,
          duration: 75,
          deposit: 14.00,
          category: categories.manicure.id,
          serviceCategory: ServiceCategory.MANICURE,
        },
        
        // Pedicure Services
        {
          name: 'Basic Pedicure',
          description: 'Classic pedicure treatment',
          price: 45.00,
          duration: 45,
          deposit: 15.00,
          category: categories.pedicure.id,
          serviceCategory: ServiceCategory.PEDICURE,
        },
        {
          name: 'Luxury Spa Pedicure',
          description: 'Premium pedicure with extended massage',
          price: 65.00,
          duration: 60,
          deposit: 20.00,
          category: categories.pedicure.id,
          serviceCategory: ServiceCategory.PEDICURE,
        },

        // Nail Art Services
        {
          name: 'Basic Nail Art',
          description: 'Simple nail art designs',
          price: 15.00,
          duration: 30,
          deposit: 5.00,
          category: categories.nailArt.id,
          serviceCategory: ServiceCategory.NAIL_ART,
        },
        
        // Special Services
        {
          name: 'Bridal Package',
          description: 'Complete nail care package for brides',
          price: 120.00,
          duration: 120,
          deposit: 40.00,
          category: categories.special.id,
          serviceCategory: ServiceCategory.SPECIAL,
        },
      ];

      await this.serviceModel.create(servicesToCreate);
    } catch (error) {
      console.error('Error creating services:', error);
      throw error;
    }
  }
} 