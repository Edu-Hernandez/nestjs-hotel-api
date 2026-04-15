import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { RoomType } from '../../domain/entities/room-type.entity';
import {
  ROOM_TYPE_REPOSITORY,
  type RoomTypeRepository,
} from '../../domain/repositories/room-type.repository';

export type UpdateRoomTypeInput = {
  propertyId: string;
  roomTypeId: string;
  name?: string;
  description?: string | null;
  maxAdults?: number;
  maxChildren?: number;
  sortOrder?: number;
};

@Injectable()
export class UpdateRoomTypeUseCase {
  constructor(
    @Inject(ROOM_TYPE_REPOSITORY)
    private readonly roomTypeRepository: RoomTypeRepository,
  ) {}

  async execute(input: UpdateRoomTypeInput): Promise<RoomType> {
    const existing = await this.roomTypeRepository.findRoomTypeByIdAndProperty(
      input.roomTypeId,
      input.propertyId,
    );
    if (!existing) {
      throw new NotFoundException(
        `Room type ${input.roomTypeId} not found for this property`,
      );
    }
    const updated = existing.withUpdates(input);
    await this.roomTypeRepository.updateRoomType(updated);
    return updated;
  }
}
