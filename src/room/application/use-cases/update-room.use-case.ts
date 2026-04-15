import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Room } from '../../domain/entities/room.entity';
import {
  ROOM_TYPE_REPOSITORY,
  type RoomTypeRepository,
} from '../../../room-type/domain/repositories/room-type.repository';
import {
  ROOM_REPOSITORY,
  type RoomRepository,
} from '../../domain/repositories/room.repository';

export type UpdateRoomInput = {
  propertyId: string;
  roomId: string;
  roomTypeId?: string;
  number?: string;
  floor?: string | null;
  notes?: string | null;
};

@Injectable()
export class UpdateRoomUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: RoomRepository,
    @Inject(ROOM_TYPE_REPOSITORY)
    private readonly roomTypeRepository: RoomTypeRepository,
  ) {}

  async execute(input: UpdateRoomInput): Promise<Room> {
    const existing = await this.roomRepository.findRoomByIdAndProperty(
      input.roomId,
      input.propertyId,
    );
    if (!existing) {
      throw new NotFoundException(
        `Room ${input.roomId} not found for this property`,
      );
    }
    if (input.roomTypeId) {
      const rt = await this.roomTypeRepository.findRoomTypeByIdAndProperty(
        input.roomTypeId,
        input.propertyId,
      );
      if (!rt) {
        throw new NotFoundException(
          `Room type ${input.roomTypeId} not found for this property`,
        );
      }
    }
    const updated = existing.withLayout({
      roomTypeId: input.roomTypeId,
      number: input.number,
      floor: input.floor,
      notes: input.notes,
    });
    await this.roomRepository.updateRoom(updated);
    return updated;
  }
}
