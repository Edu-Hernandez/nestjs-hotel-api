import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../../property/domain/repositories/property.repository';
import {
  ROOM_REPOSITORY,
  type RoomRepository,
} from '../../../room/domain/repositories/room.repository';
import type { RoomBlock } from '../../domain/entities/room-block.entity';
import {
  ROOM_BLOCK_REPOSITORY,
  type RoomBlockRepository,
} from '../../domain/repositories/room-block.repository';

@Injectable()
export class ListRoomBlocksUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: RoomRepository,
    @Inject(ROOM_BLOCK_REPOSITORY)
    private readonly roomBlockRepository: RoomBlockRepository,
  ) {}

  async execute(propertyId: string, roomId: string): Promise<RoomBlock[]> {
    const property = await this.propertyRepository.findPropertyById(propertyId);
    if (!property) {
      throw new NotFoundException(`Property ${propertyId} not found`);
    }
    const room = await this.roomRepository.findRoomByIdAndProperty(
      roomId,
      propertyId,
    );
    if (!room) {
      throw new NotFoundException(`Room ${roomId} not found for this property`);
    }
    return this.roomBlockRepository.findBlocksByRoom(roomId, propertyId);
  }
}
