import { randomUUID } from 'node:crypto';

export class ReservationGuestLink {
  private constructor(
    readonly id: string,
    readonly reservationId: string,
    readonly guestId: string,
    readonly isPrimary: boolean,
  ) {}

  static create(props: {
    reservationId: string;
    guestId: string;
    isPrimary?: boolean;
  }): ReservationGuestLink {
    return new ReservationGuestLink(
      randomUUID(),
      props.reservationId,
      props.guestId,
      props.isPrimary ?? false,
    );
  }
}
