import type {
  ReservationChannel,
  ReservationStatus,
} from '../../../../generated/prisma/enums';
import { GuestMapper } from '../../../guest/infrastructure/persistence/guest.mapper';
import { Reservation } from '../../domain/entities/reservation.entity';
import type { ReservationDetail } from '../../domain/types/reservation-detail';
import { Prisma } from '../../../../generated/prisma/client';

function decimalToString(
  value: Prisma.Decimal | null | undefined,
): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  return value.toString();
}

function optionalDecimal(
  value: string | null | undefined,
): Prisma.Decimal | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return new Prisma.Decimal(value);
}

export class ReservationMapper {
  static toDomainReservation(row: {
    id: string;
    propertyId: string;
    publicCode: string;
    status: ReservationStatus;
    channel: ReservationChannel;
    checkInDate: Date;
    checkOutDate: Date;
    actualCheckInAt: Date | null;
    actualCheckOutAt: Date | null;
    adults: number;
    children: number;
    currency: string;
    totalEstimated: Prisma.Decimal | null;
    specialRequests: string | null;
    internalNotes: string | null;
    cancelledAt: Date | null;
    cancellationReason: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Reservation {
    return Reservation.reconstitute({
      id: row.id,
      propertyId: row.propertyId,
      publicCode: row.publicCode,
      status: row.status,
      channel: row.channel,
      checkInDate: row.checkInDate,
      checkOutDate: row.checkOutDate,
      actualCheckInAt: row.actualCheckInAt,
      actualCheckOutAt: row.actualCheckOutAt,
      adults: row.adults,
      children: row.children,
      currency: row.currency,
      totalEstimated: decimalToString(row.totalEstimated),
      specialRequests: row.specialRequests,
      internalNotes: row.internalNotes,
      cancelledAt: row.cancelledAt,
      cancellationReason: row.cancellationReason,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistenceCreate(reservation: Reservation) {
    return {
      id: reservation.id,
      propertyId: reservation.propertyId,
      publicCode: reservation.publicCode,
      status: reservation.status,
      channel: reservation.channel,
      checkInDate: reservation.checkInDate,
      checkOutDate: reservation.checkOutDate,
      actualCheckInAt: reservation.actualCheckInAt,
      actualCheckOutAt: reservation.actualCheckOutAt,
      adults: reservation.adults,
      children: reservation.children,
      currency: reservation.currency,
      totalEstimated: optionalDecimal(reservation.totalEstimated),
      specialRequests: reservation.specialRequests,
      internalNotes: reservation.internalNotes,
      cancelledAt: reservation.cancelledAt,
      cancellationReason: reservation.cancellationReason,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
    };
  }

  static toDomainDetail(row: {
    id: string;
    propertyId: string;
    publicCode: string;
    status: ReservationStatus;
    channel: ReservationChannel;
    checkInDate: Date;
    checkOutDate: Date;
    actualCheckInAt: Date | null;
    actualCheckOutAt: Date | null;
    adults: number;
    children: number;
    currency: string;
    totalEstimated: Prisma.Decimal | null;
    specialRequests: string | null;
    internalNotes: string | null;
    cancelledAt: Date | null;
    cancellationReason: string | null;
    createdAt: Date;
    updatedAt: Date;
    reservationGuests: Array<{
      id: string;
      isPrimary: boolean;
      guest: {
        id: string;
        firstName: string;
        lastName: string;
        email: string | null;
        phone: string | null;
        documentType: string | null;
        documentNumber: string | null;
        nationality: string | null;
        birthDate: Date | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
      };
    }>;
    reservationRooms: Array<{
      id: string;
      roomId: string;
      checkInDate: Date;
      checkOutDate: Date;
      nightlyRate: Prisma.Decimal | null;
      lineTotal: Prisma.Decimal | null;
      lineCurrency: string | null;
      assignedAt: Date | null;
      room: {
        id: string;
        number: string;
        floor: string | null;
      };
    }>;
  }): ReservationDetail {
    return {
      reservation: ReservationMapper.toDomainReservation(row),
      guests: row.reservationGuests.map((rg) => ({
        linkId: rg.id,
        isPrimary: rg.isPrimary,
        guest: GuestMapper.toDomain(rg.guest),
      })),
      rooms: row.reservationRooms.map((rr) => ({
        assignmentId: rr.id,
        roomId: rr.roomId,
        roomNumber: rr.room.number,
        floor: rr.room.floor,
        checkInDate: rr.checkInDate,
        checkOutDate: rr.checkOutDate,
        nightlyRate: decimalToString(rr.nightlyRate),
        lineTotal: decimalToString(rr.lineTotal),
        lineCurrency: rr.lineCurrency,
        assignedAt: rr.assignedAt,
      })),
    };
  }
}
