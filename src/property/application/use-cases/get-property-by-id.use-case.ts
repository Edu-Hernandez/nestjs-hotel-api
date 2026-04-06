import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Property } from '../../domain/entities/property.entity';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../domain/repositories/property.repository';

@Injectable()
export class GetPropertyByIdUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
  ) {}

  async execute(id: string): Promise<Property> {
    const property = await this.propertyRepository.findPropertyById(id);
    if (!property) {
      throw new NotFoundException(`Property ${id} not found`);
    }
    return property;
  }
}
