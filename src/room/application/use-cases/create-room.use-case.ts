import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../../property/domain/repositories/property.repository';
import {
  ROOM_TYPE_REPOSITORY,
  type RoomTypeRepository,
} from '../../../room-type/domain/repositories/room-type.repository';
import { Room } from '../../domain/entities/room.entity';
import {
  ROOM_REPOSITORY,
  type RoomRepository,
} from '../../domain/repositories/room.repository';

export type CreateRoomInput = {
  propertyId: string;
  roomTypeId: string;
  number: string;
  floor?: string | null;
  notes?: string | null;
};

@Injectable()
export class CreateRoomUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(ROOM_TYPE_REPOSITORY)
    private readonly roomTypeRepository: RoomTypeRepository,
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: RoomRepository,
  ) {}

  async execute(input: CreateRoomInput): Promise<Room> {
    const property = await this.propertyRepository.findPropertyById(
      input.propertyId,
    );
    if (!property) {
      throw new NotFoundException(`Property ${input.propertyId} not found`);
    }
    const roomType = await this.roomTypeRepository.findRoomTypeByIdAndProperty(
      input.roomTypeId,
      input.propertyId,
    );
    if (!roomType) {
      throw new NotFoundException(
        `Room type ${input.roomTypeId} not found for this property`,
      );
    }
    const room = Room.create({
      propertyId: input.propertyId,
      roomTypeId: input.roomTypeId,
      number: input.number,
      floor: input.floor,
      notes: input.notes,
    });
    try {
      await this.roomRepository.saveRoom(room);
    } catch (e: unknown) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(
          `Room number "${room.number}" already exists in this property`,
        );
      }
      throw e;
    }
    return room;
  }
}
