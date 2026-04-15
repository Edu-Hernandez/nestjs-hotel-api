import type { ReservationGuestLink } from '../entities/reservation-guest-link.entity';
import type { ReservationRoomAssignment } from '../entities/reservation-room-assignment.entity';
import type { Reservation } from '../entities/reservation.entity';
import type { ReservationDetail } from '../types/reservation-detail';
import type {
  ReservationChannel,
  ReservationStatus,
} from '../../../../generated/prisma/enums';

export const RESERVATION_REPOSITORY = Symbol('RESERVATION_REPOSITORY');

export type ListReservationsFilters = {
  status?: ReservationStatus;
  checkInFrom?: Date;
  checkInTo?: Date;
};

export type ReservationFieldsPatch = {
  checkInDate?: Date;
  checkOutDate?: Date;
  channel?: ReservationChannel;
  adults?: number;
  children?: number;
  currency?: string;
  totalEstimated?: string | null;
  specialRequests?: string | null;
  internalNotes?: string | null;
  status?: ReservationStatus;
  actualCheckInAt?: Date | null;
  actualCheckOutAt?: Date | null;
  cancelledAt?: Date | null;
  cancellationReason?: string | null;
};

export type ReservationRoomPatch = {
  checkInDate: Date;
  checkOutDate: Date;
  nightlyRate: string | null;
  lineTotal: string | null;
  lineCurrency: string | null;
};

export interface ReservationRepository {
  createReservation(reservation: Reservation): Promise<void>;
  findReservationByIdAndProperty(
    id: string,
    propertyId: string,
  ): Promise<Reservation | null>;
  findReservationDetailByIdAndProperty(
    id: string,
    propertyId: string,
  ): Promise<ReservationDetail | null>;
  findReservationsByPropertyId(
    propertyId: string,
    filters: ListReservationsFilters,
  ): Promise<Reservation[]>;
  updateReservation(
    reservationId: string,
    propertyId: string,
    patch: ReservationFieldsPatch,
  ): Promise<void>;
  addReservationGuest(link: ReservationGuestLink): Promise<void>;
  reservationGuestExists(
    reservationId: string,
    guestId: string,
  ): Promise<boolean>;
  deleteReservationGuest(
    reservationId: string,
    propertyId: string,
    guestId: string,
  ): Promise<number>;
  setReservationGuestPrimary(
    reservationId: string,
    propertyId: string,
    guestId: string,
  ): Promise<void>;
  addReservationRoom(assignment: ReservationRoomAssignment): Promise<void>;
  roomHasOverlappingAssignment(
    roomId: string,
    checkInDate: Date,
    checkOutDate: Date,
    excludeReservationRoomId?: string,
  ): Promise<boolean>;
  deleteReservationRoom(
    reservationId: string,
    propertyId: string,
    assignmentId: string,
  ): Promise<number>;
  updateReservationRoom(
    reservationId: string,
    propertyId: string,
    assignmentId: string,
    patch: ReservationRoomPatch,
  ): Promise<void>;
}
