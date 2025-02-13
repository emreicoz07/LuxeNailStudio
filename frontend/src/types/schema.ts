import { Document } from 'mongoose';

export enum UserRole {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export enum ServiceCategory {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  MANICURE = 'MANICURE',
  PEDICURE = 'PEDICURE',
  NAIL_ART = 'NAIL_ART',
  SPECIAL = 'SPECIAL'
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: {
    id: string;
    name: string;
  };
  serviceCategory: ServiceCategory;
  imageUrl?: string;
  isActive: boolean;
  deposit: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  imageUrl?: string;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  userId: string;
  serviceId: string;
  dateTime: Date;
  status: string;
  totalAmount: number;
  depositAmount: number;
  paymentStatus: string;
  cancelReason?: string;
  addOns?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Request Types
export interface CreateAppointmentDto {
  serviceId: string;
  dateTime: Date;
  addOnIds?: string[];
}

export interface UpdateAppointmentDto {
  status?: string;
  dateTime?: Date;
  addOnIds?: string[];
  cancelReason?: string;
}

export interface CreateServiceDto {
  name: string;
  description: string;
  duration: number;
  price: number;
  category: ServiceCategory;
  imageUrl?: string;
  deposit?: number;
}

export interface UpdateServiceDto extends Partial<CreateServiceDto> {
  isActive?: boolean;
} 