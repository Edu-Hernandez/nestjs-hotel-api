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
import {
  FOLIO_REPOSITORY,
  type FolioRepository,
} from '../../domain/repositories/folio.repository';

@Injectable()
export class DeleteChargeUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(FOLIO_REPOSITORY)
    private readonly folioRepository: FolioRepository,
  ) {}

  async execute(
    propertyId: string,
    reservationId: string,
    chargeId: string,
  ): Promise<void> {
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
      throw new BadRequestException(
        'Charges can only be deleted on an open folio',
      );
    }
    const n = await this.folioRepository.deleteCharge(
      chargeId,
      reservationId,
      propertyId,
    );
    if (n === 0) {
      throw new NotFoundException('Charge not found on this folio');
    }
  }
}
