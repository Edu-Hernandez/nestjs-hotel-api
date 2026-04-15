import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Rate } from '../../domain/entities/rate.entity';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../../property/domain/repositories/property.repository';
import {
  ROOM_TYPE_REPOSITORY,
  type RoomTypeRepository,
} from '../../../room-type/domain/repositories/room-type.repository';
import {
  RATE_PLAN_REPOSITORY,
  type RatePlanRepository,
} from '../../domain/repositories/rate-plan.repository';
import {
  isBeforeDay,
  parseDateOnly,
} from '../../../reservation/application/date-only';

export type UpdateRateInput = {
  propertyId: string;
  ratePlanId: string;
  rateId: string;
  roomTypeId?: string;
  validFrom?: string;
  validTo?: string;
  amount?: string;
  currency?: string;
};

@Injectable()
export class UpdateRateUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(RATE_PLAN_REPOSITORY)
    private readonly ratePlanRepository: RatePlanRepository,
    @Inject(ROOM_TYPE_REPOSITORY)
    private readonly roomTypeRepository: RoomTypeRepository,
  ) {}

  async execute(input: UpdateRateInput): Promise<Rate> {
    const property = await this.propertyRepository.findPropertyById(
      input.propertyId,
    );
    if (!property) {
      throw new NotFoundException(`Property ${input.propertyId} not found`);
    }
    const existing = await this.ratePlanRepository.findRateByIdAndProperty(
      input.rateId,
      input.ratePlanId,
      input.propertyId,
    );
    if (!existing) {
      throw new NotFoundException('Rate not found for this plan and property');
    }
    if (input.roomTypeId) {
      const rt = await this.roomTypeRepository.findRoomTypeByIdAndProperty(
        input.roomTypeId,
        input.propertyId,
      );
      if (!rt) {
        throw new NotFoundException(
          `Room type ${input.roomTypeId} not found for this property`,
        );
      }
    }
    const from =
      input.validFrom !== undefined
        ? parseDateOnly(input.validFrom)
        : existing.validFrom;
    const to =
      input.validTo !== undefined
        ? parseDateOnly(input.validTo)
        : existing.validTo;
    if (!isBeforeDay(from, to)) {
      throw new BadRequestException(
        'validFrom must be strictly before validTo',
      );
    }
    const updated = existing.withUpdates({
      roomTypeId: input.roomTypeId,
      validFrom: input.validFrom !== undefined ? from : undefined,
      validTo: input.validTo !== undefined ? to : undefined,
      amount: input.amount,
      currency: input.currency,
    });
    await this.ratePlanRepository.updateRate(updated);
    return updated;
  }
}
