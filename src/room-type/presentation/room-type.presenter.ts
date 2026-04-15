import type { RoomType } from '../domain/entities/room-type.entity';

export function presentRoomType(r: RoomType) {
  return {
    id: r.id,
    propertyId: r.propertyId,
    name: r.name,
    description: r.description,
    maxAdults: r.maxAdults,
    maxChildren: r.maxChildren,
    sortOrder: r.sortOrder,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}
