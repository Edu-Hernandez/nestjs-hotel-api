import { randomUUID } from 'node:crypto';

export class RoomBlock {
  private constructor(
    readonly id: string,
    readonly roomId: string,
    readonly startDate: Date,
    readonly endDate: Date,
    readonly reason: string | null,
    readonly createdAt: Date,
  ) {}

  static create(props: {
    roomId: string;
    startDate: Date;
    endDate: Date;
    reason?: string | null;
  }): RoomBlock {
    const now = new Date();
    return new RoomBlock(
      randomUUID(),
      props.roomId,
      props.startDate,
      props.endDate,
      props.reason ?? null,
      now,
    );
  }

  static reconstitute(props: {
    id: string;
    roomId: string;
    startDate: Date;
    endDate: Date;
    reason: string | null;
    createdAt: Date;
  }): RoomBlock {
    return new RoomBlock(
      props.id,
      props.roomId,
      props.startDate,
      props.endDate,
      props.reason,
      props.createdAt,
    );
  }

  withUpdates(patch: {
    startDate?: Date;
    endDate?: Date;
    reason?: string | null;
  }): RoomBlock {
    return new RoomBlock(
      this.id,
      this.roomId,
      patch.startDate ?? this.startDate,
      patch.endDate ?? this.endDate,
      patch.reason !== undefined ? patch.reason : this.reason,
      this.createdAt,
    );
  }
}
