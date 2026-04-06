import type { Property } from '../entities/property.entity';
import type { Room } from '../entities/room.entity';
import type { RoomType } from '../entities/room-type.entity';

export const PROPERTY_REPOSITORY = Symbol('PROPERTY_REPOSITORY');

export interface PropertyRepository {
  saveProperty(property: Property): Promise<void>;
  findAllProperties(): Promise<Property[]>;
  findPropertyById(id: string): Promise<Property | null>;

  saveRoomType(roomType: RoomType): Promise<void>;
  findRoomTypesByPropertyId(propertyId: string): Promise<RoomType[]>;
  findRoomTypeByIdAndProperty(
    roomTypeId: string,
    propertyId: string,
  ): Promise<RoomType | null>;
  updateRoomType(roomType: RoomType): Promise<void>;

  saveRoom(room: Room): Promise<void>;
  findRoomsByPropertyId(propertyId: string): Promise<Room[]>;
  findRoomByIdAndProperty(
    roomId: string,
    propertyId: string,
  ): Promise<Room | null>;
  updateRoom(room: Room): Promise<void>;
}
