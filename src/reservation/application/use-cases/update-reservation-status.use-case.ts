import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ReservationStatus } from '../../../../generated/prisma/enums';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../../property/domain/repositories/property.repository';
import type { Reservation } from '../../domain/entities/reservation.entity';
import {
  RESERVATION_REPOSITORY,
  type ReservationRepository,
} from '../../domain/repositories/reservation.repository';
import { assertManualReservationStatusChange } from '../reservation-status.policy';

export type UpdateReservationStatusInput = {
  propertyId: string;
  reservationId: string;
  status: ReservationStatus;
};

@Injectable()
export class UpdateReservationStatusUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepository,
  ) {}

  async execute(input: UpdateReservationStatusInput): Promise<Reservation> {
    const property = await this.propertyRepository.findPropertyById(
      input.propertyId,
    );
    if (!property) {
      throw new NotFoundException(`Property ${input.propertyId} not found`);
    }
    const reservation =
      await this.reservationRepository.findReservationByIdAndProperty(
        input.reservationId,
        input.propertyId,
      );
    if (!reservation) {
      throw new NotFoundException(
        `Reservation ${input.reservationId} not found for this property`,
      );
    }
    assertManualReservationStatusChange(reservation.status, input.status);
    await this.reservationRepository.updateReservation(
      input.reservationId,
      input.propertyId,
      { status: input.status },
    );
    const updated =
      await this.reservationRepository.findReservationByIdAndProperty(
        input.reservationId,
        input.propertyId,
      );
    if (!updated) {
      throw new NotFoundException('Reservation not found after update');
    }
    return updated;
  }
}
