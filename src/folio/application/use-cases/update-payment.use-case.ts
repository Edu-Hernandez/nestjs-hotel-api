import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

export type UpdatePaymentInput = {
  propertyId: string;
  reservationId: string;
  paymentId: string;
  method?: PaymentMethod;
  amount?: string;
  reference?: string | null;
  notes?: string | null;
};

@Injectable()
export class UpdatePaymentUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(FOLIO_REPOSITORY)
    private readonly folioRepository: FolioRepository,
  ) {}

  async execute(input: UpdatePaymentInput): Promise<FolioDetail> {
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
        'Payments can only be edited on an open folio',
      );
    }
    const hasPatch =
      input.method !== undefined ||
      input.amount !== undefined ||
      input.reference !== undefined ||
      input.notes !== undefined;
    if (!hasPatch) {
      throw new BadRequestException('Provide at least one field to update');
    }
    const n = await this.folioRepository.updatePayment({
      paymentId: input.paymentId,
      reservationId: input.reservationId,
      propertyId: input.propertyId,
      method: input.method,
      amount: input.amount,
      reference: input.reference,
      notes: input.notes,
    });
    if (n === 0) {
      throw new NotFoundException('Payment not found on this folio');
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
