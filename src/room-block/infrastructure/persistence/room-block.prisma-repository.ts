import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import type { RoomBlock } from '../../domain/entities/room-block.entity';
import type { RoomBlockRepository } from '../../domain/repositories/room-block.repository';
import { RoomBlockMapper } from './room-block.mapper';

@Injectable()
export class RoomBlockPrismaRepository implements RoomBlockRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveBlock(block: RoomBlock): Promise<void> {
    const data = RoomBlockMapper.toPersistence(block);
    await this.prisma.roomBlock.create({ data });
  }

  async updateBlock(block: RoomBlock): Promise<void> {
    const data = RoomBlockMapper.toPersistence(block);
    await this.prisma.roomBlock.update({
      where: { id: block.id },
      data: {
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
      },
    });
  }

  async deleteBlock(
    blockId: string,
    roomId: string,
    propertyId: string,
  ): Promise<number> {
    const result = await this.prisma.roomBlock.deleteMany({
      where: {
        id: blockId,
        roomId,
        room: { propertyId },
      },
    });
    return result.count;
  }

  async findBlocksByRoom(
    roomId: string,
    propertyId: string,
  ): Promise<RoomBlock[]> {
    const rows = await this.prisma.roomBlock.findMany({
      where: { roomId, room: { propertyId } },
      orderBy: { startDate: 'asc' },
    });
    return rows.map((r) => RoomBlockMapper.toDomain(r));
  }

  async findBlockByIdAndRoom(
    blockId: string,
    roomId: string,
    propertyId: string,
  ): Promise<RoomBlock | null> {
    const row = await this.prisma.roomBlock.findFirst({
      where: { id: blockId, roomId, room: { propertyId } },
    });
    return row ? RoomBlockMapper.toDomain(row) : null;
  }

  async roomHasOverlappingBlock(
    roomId: string,
    startDate: Date,
    endDate: Date,
    excludeBlockId?: string,
  ): Promise<boolean> {
    const overlap = await this.prisma.roomBlock.findFirst({
      where: {
        roomId,
        ...(excludeBlockId ? { NOT: { id: excludeBlockId } } : {}),
        AND: [{ startDate: { lt: endDate } }, { endDate: { gt: startDate } }],
      },
    });
    return overlap !== null;
  }
}
