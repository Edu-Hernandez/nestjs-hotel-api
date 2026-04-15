import type { RatePlan } from '../domain/entities/rate-plan.entity';
import type { Rate } from '../domain/entities/rate.entity';

export function presentRatePlan(p: RatePlan) {
  return {
    id: p.id,
    propertyId: p.propertyId,
    name: p.name,
    code: p.code,
    description: p.description,
    isActive: p.isActive,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export function presentRate(r: Rate) {
  return {
    id: r.id,
    ratePlanId: r.ratePlanId,
    roomTypeId: r.roomTypeId,
    validFrom: r.validFrom.toISOString().slice(0, 10),
    validTo: r.validTo.toISOString().slice(0, 10),
    amount: r.amount,
    currency: r.currency,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}
