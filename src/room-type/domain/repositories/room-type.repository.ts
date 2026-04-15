import type { RoomType } from '../entities/room-type.entity';

export const ROOM_TYPE_REPOSITORY = Symbol('ROOM_TYPE_REPOSITORY');

export interface RoomTypeRepository {
  saveRoomType(roomType: RoomType): Promise<void>;
  findRoomTypesByPropertyId(propertyId: string): Promise<RoomType[]>;
  findRoomTypeByIdAndProperty(
    roomTypeId: string,
    propertyId: string,
  ): Promise<RoomType | null>;
  updateRoomType(roomType: RoomType): Promise<void>;
}
