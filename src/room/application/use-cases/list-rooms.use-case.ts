import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../../property/domain/repositories/property.repository';
import type { Room } from '../../domain/entities/room.entity';
import {
  ROOM_REPOSITORY,
  type RoomRepository,
} from '../../domain/repositories/room.repository';

@Injectable()
export class ListRoomsUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: RoomRepository,
  ) {}

  async execute(propertyId: string): Promise<Room[]> {
    const property = await this.propertyRepository.findPropertyById(propertyId);
    if (!property) {
      throw new NotFoundException(`Property ${propertyId} not found`);
    }
    return this.roomRepository.findRoomsByPropertyId(propertyId);
  }
}
