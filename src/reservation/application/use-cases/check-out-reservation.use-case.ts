import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { assertCanCheckOut } from '../reservation-status.policy';

@Injectable()
export class CheckOutReservationUseCase {
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
    if (reservation.status === ReservationStatus.CHECKED_OUT) {
      return reservation;
    }
    assertCanCheckOut(reservation.status);
    if (reservation.actualCheckInAt === null) {
      throw new BadRequestException('Reservation must be checked in first');
    }
    const now = new Date();
    await this.reservationRepository.updateReservation(
      reservationId,
      propertyId,
      {
        status: ReservationStatus.CHECKED_OUT,
        actualCheckOutAt: reservation.actualCheckOutAt ?? now,
      },
    );
    const updated =
      await this.reservationRepository.findReservationByIdAndProperty(
        reservationId,
        propertyId,
      );
    if (!updated) {
      throw new NotFoundException('Reservation not found after check-out');
    }
    return updated;
  }
}
