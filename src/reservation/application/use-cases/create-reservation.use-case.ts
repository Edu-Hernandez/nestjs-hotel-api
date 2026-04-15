import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Prisma } from '../../../../generated/prisma/client';
import type { ReservationChannel } from '../../../../generated/prisma/enums';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../../property/domain/repositories/property.repository';
import { Reservation } from '../../domain/entities/reservation.entity';
import {
  RESERVATION_REPOSITORY,
  type ReservationRepository,
} from '../../domain/repositories/reservation.repository';
import { isBeforeDay, parseDateOnly } from '../date-only';

export type CreateReservationInput = {
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  channel?: ReservationChannel;
  adults?: number;
  children?: number;
  currency?: string;
  totalEstimated?: string | null;
  specialRequests?: string | null;
  internalNotes?: string | null;
};

function buildPublicCode(): string {
  const suffix = randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase();
  return `RES-${suffix}`;
}

function describeUnknownError(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === 'string') {
    return err;
  }
  return 'unknown error';
}

@Injectable()
export class CreateReservationUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepository,
  ) {}

  async execute(input: CreateReservationInput): Promise<Reservation> {
    const property = await this.propertyRepository.findPropertyById(
      input.propertyId,
    );
    if (!property) {
      throw new NotFoundException(`Property ${input.propertyId} not found`);
    }
    const checkIn = parseDateOnly(input.checkInDate);
    const checkOut = parseDateOnly(input.checkOutDate);
    if (!isBeforeDay(checkIn, checkOut)) {
      throw new BadRequestException(
        'checkInDate must be strictly before checkOutDate',
      );
    }
    let lastError: unknown;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const publicCode = buildPublicCode();
      const reservation = Reservation.create({
        propertyId: input.propertyId,
        publicCode,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        channel: input.channel,
        adults: input.adults,
        children: input.children,
        currency: input.currency,
        totalEstimated: input.totalEstimated ?? null,
        specialRequests: input.specialRequests ?? null,
        internalNotes: input.internalNotes ?? null,
      });
      try {
        await this.reservationRepository.createReservation(reservation);
        return reservation;
      } catch (e: unknown) {
        lastError = e;
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2002'
        ) {
          continue;
        }
        throw e;
      }
    }
    throw new ConflictException(
      `Could not allocate a unique reservation code: ${describeUnknownError(lastError)}`,
    );
  }
}
