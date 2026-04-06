import { Inject, Injectable } from '@nestjs/common';
import type { Property } from '../../domain/entities/property.entity';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../domain/repositories/property.repository';

@Injectable()
export class ListPropertiesUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
  ) {}

  async execute(): Promise<Property[]> {
    return this.propertyRepository.findAllProperties();
  }
}
