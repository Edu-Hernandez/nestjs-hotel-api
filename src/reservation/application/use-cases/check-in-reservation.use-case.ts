import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReservationStatus } from '../../../../generated/prisma/enums';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../../property/domain/repositories/property.repository';
import type { Reservation } from '../../domain/entities/reservation.entity';
import {
  RESERVATION_REPOSITORY,
  type ReservationRepository,
} from '../../domain/repositories/reservation.repository';
import { assertCanCheckIn } from '../reservation-status.policy';

@Injectable()
export class CheckInReservationUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepository,
  ) {}

  async execute(
    propertyId: string,
    reservationId: string,
  ): Promise<Reservation> {
    const property = await this.propertyRepository.findPropertyById(propertyId);
    if (!property) {
      throw new NotFoundException(`Property ${propertyId} not found`);
    }
    const reservation =
      await this.reservationRepository.findReservationByIdAndProperty(
        reservationId,
        propertyId,
      );
    if (!reservation) {
      throw new NotFoundException(
        `Reservation ${reservationId} not found for this property`,
      );
    }
    if (reservation.status === ReservationStatus.CHECKED_IN) {
      return reservation;
    }
    assertCanCheckIn(reservation.status);
    const now = new Date();
    await this.reservationRepository.updateReservation(
      reservationId,
      propertyId,
      {
        status: ReservationStatus.CHECKED_IN,
        actualCheckInAt: reservation.actualCheckInAt ?? now,
      },
    );
    const updated =
      await this.reservationRepository.findReservationByIdAndProperty(
        reservationId,
        propertyId,
      );
    if (!updated) {
      throw new NotFoundException('Reservation not found after check-in');
    }
    return updated;
  }
}
