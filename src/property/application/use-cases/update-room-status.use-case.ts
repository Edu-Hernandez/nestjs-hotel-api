import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Room } from '../../domain/entities/room.entity';
import type { RoomOperationalStatus } from '../../domain/room-operational-status';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../domain/repositories/property.repository';

export type UpdateRoomStatusInput = {
  propertyId: string;
  roomId: string;
  operationalStatus: RoomOperationalStatus;
};

@Injectable()
export class UpdateRoomStatusUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
  ) {}

  async execute(input: UpdateRoomStatusInput): Promise<Room> {
    const room = await this.propertyRepository.findRoomByIdAndProperty(
      input.roomId,
      input.propertyId,
    );
    if (!room) {
      throw new NotFoundException(
        `Room ${input.roomId} not found for property ${input.propertyId}`,
      );
    }
    const updated = room.withOperationalStatus(input.operationalStatus);
    await this.propertyRepository.updateRoom(updated);
    return updated;
  }
}
