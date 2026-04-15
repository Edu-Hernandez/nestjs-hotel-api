import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../../property/domain/repositories/property.repository';
import {
  ROOM_REPOSITORY,
  type RoomRepository,
} from '../../../room/domain/repositories/room.repository';
import { ReservationRoomAssignment } from '../../domain/entities/reservation-room-assignment.entity';
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

export type AssignReservationRoomInput = {
  propertyId: string;
  reservationId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  nightlyRate?: string | null;
  lineTotal?: string | null;
  lineCurrency?: string | null;
};

export type AssignReservationRoomResult = { assignmentId: string };

@Injectable()
export class AssignReservationRoomUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: RoomRepository,
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepository,
  ) {}

  async execute(
    input: AssignReservationRoomInput,
  ): Promise<AssignReservationRoomResult> {
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
    const room = await this.roomRepository.findRoomByIdAndProperty(
      input.roomId,
      input.propertyId,
    );
    if (!room) {
      throw new NotFoundException(
        `Room ${input.roomId} not found for this property`,
      );
    }
    const assignIn = parseDateOnly(input.checkInDate);
    const assignOut = parseDateOnly(input.checkOutDate);
    if (!isBeforeDay(assignIn, assignOut)) {
      throw new BadRequestException(
        'Room assignment checkInDate must be strictly before checkOutDate',
      );
    }
    if (
      !isOnOrAfterDay(assignIn, reservation.checkInDate) ||
      !isOnOrBeforeDay(assignOut, reservation.checkOutDate)
    ) {
      throw new BadRequestException(
        'Room assignment dates must fall within the reservation stay window',
      );
    }
    const overlaps =
      await this.reservationRepository.roomHasOverlappingAssignment(
        input.roomId,
        assignIn,
        assignOut,
      );
    if (overlaps) {
      throw new ConflictException(
        'Room is already assigned for overlapping dates in another reservation',
      );
    }
    const assignment = ReservationRoomAssignment.create({
      reservationId: input.reservationId,
      roomId: input.roomId,
      checkInDate: assignIn,
      checkOutDate: assignOut,
      nightlyRate: input.nightlyRate ?? null,
      lineTotal: input.lineTotal ?? null,
      lineCurrency: input.lineCurrency ?? null,
    });
    try {
      await this.reservationRepository.addReservationRoom(assignment);
    } catch (e: unknown) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(
          'This room is already assigned to this reservation',
        );
      }
      throw e;
    }
    return { assignmentId: assignment.id };
  }
}
