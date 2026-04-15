import type { RoomBlock } from '../entities/room-block.entity';

export const ROOM_BLOCK_REPOSITORY = Symbol('ROOM_BLOCK_REPOSITORY');

export interface RoomBlockRepository {
  saveBlock(block: RoomBlock): Promise<void>;
  updateBlock(block: RoomBlock): Promise<void>;
  deleteBlock(
    blockId: string,
    roomId: string,
    propertyId: string,
  ): Promise<number>;
  findBlocksByRoom(roomId: string, propertyId: string): Promise<RoomBlock[]>;
  findBlockByIdAndRoom(
    blockId: string,
    roomId: string,
    propertyId: string,
  ): Promise<RoomBlock | null>;
  roomHasOverlappingBlock(
    roomId: string,
    startDate: Date,
    endDate: Date,
    excludeBlockId?: string,
  ): Promise<boolean>;
}
