import type { Room } from '../entities/room.entity';

export const ROOM_REPOSITORY = Symbol('ROOM_REPOSITORY');

export interface RoomRepository {
  saveRoom(room: Room): Promise<void>;
  findRoomsByPropertyId(propertyId: string): Promise<Room[]>;
  findRoomByIdAndProperty(
    roomId: string,
    propertyId: string,
  ): Promise<Room | null>;
  updateRoom(room: Room): Promise<void>;
}
