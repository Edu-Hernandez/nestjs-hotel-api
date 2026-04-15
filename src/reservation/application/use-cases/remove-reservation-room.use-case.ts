import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../../property/domain/repositories/property.repository';
import {
  RESERVATION_REPOSITORY,
  type ReservationRepository,
} from '../../domain/repositories/reservation.repository';

@Injectable()
export class RemoveReservationRoomUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepository,
  ) {}

  async execute(
    propertyId: string,
    reservationId: string,
    assignmentId: string,
  ): Promise<void> {
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
    const removed = await this.reservationRepository.deleteReservationRoom(
      reservationId,
      propertyId,
      assignmentId,
    );
    if (removed === 0) {
      throw new NotFoundException(
        `Room assignment ${assignmentId} not found on this reservation`,
      );
    }
  }
}
