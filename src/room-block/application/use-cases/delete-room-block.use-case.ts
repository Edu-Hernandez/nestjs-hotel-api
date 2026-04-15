import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../../property/domain/repositories/property.repository';
import {
  ROOM_REPOSITORY,
  type RoomRepository,
} from '../../../room/domain/repositories/room.repository';
import {
  ROOM_BLOCK_REPOSITORY,
  type RoomBlockRepository,
} from '../../domain/repositories/room-block.repository';

@Injectable()
export class DeleteRoomBlockUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: RoomRepository,
    @Inject(ROOM_BLOCK_REPOSITORY)
    private readonly roomBlockRepository: RoomBlockRepository,
  ) {}

  async execute(
    propertyId: string,
    roomId: string,
    blockId: string,
  ): Promise<void> {
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
    const removed = await this.roomBlockRepository.deleteBlock(
      blockId,
      roomId,
      propertyId,
    );
    if (removed === 0) {
      throw new NotFoundException('Room block not found');
    }
  }
}
