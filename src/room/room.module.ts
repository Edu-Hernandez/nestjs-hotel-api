import { Module } from '@nestjs/common';
import { PropertyModule } from '../property/property.module';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { RoomTypeModule } from '../room-type/room-type.module';
import { CreateRoomUseCase } from './application/use-cases/create-room.use-case';
import { ListRoomsUseCase } from './application/use-cases/list-rooms.use-case';
import { UpdateRoomStatusUseCase } from './application/use-cases/update-room-status.use-case';
import { UpdateRoomUseCase } from './application/use-cases/update-room.use-case';
import { ROOM_REPOSITORY } from './domain/repositories/room.repository';
import { RoomPrismaRepository } from './infrastructure/persistence/room.prisma-repository';
import { RoomController } from './presentation/room.controller';

@Module({
  imports: [PrismaModule, PropertyModule, RoomTypeModule],
  controllers: [RoomController],
  providers: [
    {
      provide: ROOM_REPOSITORY,
      useClass: RoomPrismaRepository,
    },
    CreateRoomUseCase,
    ListRoomsUseCase,
    UpdateRoomStatusUseCase,
    UpdateRoomUseCase,
  ],
  exports: [ROOM_REPOSITORY],
})
export class RoomModule {}
