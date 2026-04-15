import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../../property/domain/repositories/property.repository';
import {
  RATE_PLAN_REPOSITORY,
  type RatePlanRepository,
} from '../../domain/repositories/rate-plan.repository';

@Injectable()
export class DeleteRatePlanUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(RATE_PLAN_REPOSITORY)
    private readonly ratePlanRepository: RatePlanRepository,
  ) {}

  async execute(propertyId: string, ratePlanId: string): Promise<void> {
    const property = await this.propertyRepository.findPropertyById(propertyId);
    if (!property) {
      throw new NotFoundException(`Property ${propertyId} not found`);
    }
    const removed = await this.ratePlanRepository.deleteRatePlan(
      ratePlanId,
      propertyId,
    );
    if (removed === 0) {
      throw new NotFoundException(
        `Rate plan ${ratePlanId} not found for this property`,
      );
    }
  }
}
