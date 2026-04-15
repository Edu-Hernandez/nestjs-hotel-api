import type { Property } from '../entities/property.entity';

export const PROPERTY_REPOSITORY = Symbol('PROPERTY_REPOSITORY');

export interface PropertyRepository {
  saveProperty(property: Property): Promise<void>;
  findAllProperties(): Promise<Property[]>;
  findPropertyById(id: string): Promise<Property | null>;
}
