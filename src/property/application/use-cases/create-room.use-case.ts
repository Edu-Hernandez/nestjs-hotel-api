import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client';
import { Room } from '../../domain/entities/room.entity';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../domain/repositories/property.repository';

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
  ) {}

  async execute(input: CreateRoomInput): Promise<Room> {
    const property = await this.propertyRepository.findPropertyById(
      input.propertyId,
    );
    if (!property) {
      throw new NotFoundException(`Property ${input.propertyId} not found`);
    }
    const roomType = await this.propertyRepository.findRoomTypeByIdAndProperty(
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
      await this.propertyRepository.saveRoom(room);
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
