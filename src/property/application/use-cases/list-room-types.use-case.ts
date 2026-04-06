import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { RoomType } from '../../domain/entities/room-type.entity';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../domain/repositories/property.repository';

@Injectable()
export class ListRoomTypesUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
  ) {}

  async execute(propertyId: string): Promise<RoomType[]> {
    const property = await this.propertyRepository.findPropertyById(propertyId);
    if (!property) {
      throw new NotFoundException(`Property ${propertyId} not found`);
    }
    return this.propertyRepository.findRoomTypesByPropertyId(propertyId);
  }
}
