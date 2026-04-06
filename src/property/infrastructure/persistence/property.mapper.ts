import { Property } from '../../domain/entities/property.entity';
import { Room } from '../../domain/entities/room.entity';
import { RoomType } from '../../domain/entities/room-type.entity';
import {
  isRoomOperationalStatus,
  type RoomOperationalStatus,
} from '../../domain/room-operational-status';
import type { RoomOperationalStatus as PrismaRoomStatus } from '../../../../generated/prisma/enums';

export class PropertyMapper {
  static toDomainProperty(row: {
    id: string;
    name: string;
    legalName: string | null;
    taxId: string | null;
    email: string | null;
    phone: string | null;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string | null;
    postalCode: string | null;
    country: string;
    timezone: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Property {
    return Property.reconstitute({
      id: row.id,
      name: row.name,
      legalName: row.legalName,
      taxId: row.taxId,
      email: row.email,
      phone: row.phone,
      addressLine1: row.addressLine1,
      addressLine2: row.addressLine2,
      city: row.city,
      state: row.state,
      postalCode: row.postalCode,
      country: row.country,
      timezone: row.timezone,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistenceProperty(property: Property) {
    return {
      id: property.id,
      name: property.name,
      legalName: property.legalName,
      taxId: property.taxId,
      email: property.email,
      phone: property.phone,
      addressLine1: property.addressLine1,
      addressLine2: property.addressLine2,
      city: property.city,
      state: property.state,
      postalCode: property.postalCode,
      country: property.country,
      timezone: property.timezone,
      isActive: property.isActive,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    };
  }

  static toDomainRoomType(row: {
    id: string;
    propertyId: string;
    name: string;
    description: string | null;
    maxAdults: number;
    maxChildren: number;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
  }): RoomType {
    return RoomType.reconstitute({
      id: row.id,
      propertyId: row.propertyId,
      name: row.name,
      description: row.description,
      maxAdults: row.maxAdults,
      maxChildren: row.maxChildren,
      sortOrder: row.sortOrder,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistenceRoomType(roomType: RoomType) {
    return {
      id: roomType.id,
      propertyId: roomType.propertyId,
      name: roomType.name,
      description: roomType.description,
      maxAdults: roomType.maxAdults,
      maxChildren: roomType.maxChildren,
      sortOrder: roomType.sortOrder,
      createdAt: roomType.createdAt,
      updatedAt: roomType.updatedAt,
    };
  }

  static prismaStatusToDomain(status: PrismaRoomStatus): RoomOperationalStatus {
    if (isRoomOperationalStatus(status)) {
      return status;
    }
    throw new Error(`Unknown operational status: ${String(status)}`);
  }

  static domainStatusToPrisma(
    status: RoomOperationalStatus,
  ): PrismaRoomStatus {
    return status as PrismaRoomStatus;
  }

  static toDomainRoom(row: {
    id: string;
    propertyId: string;
    roomTypeId: string;
    number: string;
    floor: string | null;
    operationalStatus: PrismaRoomStatus;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Room {
    return Room.reconstitute({
      id: row.id,
      propertyId: row.propertyId,
      roomTypeId: row.roomTypeId,
      number: row.number,
      floor: row.floor,
      operationalStatus: PropertyMapper.prismaStatusToDomain(
        row.operationalStatus,
      ),
      notes: row.notes,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistenceRoom(room: Room) {
    return {
      id: room.id,
      propertyId: room.propertyId,
      roomTypeId: room.roomTypeId,
      number: room.number,
      floor: room.floor,
      operationalStatus: PropertyMapper.domainStatusToPrisma(
        room.operationalStatus,
      ),
      notes: room.notes,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    };
  }
}
