import { presentGuest } from '../../guest/presentation/guest.presenter';
import type { Reservation } from '../domain/entities/reservation.entity';
import type { ReservationDetail } from '../domain/types/reservation-detail';

export function presentReservation(r: Reservation) {
  return {
    id: r.id,
    propertyId: r.propertyId,
    publicCode: r.publicCode,
    status: r.status,
    channel: r.channel,
    checkInDate: r.checkInDate.toISOString().slice(0, 10),
    checkOutDate: r.checkOutDate.toISOString().slice(0, 10),
    actualCheckInAt: r.actualCheckInAt?.toISOString() ?? null,
    actualCheckOutAt: r.actualCheckOutAt?.toISOString() ?? null,
    adults: r.adults,
    children: r.children,
    currency: r.currency,
    totalEstimated: r.totalEstimated,
    specialRequests: r.specialRequests,
    internalNotes: r.internalNotes,
    cancelledAt: r.cancelledAt?.toISOString() ?? null,
    cancellationReason: r.cancellationReason,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

export function presentReservationDetail(d: ReservationDetail) {
  return {
    ...presentReservation(d.reservation),
    guests: d.guests.map((g) => ({
      linkId: g.linkId,
      isPrimary: g.isPrimary,
      guest: presentGuest(g.guest),
    })),
    rooms: d.rooms.map((rm) => ({
      assignmentId: rm.assignmentId,
      roomId: rm.roomId,
      number: rm.roomNumber,
      floor: rm.floor,
      checkInDate: rm.checkInDate.toISOString().slice(0, 10),
      checkOutDate: rm.checkOutDate.toISOString().slice(0, 10),
      nightlyRate: rm.nightlyRate,
      lineTotal: rm.lineTotal,
      lineCurrency: rm.lineCurrency,
      assignedAt: rm.assignedAt?.toISOString() ?? null,
    })),
  };
}
