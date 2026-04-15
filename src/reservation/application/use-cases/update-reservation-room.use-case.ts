import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../../property/domain/repositories/property.repository';
import {
  ROOM_REPOSITORY,
  type RoomRepository,
} from '../../../room/domain/repositories/room.repository';
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

export type UpdateReservationRoomInput = {
  propertyId: string;
  reservationId: string;
  assignmentId: string;
  checkInDate: string;
  checkOutDate: string;
  nightlyRate?: string | null;
  lineTotal?: string | null;
  lineCurrency?: string | null;
};

@Injectable()
export class UpdateReservationRoomUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: RoomRepository,
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepository,
  ) {}

  async execute(input: UpdateReservationRoomInput): Promise<void> {
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
    const detail =
      await this.reservationRepository.findReservationDetailByIdAndProperty(
        input.reservationId,
        input.propertyId,
      );
    if (!detail) {
      throw new NotFoundException('Reservation detail not found');
    }
    const assignment = detail.rooms.find(
      (r) => r.assignmentId === input.assignmentId,
    );
    if (!assignment) {
      throw new NotFoundException(
        `Room assignment ${input.assignmentId} not found on this reservation`,
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
    const room = await this.roomRepository.findRoomByIdAndProperty(
      assignment.roomId,
      input.propertyId,
    );
    if (!room) {
      throw new NotFoundException(`Room ${assignment.roomId} not found`);
    }
    const overlaps =
      await this.reservationRepository.roomHasOverlappingAssignment(
        assignment.roomId,
        assignIn,
        assignOut,
        input.assignmentId,
      );
    if (overlaps) {
      throw new ConflictException(
        'Room is already assigned for overlapping dates in another reservation',
      );
    }
    await this.reservationRepository.updateReservationRoom(
      input.reservationId,
      input.propertyId,
      input.assignmentId,
      {
        checkInDate: assignIn,
        checkOutDate: assignOut,
        nightlyRate: input.nightlyRate ?? null,
        lineTotal: input.lineTotal ?? null,
        lineCurrency: input.lineCurrency ?? null,
      },
    );
  }
}
