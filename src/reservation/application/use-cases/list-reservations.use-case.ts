import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../../property/domain/repositories/property.repository';
import type { Reservation } from '../../domain/entities/reservation.entity';
import type { ListReservationsFilters } from '../../domain/repositories/reservation.repository';
import {
  RESERVATION_REPOSITORY,
  type ReservationRepository,
} from '../../domain/repositories/reservation.repository';
import { parseDateOnly } from '../date-only';

export type ListReservationsInput = {
  propertyId: string;
  status?: ListReservationsFilters['status'];
  checkInFrom?: string;
  checkInTo?: string;
};

@Injectable()
export class ListReservationsUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepository,
  ) {}

  async execute(input: ListReservationsInput): Promise<Reservation[]> {
    const property = await this.propertyRepository.findPropertyById(
      input.propertyId,
    );
    if (!property) {
      throw new NotFoundException(`Property ${input.propertyId} not found`);
    }
    const checkInFrom = input.checkInFrom
      ? parseDateOnly(input.checkInFrom)
      : undefined;
    const checkInTo = input.checkInTo
      ? parseDateOnly(input.checkInTo)
      : undefined;
    if (
      checkInFrom &&
      checkInTo &&
      checkInFrom.getTime() > checkInTo.getTime()
    ) {
      throw new BadRequestException(
        'checkInFrom must be on or before checkInTo',
      );
    }
    const filters: ListReservationsFilters = {
      status: input.status,
      checkInFrom,
      checkInTo,
    };
    return this.reservationRepository.findReservationsByPropertyId(
      input.propertyId,
      filters,
    );
  }
}
