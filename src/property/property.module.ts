import { Module } from '@nestjs/common';
import { AddRoomTypeUseCase } from './application/use-cases/add-room-type.use-case';
import { CreatePropertyUseCase } from './application/use-cases/create-property.use-case';
import { CreateRoomUseCase } from './application/use-cases/create-room.use-case';
import { GetPropertyByIdUseCase } from './application/use-cases/get-property-by-id.use-case';
import { ListPropertiesUseCase } from './application/use-cases/list-properties.use-case';
import { ListRoomTypesUseCase } from './application/use-cases/list-room-types.use-case';
import { ListRoomsUseCase } from './application/use-cases/list-rooms.use-case';
import { UpdateRoomStatusUseCase } from './application/use-cases/update-room-status.use-case';
import { PROPERTY_REPOSITORY } from './domain/repositories/property.repository';
import { PropertyPrismaRepository } from './infrastructure/persistence/property.prisma-repository';
import { PropertyController } from './presentation/property.controller';

@Module({
  controllers: [PropertyController],
  providers: [
    {
      provide: PROPERTY_REPOSITORY,
      useClass: PropertyPrismaRepository,
    },
    CreatePropertyUseCase,
    ListPropertiesUseCase,
    GetPropertyByIdUseCase,
    AddRoomTypeUseCase,
    ListRoomTypesUseCase,
    CreateRoomUseCase,
    ListRoomsUseCase,
    UpdateRoomStatusUseCase,
  ],
})
export class PropertyModule {}
