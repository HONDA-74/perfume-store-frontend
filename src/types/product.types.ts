/**
 * Product domain types.
 * Matches backend products module API contracts exactly.
 */

import type { BaseQueryParams } from './api.types';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  category?: Category;
  brandId: string;
  brand?: Brand;
  description: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  gender: FragranceGender;
  concentration: FragranceConcentration;
  sizeMl: number;
  notes: ProductNotes;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  ratingAverage: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductNotes {
  top: string[];
  middle: string[];
  base: string[];
}

export enum FragranceConcentration {
  PARFUM = 'PARFUM',
  EDP = 'EDP',
  EDT = 'EDT',
  EDC = 'EDC',
}

export enum FragranceGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  UNISEX = 'UNISEX',
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  countryOfOrigin?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandDto {
  name: string;
  description?: string;
  logoUrl?: string;
  countryOfOrigin?: string;
}

export type UpdateBrandDto = Partial<CreateBrandDto>;

export interface CreateCategoryDto {
  name: string;
  description?: string;
  imageUrl?: string;
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>;

/**
 * Query parameters for product listing.
 */
export interface ProductQueryParams extends BaseQueryParams {
  brandId?: string;
  categoryId?: string;
  gender?: FragranceGender;
  concentration?: FragranceConcentration;
  minPrice?: number;
  maxPrice?: number;
  sizeMl?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  search?: string;
}

/**
 * Create/Update product payload (admin only).
 */
export interface CreateProductDto {
  name: string;
  description: string;
  brandId: string;
  categoryId: string;
  price: number;
  discountPrice?: number;
  sku: string;
  stockQuantity: number;
  notes: ProductNotes;
  concentration: FragranceConcentration;
  sizeMl: number;
  gender: FragranceGender;
  images?: string[];
  isFeatured?: boolean;
}

export type UpdateProductDto = Partial<CreateProductDto>

/**
 * Update product stock payload (admin only).
 */
export interface UpdateStockDto {
  stockQuantity: number;
}
