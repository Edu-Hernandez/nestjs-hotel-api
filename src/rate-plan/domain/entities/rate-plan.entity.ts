import { randomUUID } from 'node:crypto';

export class RatePlan {
  private constructor(
    readonly id: string,
    readonly propertyId: string,
    readonly name: string,
    readonly code: string,
    readonly description: string | null,
    readonly isActive: boolean,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  static create(props: {
    propertyId: string;
    name: string;
    code: string;
    description?: string | null;
    isActive?: boolean;
  }): RatePlan {
    const now = new Date();
    return new RatePlan(
      randomUUID(),
      props.propertyId,
      props.name,
      props.code.trim().toUpperCase(),
      props.description ?? null,
      props.isActive ?? true,
      now,
      now,
    );
  }

  static reconstitute(props: {
    id: string;
    propertyId: string;
    name: string;
    code: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): RatePlan {
    return new RatePlan(
      props.id,
      props.propertyId,
      props.name,
      props.code,
      props.description,
      props.isActive,
      props.createdAt,
      props.updatedAt,
    );
  }

  withUpdates(patch: {
    name?: string;
    code?: string;
    description?: string | null;
    isActive?: boolean;
  }): RatePlan {
    return new RatePlan(
      this.id,
      this.propertyId,
      patch.name ?? this.name,
      patch.code !== undefined ? patch.code.trim().toUpperCase() : this.code,
      patch.description !== undefined ? patch.description : this.description,
      patch.isActive ?? this.isActive,
      this.createdAt,
      new Date(),
    );
  }
}
