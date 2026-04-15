import { Module } from '@nestjs/common';
import { CreatePropertyUseCase } from './application/use-cases/create-property.use-case';
import { GetPropertyByIdUseCase } from './application/use-cases/get-property-by-id.use-case';
import { ListPropertiesUseCase } from './application/use-cases/list-properties.use-case';
import { UpdatePropertyUseCase } from './application/use-cases/update-property.use-case';
import { PROPERTY_REPOSITORY } from './domain/repositories/property.repository';
import { PropertyPrismaRepository } from './infrastructure/persistence/property.prisma-repository';
import { PropertyController } from './presentation/property.controller';
import { PrismaModule } from '../shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PropertyController],
  providers: [
    {
      provide: PROPERTY_REPOSITORY,
      useClass: PropertyPrismaRepository,
    },
    CreatePropertyUseCase,
    ListPropertiesUseCase,
    GetPropertyByIdUseCase,
    UpdatePropertyUseCase,
  ],
  exports: [PROPERTY_REPOSITORY],
})
export class PropertyModule {}
