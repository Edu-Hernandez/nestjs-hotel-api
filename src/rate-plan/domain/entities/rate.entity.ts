import { randomUUID } from 'node:crypto';

export class Rate {
  private constructor(
    readonly id: string,
    readonly ratePlanId: string,
    readonly roomTypeId: string,
    readonly validFrom: Date,
    readonly validTo: Date,
    readonly amount: string,
    readonly currency: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  static create(props: {
    ratePlanId: string;
    roomTypeId: string;
    validFrom: Date;
    validTo: Date;
    amount: string;
    currency?: string;
  }): Rate {
    const now = new Date();
    const currency = (props.currency ?? 'USD').toUpperCase().slice(0, 3);
    return new Rate(
      randomUUID(),
      props.ratePlanId,
      props.roomTypeId,
      props.validFrom,
      props.validTo,
      props.amount,
      currency,
      now,
      now,
    );
  }

  static reconstitute(props: {
    id: string;
    ratePlanId: string;
    roomTypeId: string;
    validFrom: Date;
    validTo: Date;
    amount: string;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
  }): Rate {
    return new Rate(
      props.id,
      props.ratePlanId,
      props.roomTypeId,
      props.validFrom,
      props.validTo,
      props.amount,
      props.currency,
      props.createdAt,
      props.updatedAt,
    );
  }

  withUpdates(patch: {
    roomTypeId?: string;
    validFrom?: Date;
    validTo?: Date;
    amount?: string;
    currency?: string;
  }): Rate {
    return new Rate(
      this.id,
      this.ratePlanId,
      patch.roomTypeId ?? this.roomTypeId,
      patch.validFrom ?? this.validFrom,
      patch.validTo ?? this.validTo,
      patch.amount ?? this.amount,
      patch.currency !== undefined
        ? patch.currency.toUpperCase().slice(0, 3)
        : this.currency,
      this.createdAt,
      new Date(),
    );
  }
}
