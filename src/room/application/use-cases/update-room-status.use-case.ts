import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Room } from '../../domain/entities/room.entity';
import type { RoomOperationalStatus } from '../../domain/room-operational-status';
import {
  ROOM_REPOSITORY,
  type RoomRepository,
} from '../../domain/repositories/room.repository';

export type UpdateRoomStatusInput = {
  propertyId: string;
  roomId: string;
  operationalStatus: RoomOperationalStatus;
};

@Injectable()
export class UpdateRoomStatusUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: RoomRepository,
  ) {}

  async execute(input: UpdateRoomStatusInput): Promise<Room> {
    const room = await this.roomRepository.findRoomByIdAndProperty(
      input.roomId,
      input.propertyId,
    );
    if (!room) {
      throw new NotFoundException(
        `Room ${input.roomId} not found for property ${input.propertyId}`,
      );
    }
    const updated = room.withOperationalStatus(input.operationalStatus);
    await this.roomRepository.updateRoom(updated);
    return updated;
  }
}
