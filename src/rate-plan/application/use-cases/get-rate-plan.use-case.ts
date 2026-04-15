import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { RatePlan } from '../../domain/entities/rate-plan.entity';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../../property/domain/repositories/property.repository';
import {
  RATE_PLAN_REPOSITORY,
  type RatePlanRepository,
} from '../../domain/repositories/rate-plan.repository';

@Injectable()
export class GetRatePlanUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(RATE_PLAN_REPOSITORY)
    private readonly ratePlanRepository: RatePlanRepository,
  ) {}

  async execute(propertyId: string, ratePlanId: string): Promise<RatePlan> {
    const property = await this.propertyRepository.findPropertyById(propertyId);
    if (!property) {
      throw new NotFoundException(`Property ${propertyId} not found`);
    }
    const plan = await this.ratePlanRepository.findRatePlanByIdAndProperty(
      ratePlanId,
      propertyId,
    );
    if (!plan) {
      throw new NotFoundException(
        `Rate plan ${ratePlanId} not found for this property`,
      );
    }
    return plan;
  }
}
