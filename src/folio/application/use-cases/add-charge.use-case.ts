import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
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

export type AddChargeInput = {
  propertyId: string;
  reservationId: string;
  category: ChargeCategory;
  description: string;
  quantity: number;
  unitAmount: string;
  totalAmount: string;
  roomId?: string | null;
};

@Injectable()
export class AddChargeUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: RoomRepository,
    @Inject(FOLIO_REPOSITORY)
    private readonly folioRepository: FolioRepository,
  ) {}

  async execute(input: AddChargeInput): Promise<FolioDetail> {
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
      throw new BadRequestException('Cannot add charges to a closed folio');
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
    await this.folioRepository.addCharge({
      id: randomUUID(),
      folioId: folio.id,
      category: input.category,
      description: input.description,
      quantity: input.quantity,
      unitAmount: input.unitAmount,
      totalAmount: input.totalAmount,
      roomId: input.roomId ?? null,
    });
    const updated = await this.folioRepository.findFolioDetailByReservation(
      input.reservationId,
      input.propertyId,
    );
    if (!updated) {
      throw new NotFoundException('Folio not found after adding charge');
    }
    return updated;
  }
}
