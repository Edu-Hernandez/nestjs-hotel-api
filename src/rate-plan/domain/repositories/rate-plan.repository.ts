import type { RatePlan } from '../entities/rate-plan.entity';
import type { Rate } from '../entities/rate.entity';

export const RATE_PLAN_REPOSITORY = Symbol('RATE_PLAN_REPOSITORY');

export interface RatePlanRepository {
  saveRatePlan(ratePlan: RatePlan): Promise<void>;
  updateRatePlan(ratePlan: RatePlan): Promise<void>;
  deleteRatePlan(ratePlanId: string, propertyId: string): Promise<number>;
  findRatePlansByPropertyId(propertyId: string): Promise<RatePlan[]>;
  findRatePlanByIdAndProperty(
    ratePlanId: string,
    propertyId: string,
  ): Promise<RatePlan | null>;
  saveRate(rate: Rate): Promise<void>;
  updateRate(rate: Rate): Promise<void>;
  deleteRate(
    rateId: string,
    ratePlanId: string,
    propertyId: string,
  ): Promise<number>;
  findRatesByRatePlanId(
    ratePlanId: string,
    propertyId: string,
  ): Promise<Rate[]>;
  findRateByIdAndProperty(
    rateId: string,
    ratePlanId: string,
    propertyId: string,
  ): Promise<Rate | null>;
}
