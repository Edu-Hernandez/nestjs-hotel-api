import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import type { ReservationGuestLink } from '../../domain/entities/reservation-guest-link.entity';
import type { ReservationRoomAssignment } from '../../domain/entities/reservation-room-assignment.entity';
import type { Reservation } from '../../domain/entities/reservation.entity';
import type {
  ListReservationsFilters,
  ReservationFieldsPatch,
  ReservationRepository,
  ReservationRoomPatch,
} from '../../domain/repositories/reservation.repository';
import type { ReservationDetail } from '../../domain/types/reservation-detail';
import { ReservationMapper } from './reservation.mapper';

function optionalMoney(value: string | null): Prisma.Decimal | null {
  if (value === null || value === '') {
    return null;
  }
  return new Prisma.Decimal(value);
}

@Injectable()
export class ReservationPrismaRepository implements ReservationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createReservation(reservation: Reservation): Promise<void> {
    const data = ReservationMapper.toPersistenceCreate(reservation);
    await this.prisma.reservation.create({ data });
  }

  async findReservationByIdAndProperty(
    id: string,
    propertyId: string,
  ): Promise<Reservation | null> {
    const row = await this.prisma.reservation.findFirst({
      where: { id, propertyId },
    });
    return row ? ReservationMapper.toDomainReservation(row) : null;
  }

  async findReservationDetailByIdAndProperty(
    id: string,
    propertyId: string,
  ): Promise<ReservationDetail | null> {
    const row = await this.prisma.reservation.findFirst({
      where: { id, propertyId },
      include: {
        reservationGuests: {
          include: { guest: true },
        },
        reservationRooms: {
          include: {
            room: { select: { id: true, number: true, floor: true } },
          },
        },
      },
    });
    return row ? ReservationMapper.toDomainDetail(row) : null;
  }

  async findReservationsByPropertyId(
    propertyId: string,
    filters: ListReservationsFilters,
  ): Promise<Reservation[]> {
    const where: Prisma.ReservationWhereInput = { propertyId };
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.checkInFrom || filters.checkInTo) {
      where.checkInDate = {};
      if (filters.checkInFrom) {
        where.checkInDate.gte = filters.checkInFrom;
      }
      if (filters.checkInTo) {
        where.checkInDate.lte = filters.checkInTo;
      }
    }
    const rows = await this.prisma.reservation.findMany({
      where,
      orderBy: [{ checkInDate: 'desc' }, { publicCode: 'asc' }],
    });
    return rows.map((r) => ReservationMapper.toDomainReservation(r));
  }

  async updateReservation(
    reservationId: string,
    propertyId: string,
    patch: ReservationFieldsPatch,
  ): Promise<void> {
    const data: Prisma.ReservationUpdateManyMutationInput = {
      updatedAt: new Date(),
    };
    if (patch.checkInDate !== undefined) {
      data.checkInDate = patch.checkInDate;
    }
    if (patch.checkOutDate !== undefined) {
      data.checkOutDate = patch.checkOutDate;
    }
    if (patch.channel !== undefined) {
      data.channel = patch.channel;
    }
    if (patch.adults !== undefined) {
      data.adults = patch.adults;
    }
    if (patch.children !== undefined) {
      data.children = patch.children;
    }
    if (patch.currency !== undefined) {
      data.currency = patch.currency.toUpperCase().slice(0, 3);
    }
    if (patch.totalEstimated !== undefined) {
      data.totalEstimated = optionalMoney(patch.totalEstimated);
    }
    if (patch.specialRequests !== undefined) {
      data.specialRequests = patch.specialRequests;
    }
    if (patch.internalNotes !== undefined) {
      data.internalNotes = patch.internalNotes;
    }
    if (patch.status !== undefined) {
      data.status = patch.status;
    }
    if (patch.actualCheckInAt !== undefined) {
      data.actualCheckInAt = patch.actualCheckInAt;
    }
    if (patch.actualCheckOutAt !== undefined) {
      data.actualCheckOutAt = patch.actualCheckOutAt;
    }
    if (patch.cancelledAt !== undefined) {
      data.cancelledAt = patch.cancelledAt;
    }
    if (patch.cancellationReason !== undefined) {
      data.cancellationReason = patch.cancellationReason;
    }
    await this.prisma.reservation.updateMany({
      where: { id: reservationId, propertyId },
      data,
    });
  }

  async addReservationGuest(link: ReservationGuestLink): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      if (link.isPrimary) {
        await tx.reservationGuest.updateMany({
          where: { reservationId: link.reservationId },
          data: { isPrimary: false },
        });
      }
      await tx.reservationGuest.create({
        data: {
          id: link.id,
          reservationId: link.reservationId,
          guestId: link.guestId,
          isPrimary: link.isPrimary,
        },
      });
    });
  }

  async reservationGuestExists(
    reservationId: string,
    guestId: string,
  ): Promise<boolean> {
    const row = await this.prisma.reservationGuest.findUnique({
      where: {
        reservationId_guestId: { reservationId, guestId },
      },
    });
    return row !== null;
  }

  async addReservationRoom(
    assignment: ReservationRoomAssignment,
  ): Promise<void> {
    await this.prisma.reservationRoom.create({
      data: {
        id: assignment.id,
        reservationId: assignment.reservationId,
        roomId: assignment.roomId,
        checkInDate: assignment.checkInDate,
        checkOutDate: assignment.checkOutDate,
        nightlyRate: optionalMoney(assignment.nightlyRate),
        lineTotal: optionalMoney(assignment.lineTotal),
        lineCurrency: assignment.lineCurrency,
        assignedAt: assignment.assignedAt,
      },
    });
  }

  async roomHasOverlappingAssignment(
    roomId: string,
    checkInDate: Date,
    checkOutDate: Date,
    excludeReservationRoomId?: string,
  ): Promise<boolean> {
    const overlap = await this.prisma.reservationRoom.findFirst({
      where: {
        roomId,
        ...(excludeReservationRoomId
          ? { NOT: { id: excludeReservationRoomId } }
          : {}),
        AND: [
          { checkInDate: { lt: checkOutDate } },
          { checkOutDate: { gt: checkInDate } },
        ],
      },
    });
    return overlap !== null;
  }

  async deleteReservationGuest(
    reservationId: string,
    propertyId: string,
    guestId: string,
  ): Promise<number> {
    const result = await this.prisma.reservationGuest.deleteMany({
      where: {
        guestId,
        reservationId,
        reservation: { id: reservationId, propertyId },
      },
    });
    return result.count;
  }

  async setReservationGuestPrimary(
    reservationId: string,
    propertyId: string,
    guestId: string,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.reservationGuest.updateMany({
        where: {
          reservationId,
          reservation: { id: reservationId, propertyId },
        },
        data: { isPrimary: false },
      });
      await tx.reservationGuest.update({
        where: {
          reservationId_guestId: { reservationId, guestId },
        },
        data: { isPrimary: true },
      });
    });
  }

  async deleteReservationRoom(
    reservationId: string,
    propertyId: string,
    assignmentId: string,
  ): Promise<number> {
    const result = await this.prisma.reservationRoom.deleteMany({
      where: {
        id: assignmentId,
        reservationId,
        reservation: { id: reservationId, propertyId },
      },
    });
    return result.count;
  }

  async updateReservationRoom(
    reservationId: string,
    propertyId: string,
    assignmentId: string,
    patch: ReservationRoomPatch,
  ): Promise<void> {
    await this.prisma.reservationRoom.updateMany({
      where: {
        id: assignmentId,
        reservationId,
        reservation: { id: reservationId, propertyId },
      },
      data: {
        checkInDate: patch.checkInDate,
        checkOutDate: patch.checkOutDate,
        nightlyRate: optionalMoney(patch.nightlyRate),
        lineTotal: optionalMoney(patch.lineTotal),
        lineCurrency: patch.lineCurrency,
      },
    });
  }
}
