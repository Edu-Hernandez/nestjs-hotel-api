import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Prisma } from '../../../../generated/prisma/client';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../../property/domain/repositories/property.repository';
import type { FolioDetail } from '../../domain/types/folio-detail';
import {
  FOLIO_REPOSITORY,
  type FolioRepository,
} from '../../domain/repositories/folio.repository';

export type OpenFolioInput = {
  propertyId: string;
  reservationId: string;
  currency?: string;
};

@Injectable()
export class OpenFolioUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(FOLIO_REPOSITORY)
    private readonly folioRepository: FolioRepository,
  ) {}

  async execute(input: OpenFolioInput): Promise<FolioDetail> {
    const property = await this.propertyRepository.findPropertyById(
      input.propertyId,
    );
    if (!property) {
      throw new NotFoundException(`Property ${input.propertyId} not found`);
    }
    const ok = await this.folioRepository.reservationBelongsToProperty(
      input.reservationId,
      input.propertyId,
    );
    if (!ok) {
      throw new NotFoundException(
        `Reservation ${input.reservationId} not found for this property`,
      );
    }
    const existing = await this.folioRepository.findFolioDetailByReservation(
      input.reservationId,
      input.propertyId,
    );
    if (existing) {
      throw new ConflictException('This reservation already has a folio');
    }
    const currency =
      input.currency ??
      (await this.folioRepository.getReservationCurrency(
        input.reservationId,
        input.propertyId,
      )) ??
      'USD';
    const id = randomUUID();
    try {
      await this.folioRepository.createFolio({
        id,
        reservationId: input.reservationId,
        currency,
      });
    } catch (e: unknown) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('This reservation already has a folio');
      }
      throw e;
    }
    const created = await this.folioRepository.findFolioDetailByReservation(
      input.reservationId,
      input.propertyId,
    );
    if (!created) {
      throw new NotFoundException('Folio could not be loaded after creation');
    }
    return created;
  }
}
