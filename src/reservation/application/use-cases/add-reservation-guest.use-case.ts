import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  GUEST_REPOSITORY,
  type GuestRepository,
} from '../../../guest/domain/repositories/guest.repository';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../../property/domain/repositories/property.repository';
import { ReservationGuestLink } from '../../domain/entities/reservation-guest-link.entity';
import {
  RESERVATION_REPOSITORY,
  type ReservationRepository,
} from '../../domain/repositories/reservation.repository';

export type AddReservationGuestInput = {
  propertyId: string;
  reservationId: string;
  guestId: string;
  isPrimary?: boolean;
};

export type AddReservationGuestResult = { linkId: string };

@Injectable()
export class AddReservationGuestUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(GUEST_REPOSITORY)
    private readonly guestRepository: GuestRepository,
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepository,
  ) {}

  async execute(
    input: AddReservationGuestInput,
  ): Promise<AddReservationGuestResult> {
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
    const guest = await this.guestRepository.findById(input.guestId);
    if (!guest) {
      throw new NotFoundException(`Guest ${input.guestId} not found`);
    }
    const exists = await this.reservationRepository.reservationGuestExists(
      input.reservationId,
      input.guestId,
    );
    if (exists) {
      throw new ConflictException(
        `Guest ${input.guestId} is already linked to this reservation`,
      );
    }
    const link = ReservationGuestLink.create({
      reservationId: input.reservationId,
      guestId: input.guestId,
      isPrimary: input.isPrimary,
    });
    await this.reservationRepository.addReservationGuest(link);
    return { linkId: link.id };
  }
}
