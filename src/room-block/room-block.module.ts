import { Module } from '@nestjs/common';
import { PropertyModule } from '../property/property.module';
import { RoomModule } from '../room/room.module';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { CreateRoomBlockUseCase } from './application/use-cases/create-room-block.use-case';
import { DeleteRoomBlockUseCase } from './application/use-cases/delete-room-block.use-case';
import { ListRoomBlocksUseCase } from './application/use-cases/list-room-blocks.use-case';
import { UpdateRoomBlockUseCase } from './application/use-cases/update-room-block.use-case';
import { ROOM_BLOCK_REPOSITORY } from './domain/repositories/room-block.repository';
import { RoomBlockPrismaRepository } from './infrastructure/persistence/room-block.prisma-repository';
import { RoomBlockController } from './presentation/room-block.controller';

@Module({
  imports: [PrismaModule, PropertyModule, RoomModule],
  controllers: [RoomBlockController],
  providers: [
    {
      provide: ROOM_BLOCK_REPOSITORY,
      useClass: RoomBlockPrismaRepository,
    },
    CreateRoomBlockUseCase,
    ListRoomBlocksUseCase,
    UpdateRoomBlockUseCase,
    DeleteRoomBlockUseCase,
  ],
})
export class RoomBlockModule {}
