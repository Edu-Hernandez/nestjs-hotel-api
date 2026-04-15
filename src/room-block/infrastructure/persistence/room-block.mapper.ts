import { RoomBlock } from '../../domain/entities/room-block.entity';

export class RoomBlockMapper {
  static toDomain(row: {
    id: string;
    roomId: string;
    startDate: Date;
    endDate: Date;
    reason: string | null;
    createdAt: Date;
  }): RoomBlock {
    return RoomBlock.reconstitute({
      id: row.id,
      roomId: row.roomId,
      startDate: row.startDate,
      endDate: row.endDate,
      reason: row.reason,
      createdAt: row.createdAt,
    });
  }

  static toPersistence(block: RoomBlock) {
    return {
      id: block.id,
      roomId: block.roomId,
      startDate: block.startDate,
      endDate: block.endDate,
      reason: block.reason,
      createdAt: block.createdAt,
    };
  }
}
