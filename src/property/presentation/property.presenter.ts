import type { Property } from '../domain/entities/property.entity';
import type { Room } from '../domain/entities/room.entity';
import type { RoomType } from '../domain/entities/room-type.entity';

export function presentProperty(p: Property) {
  return {
    id: p.id,
    name: p.name,
    legalName: p.legalName,
    taxId: p.taxId,
    email: p.email,
    phone: p.phone,
    addressLine1: p.addressLine1,
    addressLine2: p.addressLine2,
    city: p.city,
    state: p.state,
    postalCode: p.postalCode,
    country: p.country,
    timezone: p.timezone,
    isActive: p.isActive,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

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
