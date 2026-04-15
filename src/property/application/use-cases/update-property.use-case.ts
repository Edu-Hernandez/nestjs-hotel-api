import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Property } from '../../domain/entities/property.entity';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../domain/repositories/property.repository';

export type UpdatePropertyInput = {
  propertyId: string;
  name?: string;
  legalName?: string | null;
  taxId?: string | null;
  email?: string | null;
  phone?: string | null;
  addressLine1?: string;
  addressLine2?: string | null;
  city?: string;
  state?: string | null;
  postalCode?: string | null;
  country?: string;
  timezone?: string;
  isActive?: boolean;
};

@Injectable()
export class UpdatePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
  ) {}

  async execute(input: UpdatePropertyInput): Promise<Property> {
    const existing = await this.propertyRepository.findPropertyById(
      input.propertyId,
    );
    if (!existing) {
      throw new NotFoundException(`Property ${input.propertyId} not found`);
    }
    const updated = existing.withUpdates(input);
    await this.propertyRepository.saveProperty(updated);
    return updated;
  }
}
