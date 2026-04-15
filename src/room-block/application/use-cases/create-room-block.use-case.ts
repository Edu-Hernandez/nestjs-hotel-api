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
import { RoomBlock } from '../../domain/entities/room-block.entity';
import {
  ROOM_BLOCK_REPOSITORY,
  type RoomBlockRepository,
} from '../../domain/repositories/room-block.repository';
import {
  isBeforeDay,
  parseDateOnly,
} from '../../../reservation/application/date-only';

export type CreateRoomBlockInput = {
  propertyId: string;
  roomId: string;
  startDate: string;
  endDate: string;
  reason?: string | null;
};

@Injectable()
export class CreateRoomBlockUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: RoomRepository,
    @Inject(ROOM_BLOCK_REPOSITORY)
    private readonly roomBlockRepository: RoomBlockRepository,
  ) {}

  async execute(input: CreateRoomBlockInput): Promise<RoomBlock> {
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
    const start = parseDateOnly(input.startDate);
    const end = parseDateOnly(input.endDate);
    if (!isBeforeDay(start, end)) {
      throw new BadRequestException(
        'startDate must be strictly before endDate',
      );
    }
    const overlaps = await this.roomBlockRepository.roomHasOverlappingBlock(
      input.roomId,
      start,
      end,
    );
    if (overlaps) {
      throw new ConflictException(
        'Room already has a block overlapping these dates',
      );
    }
    const block = RoomBlock.create({
      roomId: input.roomId,
      startDate: start,
      endDate: end,
      reason: input.reason ?? null,
    });
    await this.roomBlockRepository.saveBlock(block);
    return block;
  }
}
