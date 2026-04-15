import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { PaymentMethod } from '../../../../generated/prisma/enums';
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

export type AddPaymentInput = {
  propertyId: string;
  reservationId: string;
  method: PaymentMethod;
  amount: string;
  reference?: string | null;
  notes?: string | null;
};

@Injectable()
export class AddPaymentUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(FOLIO_REPOSITORY)
    private readonly folioRepository: FolioRepository,
  ) {}

  async execute(input: AddPaymentInput): Promise<FolioDetail> {
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
      throw new BadRequestException('Cannot add payments to a closed folio');
    }
    await this.folioRepository.addPayment({
      id: randomUUID(),
      folioId: folio.id,
      method: input.method,
      amount: input.amount,
      reference: input.reference ?? null,
      notes: input.notes ?? null,
    });
    const updated = await this.folioRepository.findFolioDetailByReservation(
      input.reservationId,
      input.propertyId,
    );
    if (!updated) {
      throw new NotFoundException('Folio not found after adding payment');
    }
    return updated;
  }
}
