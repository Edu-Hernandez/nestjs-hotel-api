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
import {
  RESERVATION_REPOSITORY,
  type ReservationRepository,
} from '../../domain/repositories/reservation.repository';

export type UpdateReservationGuestInput = {
  propertyId: string;
  reservationId: string;
  guestId: string;
  isPrimary: boolean;
};

@Injectable()
export class UpdateReservationGuestUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepository,
  ) {}

  async execute(input: UpdateReservationGuestInput): Promise<void> {
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
    const exists = await this.reservationRepository.reservationGuestExists(
      input.reservationId,
      input.guestId,
    );
    if (!exists) {
      throw new NotFoundException(
        `Guest ${input.guestId} is not linked to this reservation`,
      );
    }
    if (!input.isPrimary) {
      throw new BadRequestException(
        'Use DELETE to remove a guest; PATCH is only for setting primary guest',
      );
    }
    await this.reservationRepository.setReservationGuestPrimary(
      input.reservationId,
      input.propertyId,
      input.guestId,
    );
  }
}
