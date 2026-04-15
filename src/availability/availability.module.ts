import { Module } from '@nestjs/common';
import { PropertyModule } from '../property/property.module';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { GetAvailabilityUseCase } from './application/get-availability.use-case';
import { AvailabilityController } from './presentation/availability.controller';

@Module({
  imports: [PrismaModule, PropertyModule],
  controllers: [AvailabilityController],
  providers: [GetAvailabilityUseCase],
})
export class AvailabilityModule {}
