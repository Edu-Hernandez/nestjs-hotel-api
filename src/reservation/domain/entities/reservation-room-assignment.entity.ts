import { randomUUID } from 'node:crypto';

export class ReservationRoomAssignment {
  private constructor(
    readonly id: string,
    readonly reservationId: string,
    readonly roomId: string,
    readonly checkInDate: Date,
    readonly checkOutDate: Date,
    readonly nightlyRate: string | null,
    readonly lineTotal: string | null,
    readonly lineCurrency: string | null,
    readonly assignedAt: Date | null,
  ) {}

  static create(props: {
    reservationId: string;
    roomId: string;
    checkInDate: Date;
    checkOutDate: Date;
    nightlyRate?: string | null;
    lineTotal?: string | null;
    lineCurrency?: string | null;
  }): ReservationRoomAssignment {
    const now = new Date();
    const lineCurrency = props.lineCurrency?.trim()
      ? props.lineCurrency.trim().toUpperCase().slice(0, 3)
      : null;
    return new ReservationRoomAssignment(
      randomUUID(),
      props.reservationId,
      props.roomId,
      props.checkInDate,
      props.checkOutDate,
      props.nightlyRate ?? null,
      props.lineTotal ?? null,
      lineCurrency,
      now,
    );
  }
}
