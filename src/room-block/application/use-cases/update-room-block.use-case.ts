import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import {
  isBeforeDay,
  parseDateOnly,
} from '../../../reservation/application/date-only';

export type UpdateRoomBlockInput = {
  propertyId: string;
  roomId: string;
  blockId: string;
  startDate?: string;
  endDate?: string;
  reason?: string | null;
};

@Injectable()
export class UpdateRoomBlockUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: RoomRepository,
    @Inject(ROOM_BLOCK_REPOSITORY)
    private readonly roomBlockRepository: RoomBlockRepository,
  ) {}

  async execute(input: UpdateRoomBlockInput): Promise<RoomBlock> {
    const property = await this.propertyRepository.findPropertyById(
      input.propertyId,
    );
    if (!property) {
      throw new NotFoundException(`Property ${input.propertyId} not found`);
    }
    const room = await this.roomRepository.findRoomByIdAndProperty(
      input.roomId,
      input.propertyId,
    );
    if (!room) {
      throw new NotFoundException(
        `Room ${input.roomId} not found for this property`,
      );
    }
    const existing = await this.roomBlockRepository.findBlockByIdAndRoom(
      input.blockId,
      input.roomId,
      input.propertyId,
    );
    if (!existing) {
      throw new NotFoundException('Room block not found');
    }
    const start =
      input.startDate !== undefined
        ? parseDateOnly(input.startDate)
        : existing.startDate;
    const end =
      input.endDate !== undefined
        ? parseDateOnly(input.endDate)
        : existing.endDate;
    if (!isBeforeDay(start, end)) {
      throw new BadRequestException(
        'startDate must be strictly before endDate',
      );
    }
    const overlaps = await this.roomBlockRepository.roomHasOverlappingBlock(
      input.roomId,
      start,
      end,
      input.blockId,
    );
    if (overlaps) {
      throw new ConflictException(
        'Room already has another block overlapping these dates',
      );
    }
    const updated = existing.withUpdates({
      startDate: input.startDate !== undefined ? start : undefined,
      endDate: input.endDate !== undefined ? end : undefined,
      reason: input.reason,
    });
    await this.roomBlockRepository.updateBlock(updated);
    return updated;
  }
}
