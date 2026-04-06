import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import type { Property } from '../../domain/entities/property.entity';
import type { Room } from '../../domain/entities/room.entity';
import type { RoomType } from '../../domain/entities/room-type.entity';
import type { PropertyRepository } from '../../domain/repositories/property.repository';
import { PropertyMapper } from './property.mapper';

@Injectable()
export class PropertyPrismaRepository implements PropertyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveProperty(property: Property): Promise<void> {
    const data = PropertyMapper.toPersistenceProperty(property);
    await this.prisma.property.upsert({
      where: { id: property.id },
      create: data,
      update: {
        name: data.name,
        legalName: data.legalName,
        taxId: data.taxId,
        email: data.email,
        phone: data.phone,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        timezone: data.timezone,
        isActive: data.isActive,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findAllProperties(): Promise<Property[]> {
    const rows = await this.prisma.property.findMany({
      orderBy: { name: 'asc' },
    });
    return rows.map((r) => PropertyMapper.toDomainProperty(r));
  }

  async findPropertyById(id: string): Promise<Property | null> {
    const row = await this.prisma.property.findUnique({ where: { id } });
    return row ? PropertyMapper.toDomainProperty(row) : null;
  }

  async saveRoomType(roomType: RoomType): Promise<void> {
    const data = PropertyMapper.toPersistenceRoomType(roomType);
    await this.prisma.roomType.upsert({
      where: { id: roomType.id },
      create: data,
      update: {
        name: data.name,
        description: data.description,
        maxAdults: data.maxAdults,
        maxChildren: data.maxChildren,
        sortOrder: data.sortOrder,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findRoomTypesByPropertyId(propertyId: string): Promise<RoomType[]> {
    const rows = await this.prisma.roomType.findMany({
      where: { propertyId },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return rows.map((r) => PropertyMapper.toDomainRoomType(r));
  }

  async findRoomTypeByIdAndProperty(
    roomTypeId: string,
    propertyId: string,
  ): Promise<RoomType | null> {
    const row = await this.prisma.roomType.findFirst({
      where: { id: roomTypeId, propertyId },
    });
    return row ? PropertyMapper.toDomainRoomType(row) : null;
  }

  async updateRoomType(roomType: RoomType): Promise<void> {
    const data = PropertyMapper.toPersistenceRoomType(roomType);
    await this.prisma.roomType.update({
      where: { id: roomType.id },
      data: {
        name: data.name,
        description: data.description,
        maxAdults: data.maxAdults,
        maxChildren: data.maxChildren,
        sortOrder: data.sortOrder,
        updatedAt: data.updatedAt,
      },
    });
  }

  async saveRoom(room: Room): Promise<void> {
    const data = PropertyMapper.toPersistenceRoom(room);
    await this.prisma.room.create({ data });
  }

  async findRoomsByPropertyId(propertyId: string): Promise<Room[]> {
    const rows = await this.prisma.room.findMany({
      where: { propertyId },
      orderBy: [{ floor: 'asc' }, { number: 'asc' }],
    });
    return rows.map((r) => PropertyMapper.toDomainRoom(r));
  }

  async findRoomByIdAndProperty(
    roomId: string,
    propertyId: string,
  ): Promise<Room | null> {
    const row = await this.prisma.room.findFirst({
      where: { id: roomId, propertyId },
    });
    return row ? PropertyMapper.toDomainRoom(row) : null;
  }

  async updateRoom(room: Room): Promise<void> {
    const data = PropertyMapper.toPersistenceRoom(room);
    await this.prisma.room.update({
      where: { id: room.id },
      data: {
        roomTypeId: data.roomTypeId,
        number: data.number,
        floor: data.floor,
        operationalStatus: data.operationalStatus,
        notes: data.notes,
        updatedAt: data.updatedAt,
      },
    });
  }
}
