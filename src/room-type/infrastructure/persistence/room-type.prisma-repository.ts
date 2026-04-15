import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import type { RoomType } from '../../domain/entities/room-type.entity';
import type { RoomTypeRepository } from '../../domain/repositories/room-type.repository';
import { RoomTypeMapper } from './room-type.mapper';

@Injectable()
export class RoomTypePrismaRepository implements RoomTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveRoomType(roomType: RoomType): Promise<void> {
    const data = RoomTypeMapper.toPersistenceRoomType(roomType);
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
    return rows.map((r) => RoomTypeMapper.toDomainRoomType(r));
  }

  async findRoomTypeByIdAndProperty(
    roomTypeId: string,
    propertyId: string,
  ): Promise<RoomType | null> {
    const row = await this.prisma.roomType.findFirst({
      where: { id: roomTypeId, propertyId },
    });
    return row ? RoomTypeMapper.toDomainRoomType(row) : null;
  }

  async updateRoomType(roomType: RoomType): Promise<void> {
    const data = RoomTypeMapper.toPersistenceRoomType(roomType);
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
}
