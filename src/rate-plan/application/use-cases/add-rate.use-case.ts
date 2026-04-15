import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Rate } from '../../domain/entities/rate.entity';
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

export type AddRateInput = {
  propertyId: string;
  ratePlanId: string;
  roomTypeId: string;
  validFrom: string;
  validTo: string;
  amount: string;
  currency?: string;
};

@Injectable()
export class AddRateUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(RATE_PLAN_REPOSITORY)
    private readonly ratePlanRepository: RatePlanRepository,
    @Inject(ROOM_TYPE_REPOSITORY)
    private readonly roomTypeRepository: RoomTypeRepository,
  ) {}

  async execute(input: AddRateInput): Promise<Rate> {
    const property = await this.propertyRepository.findPropertyById(
      input.propertyId,
    );
    if (!property) {
      throw new NotFoundException(`Property ${input.propertyId} not found`);
    }
    const plan = await this.ratePlanRepository.findRatePlanByIdAndProperty(
      input.ratePlanId,
      input.propertyId,
    );
    if (!plan) {
      throw new NotFoundException(
        `Rate plan ${input.ratePlanId} not found for this property`,
      );
    }
    const roomType = await this.roomTypeRepository.findRoomTypeByIdAndProperty(
      input.roomTypeId,
      input.propertyId,
    );
    if (!roomType) {
      throw new NotFoundException(
        `Room type ${input.roomTypeId} not found for this property`,
      );
    }
    const from = parseDateOnly(input.validFrom);
    const to = parseDateOnly(input.validTo);
    if (!isBeforeDay(from, to)) {
      throw new BadRequestException(
        'validFrom must be strictly before validTo',
      );
    }
    const rate = Rate.create({
      ratePlanId: input.ratePlanId,
      roomTypeId: input.roomTypeId,
      validFrom: from,
      validTo: to,
      amount: input.amount,
      currency: input.currency,
    });
    await this.ratePlanRepository.saveRate(rate);
    return rate;
  }
}
