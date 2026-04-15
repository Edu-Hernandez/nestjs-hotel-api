import { randomUUID } from 'node:crypto';
import {
  RoomOperationalStatus,
  type RoomOperationalStatus as RoomOpStatus,
} from '../room-operational-status';

export class Room {
  private constructor(
    readonly id: string,
    readonly propertyId: string,
    readonly roomTypeId: string,
    readonly number: string,
    readonly floor: string | null,
    readonly operationalStatus: RoomOpStatus,
    readonly notes: string | null,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  static create(props: {
    propertyId: string;
    roomTypeId: string;
    number: string;
    floor?: string | null;
    notes?: string | null;
    operationalStatus?: RoomOpStatus;
  }): Room {
    const now = new Date();
    return new Room(
      randomUUID(),
      props.propertyId,
      props.roomTypeId,
      props.number.trim(),
      props.floor ?? null,
      props.operationalStatus ?? RoomOperationalStatus.AVAILABLE,
      props.notes ?? null,
      now,
      now,
    );
  }

  static reconstitute(props: {
    id: string;
    propertyId: string;
    roomTypeId: string;
    number: string;
    floor: string | null;
    operationalStatus: RoomOpStatus;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Room {
    return new Room(
      props.id,
      props.propertyId,
      props.roomTypeId,
      props.number,
      props.floor,
      props.operationalStatus,
      props.notes,
      props.createdAt,
      props.updatedAt,
    );
  }

  withOperationalStatus(status: RoomOpStatus): Room {
    return new Room(
      this.id,
      this.propertyId,
      this.roomTypeId,
      this.number,
      this.floor,
      status,
      this.notes,
      this.createdAt,
      new Date(),
    );
  }

  withLayout(patch: {
    roomTypeId?: string;
    number?: string;
    floor?: string | null;
    notes?: string | null;
  }): Room {
    return new Room(
      this.id,
      this.propertyId,
      patch.roomTypeId ?? this.roomTypeId,
      patch.number !== undefined ? patch.number.trim() : this.number,
      patch.floor !== undefined ? patch.floor : this.floor,
      this.operationalStatus,
      patch.notes !== undefined ? patch.notes : this.notes,
      this.createdAt,
      new Date(),
    );
  }
}
