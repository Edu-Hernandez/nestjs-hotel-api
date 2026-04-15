import { RoomType } from '../../domain/entities/room-type.entity';

export class RoomTypeMapper {
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
}
