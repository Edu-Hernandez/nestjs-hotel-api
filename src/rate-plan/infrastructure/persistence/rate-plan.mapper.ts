import { Prisma } from '../../../../generated/prisma/client';
import { RatePlan } from '../../domain/entities/rate-plan.entity';
import { Rate } from '../../domain/entities/rate.entity';

function decimalToString(
  value: Prisma.Decimal | null | undefined,
): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  return value.toString();
}

function money(value: string): Prisma.Decimal {
  return new Prisma.Decimal(value);
}

export class RatePlanMapper {
  static toDomainRatePlan(row: {
    id: string;
    propertyId: string;
    name: string;
    code: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): RatePlan {
    return RatePlan.reconstitute({
      id: row.id,
      propertyId: row.propertyId,
      name: row.name,
      code: row.code,
      description: row.description,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistenceRatePlan(ratePlan: RatePlan) {
    return {
      id: ratePlan.id,
      propertyId: ratePlan.propertyId,
      name: ratePlan.name,
      code: ratePlan.code,
      description: ratePlan.description,
      isActive: ratePlan.isActive,
      createdAt: ratePlan.createdAt,
      updatedAt: ratePlan.updatedAt,
    };
  }

  static toDomainRate(row: {
    id: string;
    ratePlanId: string;
    roomTypeId: string;
    validFrom: Date;
    validTo: Date;
    amount: Prisma.Decimal;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
  }): Rate {
    return Rate.reconstitute({
      id: row.id,
      ratePlanId: row.ratePlanId,
      roomTypeId: row.roomTypeId,
      validFrom: row.validFrom,
      validTo: row.validTo,
      amount: decimalToString(row.amount) ?? '0',
      currency: row.currency,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistenceRate(rate: Rate) {
    return {
      id: rate.id,
      ratePlanId: rate.ratePlanId,
      roomTypeId: rate.roomTypeId,
      validFrom: rate.validFrom,
      validTo: rate.validTo,
      amount: money(rate.amount),
      currency: rate.currency,
      createdAt: rate.createdAt,
      updatedAt: rate.updatedAt,
    };
  }
}
