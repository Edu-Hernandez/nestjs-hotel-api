import type { RoomBlock } from '../domain/entities/room-block.entity';

export function presentRoomBlock(b: RoomBlock) {
  return {
    id: b.id,
    roomId: b.roomId,
    startDate: b.startDate.toISOString().slice(0, 10),
    endDate: b.endDate.toISOString().slice(0, 10),
    reason: b.reason,
    createdAt: b.createdAt.toISOString(),
  };
}
