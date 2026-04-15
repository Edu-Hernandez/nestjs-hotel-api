import type { Room } from '../domain/entities/room.entity';

export function presentRoom(r: Room) {
  return {
    id: r.id,
    propertyId: r.propertyId,
    roomTypeId: r.roomTypeId,
    number: r.number,
    floor: r.floor,
    operationalStatus: r.operationalStatus,
    notes: r.notes,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}
