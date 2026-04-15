import { Room } from '../../domain/entities/room.entity';
import {
  isRoomOperationalStatus,
  type RoomOperationalStatus,
} from '../../domain/room-operational-status';
import type { RoomOperationalStatus as PrismaRoomStatus } from '../../../../generated/prisma/enums';

export class RoomMapper {
  static prismaStatusToDomain(status: PrismaRoomStatus): RoomOperationalStatus {
    if (isRoomOperationalStatus(status)) {
      return status;
    }
    throw new Error(`Unknown operational status: ${String(status)}`);
  }

  static domainStatusToPrisma(status: RoomOperationalStatus): PrismaRoomStatus {
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
      operationalStatus: RoomMapper.prismaStatusToDomain(row.operationalStatus),
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
      operationalStatus: RoomMapper.domainStatusToPrisma(
        room.operationalStatus,
      ),
      notes: room.notes,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    };
  }
}
