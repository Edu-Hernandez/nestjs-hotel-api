import { randomUUID } from 'node:crypto';
import {
  ReservationChannel,
  type ReservationChannel as ReservationChannelT,
  ReservationStatus,
  type ReservationStatus as ReservationStatusT,
} from '../../../../generated/prisma/enums';

export class Reservation {
  private constructor(
    readonly id: string,
    readonly propertyId: string,
    readonly publicCode: string,
    readonly status: ReservationStatusT,
    readonly channel: ReservationChannelT,
    readonly checkInDate: Date,
    readonly checkOutDate: Date,
    readonly actualCheckInAt: Date | null,
    readonly actualCheckOutAt: Date | null,
    readonly adults: number,
    readonly children: number,
    readonly currency: string,
    readonly totalEstimated: string | null,
    readonly specialRequests: string | null,
    readonly internalNotes: string | null,
    readonly cancelledAt: Date | null,
    readonly cancellationReason: string | null,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  static create(props: {
    propertyId: string;
    publicCode: string;
    checkInDate: Date;
    checkOutDate: Date;
    channel?: ReservationChannelT;
    adults?: number;
    children?: number;
    currency?: string;
    totalEstimated?: string | null;
    specialRequests?: string | null;
    internalNotes?: string | null;
  }): Reservation {
    const now = new Date();
    const currency = (props.currency ?? 'USD').toUpperCase().slice(0, 3);
    return new Reservation(
      randomUUID(),
      props.propertyId,
      props.publicCode,
      ReservationStatus.PENDING,
      props.channel ?? ReservationChannel.DIRECT,
      props.checkInDate,
      props.checkOutDate,
      null,
      null,
      props.adults ?? 1,
      props.children ?? 0,
      currency,
      props.totalEstimated ?? null,
      props.specialRequests ?? null,
      props.internalNotes ?? null,
      null,
      null,
      now,
      now,
    );
  }

  static reconstitute(props: {
    id: string;
    propertyId: string;
    publicCode: string;
    status: ReservationStatusT;
    channel: ReservationChannelT;
    checkInDate: Date;
    checkOutDate: Date;
    actualCheckInAt: Date | null;
    actualCheckOutAt: Date | null;
    adults: number;
    children: number;
    currency: string;
    totalEstimated: string | null;
    specialRequests: string | null;
    internalNotes: string | null;
    cancelledAt: Date | null;
    cancellationReason: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Reservation {
    return new Reservation(
      props.id,
      props.propertyId,
      props.publicCode,
      props.status,
      props.channel,
      props.checkInDate,
      props.checkOutDate,
      props.actualCheckInAt,
      props.actualCheckOutAt,
      props.adults,
      props.children,
      props.currency,
      props.totalEstimated,
      props.specialRequests,
      props.internalNotes,
      props.cancelledAt,
      props.cancellationReason,
      props.createdAt,
      props.updatedAt,
    );
  }
}
