import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import type { Room } from '../../domain/entities/room.entity';
import type { RoomRepository } from '../../domain/repositories/room.repository';
import { RoomMapper } from './room.mapper';

@Injectable()
export class RoomPrismaRepository implements RoomRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveRoom(room: Room): Promise<void> {
    const data = RoomMapper.toPersistenceRoom(room);
    await this.prisma.room.create({ data });
  }

  async findRoomsByPropertyId(propertyId: string): Promise<Room[]> {
    const rows = await this.prisma.room.findMany({
      where: { propertyId },
      orderBy: [{ floor: 'asc' }, { number: 'asc' }],
    });
    return rows.map((r) => RoomMapper.toDomainRoom(r));
  }

  async findRoomByIdAndProperty(
    roomId: string,
    propertyId: string,
  ): Promise<Room | null> {
    const row = await this.prisma.room.findFirst({
      where: { id: roomId, propertyId },
    });
    return row ? RoomMapper.toDomainRoom(row) : null;
  }

  async updateRoom(room: Room): Promise<void> {
    const data = RoomMapper.toPersistenceRoom(room);
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
