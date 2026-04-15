import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { ChargeCategory } from '../../../../generated/prisma/enums';
import { FolioStatus } from '../../../../generated/prisma/enums';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../../property/domain/repositories/property.repository';
import {
  ROOM_REPOSITORY,
  type RoomRepository,
} from '../../../room/domain/repositories/room.repository';
import type { FolioDetail } from '../../domain/types/folio-detail';
import {
  FOLIO_REPOSITORY,
  type FolioRepository,
} from '../../domain/repositories/folio.repository';

export type UpdateChargeInput = {
  propertyId: string;
  reservationId: string;
  chargeId: string;
  category?: ChargeCategory;
  description?: string;
  quantity?: number;
  unitAmount?: string;
  totalAmount?: string;
  roomId?: string | null;
};

@Injectable()
export class UpdateChargeUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: RoomRepository,
    @Inject(FOLIO_REPOSITORY)
    private readonly folioRepository: FolioRepository,
  ) {}

  async execute(input: UpdateChargeInput): Promise<FolioDetail> {
    const property = await this.propertyRepository.findPropertyById(
      input.propertyId,
    );
    if (!property) {
      throw new NotFoundException(`Property ${input.propertyId} not found`);
    }
    const folio = await this.folioRepository.findFolioDetailByReservation(
      input.reservationId,
      input.propertyId,
    );
    if (!folio) {
      throw new NotFoundException('Folio not found for this reservation');
    }
    if (folio.status !== FolioStatus.OPEN) {
      throw new BadRequestException(
        'Charges can only be edited on an open folio',
      );
    }
    const hasPatch =
      input.category !== undefined ||
      input.description !== undefined ||
      input.quantity !== undefined ||
      input.unitAmount !== undefined ||
      input.totalAmount !== undefined ||
      input.roomId !== undefined;
    if (!hasPatch) {
      throw new BadRequestException('Provide at least one field to update');
    }
    if (input.roomId) {
      const room = await this.roomRepository.findRoomByIdAndProperty(
        input.roomId,
        input.propertyId,
      );
      if (!room) {
        throw new NotFoundException(
          `Room ${input.roomId} not found for this property`,
        );
      }
    }
    const n = await this.folioRepository.updateCharge({
      chargeId: input.chargeId,
      reservationId: input.reservationId,
      propertyId: input.propertyId,
      category: input.category,
      description: input.description,
      quantity: input.quantity,
      unitAmount: input.unitAmount,
      totalAmount: input.totalAmount,
      roomId: input.roomId,
    });
    if (n === 0) {
      throw new NotFoundException('Charge not found on this folio');
    }
    const updated = await this.folioRepository.findFolioDetailByReservation(
      input.reservationId,
      input.propertyId,
    );
    if (!updated) {
      throw new NotFoundException('Folio not found after update');
    }
    return updated;
  }
}
