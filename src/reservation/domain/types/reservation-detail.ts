import type { Guest } from '../../../guest/domain/entities/guest.entity';
import type { Reservation } from '../entities/reservation.entity';

export type ReservationGuestDetail = {
  linkId: string;
  isPrimary: boolean;
  guest: Guest;
};

export type ReservationRoomDetail = {
  assignmentId: string;
  roomId: string;
  roomNumber: string;
  floor: string | null;
  checkInDate: Date;
  checkOutDate: Date;
  nightlyRate: string | null;
  lineTotal: string | null;
  lineCurrency: string | null;
  assignedAt: Date | null;
};

export type ReservationDetail = {
  reservation: Reservation;
  guests: ReservationGuestDetail[];
  rooms: ReservationRoomDetail[];
};
