import { Inject, Injectable } from '@nestjs/common';
import { Property } from '../../domain/entities/property.entity';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../domain/repositories/property.repository';

export type CreatePropertyInput = {
  name: string;
  legalName?: string | null;
  taxId?: string | null;
  email?: string | null;
  phone?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  country: string;
  timezone?: string;
};

@Injectable()
export class CreatePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
  ) {}

  async execute(input: CreatePropertyInput): Promise<Property> {
    const property = Property.create(input);
    await this.propertyRepository.saveProperty(property);
    return property;
  }
}
