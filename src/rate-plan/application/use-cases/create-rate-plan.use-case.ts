import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client';
import { RatePlan } from '../../domain/entities/rate-plan.entity';
import {
  PROPERTY_REPOSITORY,
  type PropertyRepository,
} from '../../../property/domain/repositories/property.repository';
import {
  RATE_PLAN_REPOSITORY,
  type RatePlanRepository,
} from '../../domain/repositories/rate-plan.repository';

export type CreateRatePlanInput = {
  propertyId: string;
  name: string;
  code: string;
  description?: string | null;
  isActive?: boolean;
};

@Injectable()
export class CreateRatePlanUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(RATE_PLAN_REPOSITORY)
    private readonly ratePlanRepository: RatePlanRepository,
  ) {}

  async execute(input: CreateRatePlanInput): Promise<RatePlan> {
    const property = await this.propertyRepository.findPropertyById(
      input.propertyId,
    );
    if (!property) {
      throw new NotFoundException(`Property ${input.propertyId} not found`);
    }
    const ratePlan = RatePlan.create({
      propertyId: input.propertyId,
      name: input.name,
      code: input.code,
      description: input.description,
      isActive: input.isActive,
    });
    try {
      await this.ratePlanRepository.saveRatePlan(ratePlan);
    } catch (e: unknown) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(
          'A rate plan with this code already exists for the property',
        );
      }
      throw e;
    }
    return ratePlan;
  }
}
