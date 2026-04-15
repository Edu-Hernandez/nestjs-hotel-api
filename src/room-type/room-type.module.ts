import { Module } from '@nestjs/common';
import { PropertyModule } from '../property/property.module';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { AddRoomTypeUseCase } from './application/use-cases/add-room-type.use-case';
import { ListRoomTypesUseCase } from './application/use-cases/list-room-types.use-case';
import { UpdateRoomTypeUseCase } from './application/use-cases/update-room-type.use-case';
import { ROOM_TYPE_REPOSITORY } from './domain/repositories/room-type.repository';
import { RoomTypePrismaRepository } from './infrastructure/persistence/room-type.prisma-repository';
import { RoomTypeController } from './presentation/room-type.controller';

@Module({
  imports: [PrismaModule, PropertyModule],
  controllers: [RoomTypeController],
  providers: [
    {
      provide: ROOM_TYPE_REPOSITORY,
      useClass: RoomTypePrismaRepository,
    },
    AddRoomTypeUseCase,
    ListRoomTypesUseCase,
    UpdateRoomTypeUseCase,
  ],
  exports: [ROOM_TYPE_REPOSITORY],
})
export class RoomTypeModule {}
