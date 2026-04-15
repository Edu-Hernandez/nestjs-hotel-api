import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import type { RatePlan } from '../../domain/entities/rate-plan.entity';
import type { Rate } from '../../domain/entities/rate.entity';
import type { RatePlanRepository } from '../../domain/repositories/rate-plan.repository';
import { RatePlanMapper } from './rate-plan.mapper';

@Injectable()
export class RatePlanPrismaRepository implements RatePlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveRatePlan(ratePlan: RatePlan): Promise<void> {
    const data = RatePlanMapper.toPersistenceRatePlan(ratePlan);
    await this.prisma.ratePlan.create({ data });
  }

  async updateRatePlan(ratePlan: RatePlan): Promise<void> {
    const data = RatePlanMapper.toPersistenceRatePlan(ratePlan);
    await this.prisma.ratePlan.update({
      where: { id: ratePlan.id },
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
        isActive: data.isActive,
        updatedAt: data.updatedAt,
      },
    });
  }

  async deleteRatePlan(
    ratePlanId: string,
    propertyId: string,
  ): Promise<number> {
    const result = await this.prisma.ratePlan.deleteMany({
      where: { id: ratePlanId, propertyId },
    });
    return result.count;
  }

  async findRatePlansByPropertyId(propertyId: string): Promise<RatePlan[]> {
    const rows = await this.prisma.ratePlan.findMany({
      where: { propertyId },
      orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
    });
    return rows.map((r) => RatePlanMapper.toDomainRatePlan(r));
  }

  async findRatePlanByIdAndProperty(
    ratePlanId: string,
    propertyId: string,
  ): Promise<RatePlan | null> {
    const row = await this.prisma.ratePlan.findFirst({
      where: { id: ratePlanId, propertyId },
    });
    return row ? RatePlanMapper.toDomainRatePlan(row) : null;
  }

  async saveRate(rate: Rate): Promise<void> {
    const data = RatePlanMapper.toPersistenceRate(rate);
    await this.prisma.rate.create({ data });
  }

  async updateRate(rate: Rate): Promise<void> {
    const data = RatePlanMapper.toPersistenceRate(rate);
    await this.prisma.rate.update({
      where: { id: rate.id },
      data: {
        roomTypeId: data.roomTypeId,
        validFrom: data.validFrom,
        validTo: data.validTo,
        amount: data.amount,
        currency: data.currency,
        updatedAt: data.updatedAt,
      },
    });
  }

  async deleteRate(
    rateId: string,
    ratePlanId: string,
    propertyId: string,
  ): Promise<number> {
    const result = await this.prisma.rate.deleteMany({
      where: {
        id: rateId,
        ratePlanId,
        ratePlan: { propertyId },
      },
    });
    return result.count;
  }

  async findRatesByRatePlanId(
    ratePlanId: string,
    propertyId: string,
  ): Promise<Rate[]> {
    const plan = await this.prisma.ratePlan.findFirst({
      where: { id: ratePlanId, propertyId },
    });
    if (!plan) {
      return [];
    }
    const rows = await this.prisma.rate.findMany({
      where: { ratePlanId },
      orderBy: [{ validFrom: 'asc' }, { roomTypeId: 'asc' }],
    });
    return rows.map((r) => RatePlanMapper.toDomainRate(r));
  }

  async findRateByIdAndProperty(
    rateId: string,
    ratePlanId: string,
    propertyId: string,
  ): Promise<Rate | null> {
    const row = await this.prisma.rate.findFirst({
      where: {
        id: rateId,
        ratePlanId,
        ratePlan: { propertyId },
      },
    });
    return row ? RatePlanMapper.toDomainRate(row) : null;
  }
}
