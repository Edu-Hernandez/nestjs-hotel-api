import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../../property/domain/repositories/property.repository';
import type { ReservationDetail } from '../../domain/types/reservation-detail';
import {
  RESERVATION_REPOSITORY,
  type ReservationRepository,
} from '../../domain/repositories/reservation.repository';

@Injectable()
export class GetReservationDetailUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepository,
  ) {}

  async execute(
    propertyId: string,
    reservationId: string,
  ): Promise<ReservationDetail> {
    const property = await this.propertyRepository.findPropertyById(propertyId);
    if (!property) {
      throw new NotFoundException(`Property ${propertyId} not found`);
    }
    const detail =
      await this.reservationRepository.findReservationDetailByIdAndProperty(
        reservationId,
        propertyId,
      );
    if (!detail) {
      throw new NotFoundException(
        `Reservation ${reservationId} not found for this property`,
      );
    }
    return detail;
  }
}
