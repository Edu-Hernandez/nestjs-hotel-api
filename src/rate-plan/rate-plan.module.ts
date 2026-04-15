import { Module } from '@nestjs/common';
import { PropertyModule } from '../property/property.module';
import { RoomTypeModule } from '../room-type/room-type.module';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { AddRateUseCase } from './application/use-cases/add-rate.use-case';
import { CreateRatePlanUseCase } from './application/use-cases/create-rate-plan.use-case';
import { DeleteRatePlanUseCase } from './application/use-cases/delete-rate-plan.use-case';
import { DeleteRateUseCase } from './application/use-cases/delete-rate.use-case';
import { GetRatePlanUseCase } from './application/use-cases/get-rate-plan.use-case';
import { ListRatePlansUseCase } from './application/use-cases/list-rate-plans.use-case';
import { ListRatesUseCase } from './application/use-cases/list-rates.use-case';
import { UpdateRatePlanUseCase } from './application/use-cases/update-rate-plan.use-case';
import { UpdateRateUseCase } from './application/use-cases/update-rate.use-case';
import { RATE_PLAN_REPOSITORY } from './domain/repositories/rate-plan.repository';
import { RatePlanPrismaRepository } from './infrastructure/persistence/rate-plan.prisma-repository';
import { RatePlanController } from './presentation/rate-plan.controller';

@Module({
  imports: [PrismaModule, PropertyModule, RoomTypeModule],
  controllers: [RatePlanController],
  providers: [
    {
      provide: RATE_PLAN_REPOSITORY,
      useClass: RatePlanPrismaRepository,
    },
    CreateRatePlanUseCase,
    ListRatePlansUseCase,
    GetRatePlanUseCase,
    UpdateRatePlanUseCase,
    DeleteRatePlanUseCase,
    AddRateUseCase,
    ListRatesUseCase,
    UpdateRateUseCase,
    DeleteRateUseCase,
  ],
})
export class RatePlanModule {}
