import { BadRequestException } from '@nestjs/common';
import { ReservationStatus } from '../../../generated/prisma/enums';

/** Estados que bloquean habitación en disponibilidad. */
export const RESERVATION_STATUSES_BLOCKING_INVENTORY: ReservationStatus[] = [
  ReservationStatus.PENDING,
  ReservationStatus.CONFIRMED,
  ReservationStatus.CHECKED_IN,
  ReservationStatus.NO_SHOW,
];

export function assertManualReservationStatusChange(
  from: ReservationStatus,
  to: ReservationStatus,
): void {
  if (from === to) {
    return;
  }
  if (
    from === ReservationStatus.CANCELLED ||
    from === ReservationStatus.CHECKED_IN ||
    from === ReservationStatus.CHECKED_OUT
  ) {
    throw new BadRequestException(
      'Use check-in, check-out, cancel or reopen endpoints instead of PATCH status for this reservation state',
    );
  }
  const allowed = manualStatusTargets(from);
  if (!allowed.has(to)) {
    throw new BadRequestException(
      `Cannot change reservation status from ${from} to ${to} via PATCH. To cancel, use POST .../reservations/:id/cancel.`,
    );
  }
  if (
    to === ReservationStatus.CHECKED_IN ||
    to === ReservationStatus.CHECKED_OUT
  ) {
    throw new BadRequestException(
      'Use POST check-in or check-out; CHECKED_IN/CHECKED_OUT are not set via PATCH status',
    );
  }
}

function manualStatusTargets(from: ReservationStatus): Set<ReservationStatus> {
  switch (from) {
    case ReservationStatus.PENDING:
      return new Set([ReservationStatus.CONFIRMED, ReservationStatus.NO_SHOW]);
    case ReservationStatus.CONFIRMED:
      return new Set([ReservationStatus.PENDING, ReservationStatus.NO_SHOW]);
    case ReservationStatus.NO_SHOW:
      return new Set([ReservationStatus.PENDING, ReservationStatus.CONFIRMED]);
    default:
      return new Set();
  }
}

export function assertCanCheckIn(status: ReservationStatus): void {
  if (status === ReservationStatus.CANCELLED) {
    throw new BadRequestException('Cannot check in a cancelled reservation');
  }
  if (status === ReservationStatus.CHECKED_OUT) {
    throw new BadRequestException('Cannot check in after check-out');
  }
  if (
    status !== ReservationStatus.PENDING &&
    status !== ReservationStatus.CONFIRMED
  ) {
    throw new BadRequestException(
      `Check-in is only allowed from PENDING or CONFIRMED (current: ${status})`,
    );
  }
}

export function assertCanCheckOut(status: ReservationStatus): void {
  if (status !== ReservationStatus.CHECKED_IN) {
    throw new BadRequestException(
      `Check-out is only allowed from CHECKED_IN (current: ${status})`,
    );
  }
}

export function assertCanCancelReservation(status: ReservationStatus): void {
  if (status === ReservationStatus.CANCELLED) {
    return;
  }
  if (
    status === ReservationStatus.CHECKED_IN ||
    status === ReservationStatus.CHECKED_OUT
  ) {
    throw new BadRequestException(
      'Cannot cancel a reservation that is already checked in or checked out',
    );
  }
  if (
    status !== ReservationStatus.PENDING &&
    status !== ReservationStatus.CONFIRMED &&
    status !== ReservationStatus.NO_SHOW
  ) {
    throw new BadRequestException(
      `Cancellation is not allowed from status ${String(status)}`,
    );
  }
}

export function assertCanReopenReservation(status: ReservationStatus): void {
  if (status !== ReservationStatus.CANCELLED) {
    throw new BadRequestException(
      'Only a cancelled reservation can be reopened',
    );
  }
}
