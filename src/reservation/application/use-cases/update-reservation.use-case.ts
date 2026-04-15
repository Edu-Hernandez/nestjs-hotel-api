import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReservationStatus } from '../../../../generated/prisma/enums';
import type { ReservationChannel } from '../../../../generated/prisma/enums';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../../property/domain/repositories/property.repository';
import type { Reservation } from '../../domain/entities/reservation.entity';
import {
  RESERVATION_REPOSITORY,
  type ReservationRepository,
} from '../../domain/repositories/reservation.repository';
import {
  isBeforeDay,
  isOnOrAfterDay,
  isOnOrBeforeDay,
  parseDateOnly,
} from '../date-only';

export type UpdateReservationInput = {
  propertyId: string;
  reservationId: string;
  checkInDate?: string;
  checkOutDate?: string;
  channel?: ReservationChannel;
  adults?: number;
  children?: number;
  currency?: string;
  totalEstimated?: string | null;
  specialRequests?: string | null;
  internalNotes?: string | null;
};

@Injectable()
export class UpdateReservationUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepository,
  ) {}

  async execute(input: UpdateReservationInput): Promise<Reservation> {
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
    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException('Cannot update a cancelled reservation');
    }
    if (reservation.status === ReservationStatus.CHECKED_OUT) {
      throw new BadRequestException('Cannot update a completed reservation');
    }
    if (reservation.status === ReservationStatus.CHECKED_IN) {
      const stayFieldsChanged =
        input.checkInDate !== undefined ||
        input.checkOutDate !== undefined ||
        input.channel !== undefined ||
        input.adults !== undefined ||
        input.children !== undefined ||
        input.currency !== undefined ||
        input.totalEstimated !== undefined;
      if (stayFieldsChanged) {
        throw new BadRequestException(
          'After check-in only specialRequests and internalNotes can be updated via PATCH',
        );
      }
    }
    const nextCheckIn =
      input.checkInDate !== undefined
        ? parseDateOnly(input.checkInDate)
        : reservation.checkInDate;
    const nextCheckOut =
      input.checkOutDate !== undefined
        ? parseDateOnly(input.checkOutDate)
        : reservation.checkOutDate;
    if (!isBeforeDay(nextCheckIn, nextCheckOut)) {
      throw new BadRequestException(
        'checkInDate must be strictly before checkOutDate',
      );
    }
    if (input.checkInDate !== undefined || input.checkOutDate !== undefined) {
      const detail =
        await this.reservationRepository.findReservationDetailByIdAndProperty(
          input.reservationId,
          input.propertyId,
        );
      if (detail) {
        for (const rm of detail.rooms) {
          if (!isOnOrAfterDay(rm.checkInDate, nextCheckIn)) {
            throw new BadRequestException(
              'Room assignment check-in is before the new reservation check-in date',
            );
          }
          if (!isOnOrBeforeDay(rm.checkOutDate, nextCheckOut)) {
            throw new BadRequestException(
              'Room assignment check-out is after the new reservation check-out date',
            );
          }
        }
      }
    }
    await this.reservationRepository.updateReservation(
      input.reservationId,
      input.propertyId,
      {
        checkInDate: input.checkInDate !== undefined ? nextCheckIn : undefined,
        checkOutDate:
          input.checkOutDate !== undefined ? nextCheckOut : undefined,
        channel: input.channel,
        adults: input.adults,
        children: input.children,
        currency: input.currency,
        totalEstimated: input.totalEstimated,
        specialRequests: input.specialRequests,
        internalNotes: input.internalNotes,
      },
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
