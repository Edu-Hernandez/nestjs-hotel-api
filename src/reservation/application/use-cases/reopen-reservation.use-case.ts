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
import { assertCanReopenReservation } from '../reservation-status.policy';

@Injectable()
export class ReopenReservationUseCase {
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
    assertCanReopenReservation(reservation.status);
    await this.reservationRepository.updateReservation(
      reservationId,
      propertyId,
      {
        status: ReservationStatus.CONFIRMED,
        cancelledAt: null,
        cancellationReason: null,
        actualCheckInAt: null,
        actualCheckOutAt: null,
      },
    );
    const updated =
      await this.reservationRepository.findReservationByIdAndProperty(
        reservationId,
        propertyId,
      );
    if (!updated) {
      throw new NotFoundException('Reservation not found after reopen');
    }
    return updated;
  }
}
