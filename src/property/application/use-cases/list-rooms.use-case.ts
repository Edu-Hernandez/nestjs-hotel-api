import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Room } from '../../domain/entities/room.entity';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../domain/repositories/property.repository';

@Injectable()
export class ListRoomsUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
  ) {}

  async execute(propertyId: string): Promise<Room[]> {
    const property = await this.propertyRepository.findPropertyById(propertyId);
    if (!property) {
      throw new NotFoundException(`Property ${propertyId} not found`);
    }
    return this.propertyRepository.findRoomsByPropertyId(propertyId);
  }
}
