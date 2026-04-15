import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../../property/domain/repositories/property.repository';
import { RoomType } from '../../domain/entities/room-type.entity';
import {
  ROOM_TYPE_REPOSITORY,
  type RoomTypeRepository,
} from '../../domain/repositories/room-type.repository';

export type AddRoomTypeInput = {
  propertyId: string;
  name: string;
  description?: string | null;
  maxAdults?: number;
  maxChildren?: number;
  sortOrder?: number;
};

@Injectable()
export class AddRoomTypeUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(ROOM_TYPE_REPOSITORY)
    private readonly roomTypeRepository: RoomTypeRepository,
  ) {}

  async execute(input: AddRoomTypeInput): Promise<RoomType> {
    const property = await this.propertyRepository.findPropertyById(
      input.propertyId,
    );
    if (!property) {
      throw new NotFoundException(`Property ${input.propertyId} not found`);
    }
    const roomType = RoomType.create({
      propertyId: input.propertyId,
      name: input.name,
      description: input.description,
      maxAdults: input.maxAdults,
      maxChildren: input.maxChildren,
      sortOrder: input.sortOrder,
    });
    await this.roomTypeRepository.saveRoomType(roomType);
    return roomType;
  }
}
