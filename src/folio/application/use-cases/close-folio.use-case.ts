import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FolioStatus } from '../../../../generated/prisma/enums';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../../property/domain/repositories/property.repository';
import type { FolioDetail } from '../../domain/types/folio-detail';
import {
  FOLIO_REPOSITORY,
  type FolioRepository,
} from '../../domain/repositories/folio.repository';

@Injectable()
export class CloseFolioUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(FOLIO_REPOSITORY)
    private readonly folioRepository: FolioRepository,
  ) {}

  async execute(
    propertyId: string,
    reservationId: string,
  ): Promise<FolioDetail> {
    const property = await this.propertyRepository.findPropertyById(propertyId);
    if (!property) {
      throw new NotFoundException(`Property ${propertyId} not found`);
    }
    const folio = await this.folioRepository.findFolioDetailByReservation(
      reservationId,
      propertyId,
    );
    if (!folio) {
      throw new NotFoundException('Folio not found for this reservation');
    }
    if (folio.status !== FolioStatus.OPEN) {
      throw new BadRequestException('Only an open folio can be closed');
    }
    await this.folioRepository.updateFolioStatus(
      reservationId,
      propertyId,
      FolioStatus.CLOSED,
      new Date(),
    );
    const updated = await this.folioRepository.findFolioDetailByReservation(
      reservationId,
      propertyId,
    );
    if (!updated) {
      throw new NotFoundException('Folio not found after close');
    }
    return updated;
  }
}
