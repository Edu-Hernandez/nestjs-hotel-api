import { randomUUID } from 'node:crypto';

export class RoomType {
  private constructor(
    readonly id: string,
    readonly propertyId: string,
    readonly name: string,
    readonly description: string | null,
    readonly maxAdults: number,
    readonly maxChildren: number,
    readonly sortOrder: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  static create(props: {
    propertyId: string;
    name: string;
    description?: string | null;
    maxAdults?: number;
    maxChildren?: number;
    sortOrder?: number;
  }): RoomType {
    const now = new Date();
    return new RoomType(
      randomUUID(),
      props.propertyId,
      props.name,
      props.description ?? null,
      props.maxAdults ?? 2,
      props.maxChildren ?? 0,
      props.sortOrder ?? 0,
      now,
      now,
    );
  }

  static reconstitute(props: {
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
    return new RoomType(
      props.id,
      props.propertyId,
      props.name,
      props.description,
      props.maxAdults,
      props.maxChildren,
      props.sortOrder,
      props.createdAt,
      props.updatedAt,
    );
  }
}
