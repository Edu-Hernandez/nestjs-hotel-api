import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoomOperationalStatus } from '../../../generated/prisma/enums';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../property/domain/repositories/property.repository';
import { PrismaService } from '../../shared/prisma/prisma.service';
import {
  isBeforeDay,
  parseDateOnly,
} from '../../reservation/application/date-only';
import { RESERVATION_STATUSES_BLOCKING_INVENTORY } from '../../reservation/application/reservation-status.policy';

export type RoomAvailabilityRow = {
  roomId: string;
  number: string;
  floor: string | null;
  operationalStatus: RoomOperationalStatus;
  available: boolean;
  unavailableReasons: string[];
};

@Injectable()
export class GetAvailabilityUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    propertyId: string,
    fromIso: string,
    toIso: string,
  ): Promise<RoomAvailabilityRow[]> {
    const property = await this.propertyRepository.findPropertyById(propertyId);
    if (!property) {
      throw new NotFoundException(`Property ${propertyId} not found`);
    }
    const rangeFrom = parseDateOnly(fromIso);
    const rangeTo = parseDateOnly(toIso);
    if (!isBeforeDay(rangeFrom, rangeTo)) {
      throw new BadRequestException(
        'Invalid range: "from" must be strictly before "to"',
      );
    }
    const rooms = await this.prisma.room.findMany({
      where: { propertyId },
      orderBy: [{ floor: 'asc' }, { number: 'asc' }],
    });
    const rows: RoomAvailabilityRow[] = [];
    for (const room of rooms) {
      const unavailableReasons: string[] = [];
      if (room.operationalStatus !== RoomOperationalStatus.AVAILABLE) {
        unavailableReasons.push(
          `Room operational status is ${room.operationalStatus}`,
        );
      }
      const assignment = await this.prisma.reservationRoom.findFirst({
        where: {
          roomId: room.id,
          AND: [
            { checkInDate: { lt: rangeTo } },
            { checkOutDate: { gt: rangeFrom } },
          ],
          reservation: {
            propertyId,
            status: { in: [...RESERVATION_STATUSES_BLOCKING_INVENTORY] },
          },
        },
        select: {
          reservation: { select: { publicCode: true } },
        },
      });
      if (assignment) {
        unavailableReasons.push(
          `Overlapping reservation assignment (${assignment.reservation.publicCode})`,
        );
      }
      const block = await this.prisma.roomBlock.findFirst({
        where: {
          roomId: room.id,
          AND: [{ startDate: { lt: rangeTo } }, { endDate: { gt: rangeFrom } }],
        },
        select: { id: true, reason: true },
      });
      if (block) {
        unavailableReasons.push(
          block.reason
            ? `Room block overlaps window (${block.reason})`
            : 'Room block overlaps window',
        );
      }
      rows.push({
        roomId: room.id,
        number: room.number,
        floor: room.floor,
        operationalStatus: room.operationalStatus,
        available: unavailableReasons.length === 0,
        unavailableReasons,
      });
    }
    return rows;
  }
}
