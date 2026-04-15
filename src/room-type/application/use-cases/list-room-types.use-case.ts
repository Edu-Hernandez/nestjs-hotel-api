import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../../property/domain/repositories/property.repository';
import type { RoomType } from '../../domain/entities/room-type.entity';
import {
  ROOM_TYPE_REPOSITORY,
  type RoomTypeRepository,
} from '../../domain/repositories/room-type.repository';

@Injectable()
export class ListRoomTypesUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(ROOM_TYPE_REPOSITORY)
    private readonly roomTypeRepository: RoomTypeRepository,
  ) {}

  async execute(propertyId: string): Promise<RoomType[]> {
    const property = await this.propertyRepository.findPropertyById(propertyId);
    if (!property) {
      throw new NotFoundException(`Property ${propertyId} not found`);
    }
    return this.roomTypeRepository.findRoomTypesByPropertyId(propertyId);
  }
}
